export class TokenRedefinicaoInvalidoError extends Error {
	constructor() {
		super('Token de redefinição inválido ou expirado')
	}
}
