import dayjs from 'dayjs'

export function calcularFase(dataInicio: Date): string {
	const dias = dayjs().diff(dataInicio, 'day') + 1

	if (dias <= 7) return 'INICIAL'
	if (dias <= 35) return 'CRESCIMENTO'
	return 'PRODUCAO'
}
