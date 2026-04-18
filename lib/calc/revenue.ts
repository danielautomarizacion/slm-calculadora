import type { TicketEnrollment, RevenueBreakdown } from './types'
import { termToMonthly } from './terms'

export function calcRevenue(
  enrollment: TicketEnrollment,
  semanasPorTrimestre: number,
): RevenueBreakdown {
  const trCount = parseFloat(enrollment.trial.count)  || 0
  const trPrice = parseFloat(enrollment.trial.price)  || 0

  const siCount = parseFloat(enrollment.single.count)            || 0
  const siPPS   = parseFloat(enrollment.single.pricePerSession)  || 0
  const siSPM   = parseFloat(enrollment.single.sessionsPerMonth) || 0

  const teCount = parseFloat(enrollment.term.count)      || 0
  const tePrice = parseFloat(enrollment.term.totalPrice) || 0
  const teWeeks = parseFloat(enrollment.term.termWeeks)  || semanasPorTrimestre

  const trial  = trCount * trPrice
  const single = siCount * siPPS * siSPM
  const term   = termToMonthly(tePrice, teCount, teWeeks)

  return { trial, single, term, total: trial + single + term }
}

export function totalEnrolled(enrollment: TicketEnrollment): number {
  return (
    (parseFloat(enrollment.trial.count)  || 0) +
    (parseFloat(enrollment.single.count) || 0) +
    (parseFloat(enrollment.term.count)   || 0)
  )
}
