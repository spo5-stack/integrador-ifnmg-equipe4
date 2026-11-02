export class RateLimiter {
	private readonly registros = new Map<string, number[]>()

	constructor(
		private readonly janelaMs: number,
		private readonly limite: number,
	) {}

	permitir(chave: string, agora = Date.now()): boolean {
		const inicio = agora - this.janelaMs
		const registros = (this.registros.get(chave) ?? []).filter(
			(timestamp) => timestamp > inicio,
		)

		if (registros.length >= this.limite) {
			this.registros.set(chave, registros)
			return false
		}

		registros.push(agora)
		this.registros.set(chave, registros)
		this.limpar(agora)

		return true
	}

	private limpar(agora: number) {
		if (this.registros.size <= 5_000) return

		for (const [chave, registros] of this.registros) {
			if (registros.every((timestamp) => timestamp <= agora - this.janelaMs)) {
				this.registros.delete(chave)
			}
		}
	}
}
