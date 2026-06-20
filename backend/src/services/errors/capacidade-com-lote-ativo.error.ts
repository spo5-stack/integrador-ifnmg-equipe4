export class CapacidadeComLoteAtivoError extends Error {
	constructor() {
		super(
			'Não é possível alterar a capacidade enquanto houver um lote ativo no galpão',
		)
	}
}
