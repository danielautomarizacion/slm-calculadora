import type { Playgroup, UnitResult } from './types'
import { calcRevenue, totalEnrolled } from './revenue'
import { gasolinaMes } from './gasoline'

export function calcPlaygroup(
  pg: Playgroup,
  overheadPorUnidad: number,
  semanasPorTrimestre: number,
): UnitResult {
  const rent        = parseFloat(pg.rent)          || 0
  const parking     = parseFloat(pg.parking)       || 0
  const teacherCost = parseFloat(pg.teacherCost)   || 0
  const costPerTrip = parseFloat(pg.costPerTrip)   || 0
  const sessions    = parseFloat(pg.sessionsPerMonth) || 0

  const gasolina    = gasolinaMes(costPerTrip, sessions)
  const directos    = rent + parking + teacherCost + gasolina
  const totalCostes = directos + overheadPorUnidad

  const rev      = calcRevenue(pg.enrollment, semanasPorTrimestre)
  const ingresosM = rev.total
  const beneficio = ingresosM - totalCostes
  const children  = totalEnrolled(pg.enrollment)

  const avgPerChild = children > 0 ? ingresosM / children : 0
  const breakEven   = avgPerChild > 0 ? Math.ceil(totalCostes / avgPerChild) : null
  const margen      = ingresosM > 0 ? (beneficio / ingresosM) * 100 : null

  return {
    id:   pg.id,
    name: pg.name,
    type: 'playgroup',
    ingresosMes:      ingresosM,
    costesDirectos:   directos,
    gasolinaAsignada: gasolina,
    overheadAsignado: overheadPorUnidad,
    totalCostes,
    beneficio,
    margen,
    breakEven,
    revBreakdown: rev,
    children,
  }
}
