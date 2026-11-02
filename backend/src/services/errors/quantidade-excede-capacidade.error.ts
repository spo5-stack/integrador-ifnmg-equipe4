export class QuantidadeExcedeCapacidadeError extends Error {
	constructor(capacidade: number) {
		super(
			`A quantidade não pode exceder a capacidade do galpão (${capacidade} aves)`,
		)
	}
}
