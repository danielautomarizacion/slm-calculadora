import type { CalculadoraConfig, TotalesGlobales } from './types'
import { calcOverhead } from './overhead'
import { calcPlaygroup } from './playgroup'
import { calcClub }      from './club'
import { calcPrivada }   from './privada'

export function calcularTotales(config: CalculadoraConfig): TotalesGlobales {
  const { totalMes, totalUnidades, porUnidad } = calcOverhead(config)

  const playgroups = config.playgroups.map(pg =>
    calcPlaygroup(pg, porUnidad, config.semanasPorTrimestre),
  )
  const clubs = config.clubs.map(cl => calcClub(cl, porUnidad))
  const privadas = config.privadas.map(pr => calcPrivada(pr, porUnidad))

  const todas = [...playgroups, ...clubs, ...privadas]

  const ingresosMes   = todas.reduce((s, u) => s + u.ingresosMes,  0)
  const costesTotales = todas.reduce((s, u) => s + u.totalCostes,  0)
  const beneficioNeto = ingresosMes - costesTotales
  const totalNinos    = todas.reduce((s, u) => s + u.children,     0)
  const margenGlobal  = ingresosMes > 0 ? (beneficioNeto / ingresosMes) * 100 : null

  return {
    ingresosMes,
    costesTotales,
    beneficioNeto,
    totalNinos,
    margenGlobal,
    overheadTotal:    totalMes,
    overheadPorUnidad: porUnidad,
    unidades: { playgroups, clubs, privadas },
  }
}

export type { CalculadoraConfig, TotalesGlobales }
export * from './types'
