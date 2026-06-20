export class DispositivoNaoEncontradoError extends Error {
	constructor() {
		super('Dispositivo não encontrado ou desativado')
	}
}
