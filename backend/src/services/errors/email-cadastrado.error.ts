export class EmailCadastradoError extends Error {
	constructor() {
		super('Email já cadastrado')
	}
}
