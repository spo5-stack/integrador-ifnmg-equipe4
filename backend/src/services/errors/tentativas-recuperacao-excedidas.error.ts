export class TentativasRecuperacaoExcedidasError extends Error {
	constructor() {
		super('Muitas tentativas. Solicite um novo código.')
	}
}
