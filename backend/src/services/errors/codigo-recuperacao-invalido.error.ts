export class CodigoRecuperacaoInvalidoError extends Error {
	constructor() {
		super('Código inválido ou expirado')
	}
}
