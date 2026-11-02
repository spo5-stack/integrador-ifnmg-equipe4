import { createHash, randomBytes, randomInt } from 'node:crypto'
import { hash, verify } from 'argon2'
import {
	buscarPorEmail,
	criarUsuario,
	type RegistrarDados,
} from '../models/auth.model.js'
import {
	buscarCodigoAtivo,
	buscarCodigoPorResetToken,
	criarCodigoRecuperacao,
	incrementarTentativasCodigo,
	invalidarCodigosAtivos,
	redefinirSenhaComCodigo,
	salvarResetToken,
} from '../models/recuperacao-senha.model.js'
import { enviarCodigoRecuperacaoSenha } from '../shared/mail/mailer.js'
import { RateLimiter } from '../shared/utils/rate-limit.js'
import { CodigoRecuperacaoInvalidoError } from './errors/codigo-recuperacao-invalido.error.js'
import { CredenciaisInvalidasError } from './errors/credenciais-invalidas.error.js'
import { EmailCadastradoError } from './errors/email-cadastrado.error.js'
import { MuitasSolicitacoesError } from './errors/muitas-solicitacoes.error.js'
import { TentativasRecuperacaoExcedidasError } from './errors/tentativas-recuperacao-excedidas.error.js'
import { TokenRedefinicaoInvalidoError } from './errors/token-redefinicao-invalido.error.js'

const CODIGO_TTL_MS = 10 * 60 * 1000
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000
const MAX_TENTATIVAS = 5

// Limites em memória: reiniciar o servidor zera os contadores.
const solicitacaoPorEmailImediata = new RateLimiter(60 * 1000, 1)
const solicitacaoPorEmailHoraria = new RateLimiter(60 * 60 * 1000, 5)
const solicitacaoPorIp = new RateLimiter(60 * 1000, 10)
const verificacaoPorIp = new RateLimiter(60 * 1000, 20)
const redefinicaoPorIp = new RateLimiter(15 * 60 * 1000, 10)

function gerarCodigo() {
	return randomInt(0, 1_000_000).toString().padStart(6, '0')
}

function hashResetToken(resetToken: string) {
	return createHash('sha256').update(resetToken).digest('hex')
}

export async function registerService(dados: RegistrarDados) {
	const existente = await buscarPorEmail(dados.email)

	if (existente) {
		throw new EmailCadastradoError()
	}

	const senhaHash = await hash(dados.senha)
	return criarUsuario({ ...dados, senha: senhaHash })
}

export async function loginService(email: string, senha: string) {
	const usuario = await buscarPorEmail(email.toLowerCase())

	if (!usuario) {
		throw new CredenciaisInvalidasError()
	}

	const valida = await verify(usuario.senha, senha)

	if (!valida) {
		throw new CredenciaisInvalidasError()
	}

	return {
		id: usuario.id,
		nome: usuario.nome,
		email: usuario.email,
		tokenVersion: usuario.tokenVersion,
	}
}

export async function solicitarRecuperacaoService(email: string, ip: string) {
	const emailNormalizado = email.toLowerCase()

	if (!solicitacaoPorIp.permitir(ip)) {
		throw new MuitasSolicitacoesError()
	}
	if (!solicitacaoPorEmailImediata.permitir(emailNormalizado)) {
		throw new MuitasSolicitacoesError()
	}
	if (!solicitacaoPorEmailHoraria.permitir(emailNormalizado)) {
		throw new MuitasSolicitacoesError()
	}

	const usuario = await buscarPorEmail(emailNormalizado)

	// E-mail inexistente encerra aqui, com a mesma resposta genérica.
	if (!usuario) return

	await invalidarCodigosAtivos(usuario.id)

	const codigo = gerarCodigo()
	const codigoHash = await hash(codigo)

	await criarCodigoRecuperacao({
		usuarioId: usuario.id,
		codigoHash,
		expiraEm: new Date(Date.now() + CODIGO_TTL_MS),
	})

	// Envio em background: o tempo de resposta não revela se o e-mail existe.
	void enviarCodigoRecuperacaoSenha({
		para: usuario.email,
		nome: usuario.nome,
		codigo,
	}).catch((erro) => {
		console.error('[recuperacao-senha] Falha ao enviar e-mail', erro)
	})
}

export async function verificarCodigoService(
	email: string,
	codigo: string,
	ip: string,
) {
	if (!verificacaoPorIp.permitir(ip)) {
		throw new MuitasSolicitacoesError()
	}

	const usuario = await buscarPorEmail(email.toLowerCase())

	if (!usuario) {
		throw new CodigoRecuperacaoInvalidoError()
	}

	const registro = await buscarCodigoAtivo(usuario.id)

	if (!registro) {
		throw new CodigoRecuperacaoInvalidoError()
	}

	if (registro.tentativas >= MAX_TENTATIVAS) {
		throw new TentativasRecuperacaoExcedidasError()
	}

	const valido = await verify(registro.codigoHash, codigo)

	if (!valido) {
		const tentativas = await incrementarTentativasCodigo(registro.id)

		if (tentativas >= MAX_TENTATIVAS) {
			throw new TentativasRecuperacaoExcedidasError()
		}

		throw new CodigoRecuperacaoInvalidoError()
	}

	const resetToken = randomBytes(32).toString('hex')

	await salvarResetToken(
		registro.id,
		hashResetToken(resetToken),
		new Date(Date.now() + RESET_TOKEN_TTL_MS),
	)

	return {
		resetToken,
		expiraEm: Math.floor(RESET_TOKEN_TTL_MS / 1000),
	}
}

export async function redefinirSenhaService(
	resetToken: string,
	senha: string,
	ip: string,
) {
	if (!redefinicaoPorIp.permitir(ip)) {
		throw new MuitasSolicitacoesError()
	}

	const registro = await buscarCodigoPorResetToken(hashResetToken(resetToken))

	if (!registro) {
		throw new TokenRedefinicaoInvalidoError()
	}

	const senhaHash = await hash(senha)

	const usuario = await redefinirSenhaComCodigo({
		codigoId: registro.id,
		usuarioId: registro.usuarioId,
		senhaHash,
	})

	if (!usuario) {
		throw new TokenRedefinicaoInvalidoError()
	}
}
