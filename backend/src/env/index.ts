import 'dotenv/config'

import z from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	API_URL: z.string().default('http://localhost:3333'),
	CORS_ORIGIN: z.string().default('http://localhost:5173'),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	SMTP_HOST: z.string().optional(),
	SMTP_PORT: z.coerce.number().int().positive().default(587),
	SMTP_SECURE: z
		.enum(['true', 'false'])
		.default('false')
		.transform((valor) => valor === 'true'),
	SMTP_USER: z.email('SMTP_USER inválido').optional(),
	SMTP_PASS: z.string().optional(),
	MAIL_FROM: z.string().optional(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
	console.error(
		'❌ Invalid environment variables',
		JSON.stringify(z.treeifyError(_env.error), null, 2),
	)
	throw new Error('Invalid environment variables.', _env.error)
}

export const env = _env.data
