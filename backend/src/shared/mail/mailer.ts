import nodemailer, { type Transporter } from 'nodemailer'
import { env } from '@/env/index.js'

const smtpConfigurado = Boolean(
	env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS,
)

let transporter: Transporter | null = null

function obterTransporter(): Transporter | null {
	if (!smtpConfigurado) return null

	if (!transporter) {
		transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			secure: env.SMTP_SECURE,
			auth: {
				user: env.SMTP_USER,
				pass: env.SMTP_PASS,
			},
			connectionTimeout: 10_000,
			greetingTimeout: 10_000,
			socketTimeout: 15_000,
		})
	}

	return transporter
}

export async function enviarCodigoRecuperacaoSenha(data: {
	para: string
	nome: string
	codigo: string
}) {
	const transporte = obterTransporter()

	if (!transporte) {
		if (env.NODE_ENV === 'production') {
			throw new Error(
				'SMTP não configurado. Defina SMTP_HOST, SMTP_USER e SMTP_PASS.',
			)
		}

		console.info(
			`[recuperacao-senha] Código para ${data.para}: ${data.codigo}`,
		)
		return
	}

	const remetente = env.MAIL_FROM ?? env.SMTP_USER

	await transporte.sendMail({
		from: remetente,
		to: data.para,
		subject: 'Código de recuperação de senha',
		text: [
			`Olá, ${data.nome}.`,
			'',
			`Seu código de recuperação de senha é: ${data.codigo}`,
			'',
			'Ele expira em 10 minutos e só pode ser usado uma vez.',
			'Se você não solicitou a recuperação, ignore este e-mail.',
		].join('\n'),
		html: `
			<p>Olá, ${data.nome}.</p>
			<p>Seu código de recuperação de senha é:</p>
			<p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${data.codigo}</p>
			<p>Ele expira em <strong>10 minutos</strong> e só pode ser usado uma vez.</p>
			<p>Se você não solicitou a recuperação, ignore este e-mail.</p>
		`,
	})
}
