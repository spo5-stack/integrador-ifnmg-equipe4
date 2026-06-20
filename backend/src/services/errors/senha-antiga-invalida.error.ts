export class SenhaAntigaInvalidaError extends Error {
	constructor() {
		super('Senha antiga inválida')
	}
}
