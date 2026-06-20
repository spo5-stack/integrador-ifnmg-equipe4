import 'dotenv/config'

import z from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	API_URL: z.string().default('http://localhost:3333'),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
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
