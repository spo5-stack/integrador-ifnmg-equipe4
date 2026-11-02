import '@fastify/jwt'

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: { sub: string; ver?: number }
		user: {
			sub: string
			ver?: number
			iat: number
			exp: number
		}
	}
}
