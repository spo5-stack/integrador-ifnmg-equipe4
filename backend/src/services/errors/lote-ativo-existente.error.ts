export class LoteAtivoExistenteError extends Error {
	constructor() {
		super('Já existe um lote ativo neste galpão')
	}
}
