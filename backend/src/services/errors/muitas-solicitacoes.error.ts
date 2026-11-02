export class MuitasSolicitacoesError extends Error {
	constructor() {
		super('Muitas tentativas. Tente novamente mais tarde.')
	}
}
