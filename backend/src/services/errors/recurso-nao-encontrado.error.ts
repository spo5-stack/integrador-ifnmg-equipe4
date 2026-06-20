export class RecursoNaoEncontradoError extends Error {
	constructor() {
		super('Recurso não encontrado')
	}
}
