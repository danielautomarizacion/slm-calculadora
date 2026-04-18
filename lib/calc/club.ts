import type { Club, UnitResult } from './types'
import { gasolinaMes } from './gasoline'

export function calcClub(
  club: Club,
  overheadPorUnidad: number,
): UnitResult {
  const fixedRevPerSession = parseFloat(club.fixedRevenuePerSession) || 0
  const sessions           = parseFloat(club.sessionsPerMonth)       || 0
  const teacherCost        = parseFloat(club.teacherCost)            || 0
  const parking            = club.parkingReimbursed ? 0 : (parseFloat(club.parking) || 0)
  const costPerTrip        = parseFloat(club.costPerTrip)            || 0

  const ingresosMes = fixedRevPerSession * sessions
  const gasolina    = gasolinaMes(costPerTrip, sessions)
  const directos    = teacherCost + parking + gasolina
  const totalCostes = directos + overheadPorUnidad
  const beneficio   = ingresosMes - totalCostes
  const margen      = ingresosMes > 0 ? (beneficio / ingresosMes) * 100 : null
  const breakEven   = null  // clubs: ingreso fijo, no hay "niños" para equilibrar

  return {
    id:   club.id,
    name: club.name,
    type: 'club',
    ingresosMes,
    costesDirectos:   directos,
    gasolinaAsignada: gasolina,
    overheadAsignado: overheadPorUnidad,
    totalCostes,
    beneficio,
    margen,
    breakEven,
    revBreakdown: { trial: 0, single: 0, term: 0, total: ingresosMes },
    children: 0,
  }
}
