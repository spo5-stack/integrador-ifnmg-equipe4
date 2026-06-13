import { ReadlineParser } from '@serialport/parser-readline'
import { SerialPort } from 'serialport'
import z from 'zod'
import { env } from '@/env/index.js'

const LeituraSchema = z.object({
	luminosidade: z.number().int().min(0).max(100),
})

const { DISPOSITIVOS_ID, PORTA_SERIAL, VELOCIDADE_SERIAL, URL_BACKEND } = env

const serial = new SerialPort({
	path: PORTA_SERIAL,
	baudRate: VELOCIDADE_SERIAL,
	autoOpen: false,
})

const leitor = serial.pipe(new ReadlineParser({ delimiter: '\n' }))

let intervalo = 5_000

function conectar() {
	serial.open((erro) => {
		if (erro) {
			console.error(
				`Erro ao abrir serial, tentando novamente em ${intervalo / 1000}s: ${erro.message}`,
			)
			setTimeout(conectar, intervalo)
			if (intervalo < 60_000) intervalo += 5_000
		}
	})
}

serial.on('open', () => {
	intervalo = 5_000
	console.log(
		`Porta serial aberta em ${PORTA_SERIAL} com velocidade ${VELOCIDADE_SERIAL}`,
	)
})

serial.on('close', () => {
	console.warn('Porta serial fechada, reconectando em 5s...')
	setTimeout(conectar, 5_000)
})

serial.on('error', (erro) => {
	console.error('Erro na porta serial:', erro.message)
})

leitor.on('data', (linha: string) => {
	try {
		const resultado = LeituraSchema.safeParse(JSON.parse(linha))

		if (!resultado.success) {
			console.error('Leitura inválida:', resultado.error.issues)
			return
		}

		const valor = String(resultado.data.luminosidade).padStart(3)
		console.log(`╔═══════════════════════════╗`)
		console.log(`║  Luminosidade: ${valor}%   ║`)
		console.log(`╚═══════════════════════════╝`)

		enviarLeitura({
			luminosidade: resultado.data.luminosidade,
			dispositivosId: DISPOSITIVOS_ID,
		})
	} catch (erro) {
		if (erro instanceof Error) {
			console.error('Falha ao processar linha recebida:', erro.message)
		}
	}
})

async function enviarLeitura(dados: {
	luminosidade: number
	dispositivosId: string
}) {
	try {
		const resposta = await fetch(URL_BACKEND, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify([dados]),
		})

		if (!resposta.ok) {
			if (resposta.status === 422) {
				console.error(
					`Dispositivo ${dados.dispositivosId} inválido ou desativado. Encerrando...`,
				)
				serial.close()
				process.exit(1)
			}
			console.error(`Falha ao enviar leitura: HTTP ${resposta.status}`)
			return
		}

		console.log(`Leitura enviada com sucesso: ${dados.luminosidade}%`)
	} catch (erro) {
		console.error('Falha ao enviar leitura:', erro)
	}
}

conectar()
