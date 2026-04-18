import type { Privada, UnitResult } from './types'
import { gasolinaMes } from './gasoline'

export function calcPrivada(
  pr: Privada,
  overheadPorUnidad: number,
): UnitResult {
  const ingresosMes = parseFloat(pr.monthlyPayment) || 0
  const teacherCost = parseFloat(pr.teacherCost)    || 0
  const parking     = parseFloat(pr.parking)        || 0
  const costPerTrip = parseFloat(pr.costPerTrip)    || 0
  const sessions    = parseFloat(pr.sessionsPerMonth) || 0

  const gasolina    = gasolinaMes(costPerTrip, sessions)
  const directos    = teacherCost + parking + gasolina
  const totalCostes = directos + overheadPorUnidad
  const beneficio   = ingresosMes - totalCostes
  const margen      = ingresosMes > 0 ? (beneficio / ingresosMes) * 100 : null

  return {
    id:   pr.id,
    name: pr.familyName,
    type: 'privada',
    ingresosMes,
    costesDirectos:   directos,
    gasolinaAsignada: gasolina,
    overheadAsignado: overheadPorUnidad,
    totalCostes,
    beneficio,
    margen,
    breakEven:  null,
    revBreakdown: { trial: 0, single: 0, term: 0, total: ingresosMes },
    children: 1,
  }
}
