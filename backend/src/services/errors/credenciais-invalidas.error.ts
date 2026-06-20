export class CredenciaisInvalidasError extends Error {
	constructor() {
		super('Email ou senha inválidos')
	}
}
