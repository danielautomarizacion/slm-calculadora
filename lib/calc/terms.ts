// Convierte precio de term ticket a ingreso mensual usando semanas lectivas reales.
// Un trimestre escolar no son exactamente 3 meses (13 semanas de calendario);
// el número de semanas lectivas es configurable por Sara.
//
// Fórmula: ingreso_mes = precio_term * niños * (semanas_lectivas / semanas_trimestre) / 3
// Siendo semanas_trimestre = 13 (calendario) y semanas_lectivas la variable configurable.

const SEMANAS_TRIMESTRE_CALENDARIO = 13

export function termToMonthly(
  totalPriceGBP: number,
  count: number,
  semanasPorTrimestre: number,
): number {
  if (count <= 0 || totalPriceGBP <= 0) return 0
  const factor = semanasPorTrimestre / SEMANAS_TRIMESTRE_CALENDARIO
  return (totalPriceGBP * count * factor) / 3
}
