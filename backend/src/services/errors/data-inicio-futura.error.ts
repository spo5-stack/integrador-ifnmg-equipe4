export class DataInicioFuturaError extends Error {
	constructor() {
		super('Data de início não pode ser futura')
	}
}
