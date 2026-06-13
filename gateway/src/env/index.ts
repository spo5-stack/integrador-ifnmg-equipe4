import 'dotenv/config'

import z from 'zod'

const envSchema = z.object({
	PORTA_SERIAL: z.string().default('/dev/ttyACM0'),
	VELOCIDADE_SERIAL: z.coerce.number().default(9600),
	URL_BACKEND: z
		.string()
		.default('http://localhost:3333/api/leituras-sensores'),
	DISPOSITIVOS_ID: z.uuid().min(1, 'DISPOSITIVOS_ID é obrigatório'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
	console.error(
		'❌ Variáveis de ambiente inválidas:',
		JSON.stringify(z.treeifyError(_env.error), null, 2),
	)
	throw new Error('Variáveis de ambiente inválidas.', { cause: _env.error })
}
export const env = _env.data
