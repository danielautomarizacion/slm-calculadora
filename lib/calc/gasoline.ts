// Gasolina por venue: coste real por desplazamiento (ida + vuelta) × sesiones/mes.
// No se divide un pool fijo — cada venue paga su coste de transporte real.

export function gasolinaMes(
  costePorDesplazamiento: number,
  sesionesMes: number,
): number {
  return costePorDesplazamiento * sesionesMes
}
