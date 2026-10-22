import dayjs from "dayjs"

export function formatarData(valor: string): string {
  const data = dayjs(valor)
  return data.isValid() ? data.format("DD/MM/YYYY") : "—"
}

export function formatarDataHora(valor: string): string {
  const data = dayjs(valor)
  return data.isValid() ? data.format("DD/MM/YYYY HH:mm") : "—"
}

export function calcularDiasDesde(dataInicio: string): number {
  const inicio = dayjs(dataInicio)
  if (!inicio.isValid()) return 0

  return Math.max(1, Math.ceil(dayjs().diff(inicio, "hour") / 24))
}
