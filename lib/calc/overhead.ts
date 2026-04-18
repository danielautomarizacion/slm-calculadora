import type { CalculadoraConfig } from './types'

export function calcOverhead(config: CalculadoraConfig): {
  totalMes: number
  totalUnidades: number
  porUnidad: number
} {
  const totalMes = config.overhead.items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0,
  )

  const totalUnidades =
    config.playgroups.length + config.clubs.length + config.privadas.length

  const porUnidad = totalUnidades > 0 ? totalMes / totalUnidades : 0

  return { totalMes, totalUnidades, porUnidad }
}
