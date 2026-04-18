// Tipos de dominio de la calculadora SLM

export type TicketEnrollment = {
  trial:  { count: string; price: string }
  single: { count: string; pricePerSession: string; sessionsPerMonth: string }
  term:   { count: string; totalPrice: string; termWeeks: string } // semanas, no meses
}

export type Playgroup = {
  id: number
  name: string
  venue: string
  rent: string           // £/mes
  rentNote: string
  parking: string        // £/mes
  teacherCost: string    // £/mes
  costPerTrip: string    // £/desplazamiento (gasolina)
  sessionsPerMonth: string
  enrollment: TicketEnrollment
}

export type Club = {
  id: number
  name: string
  fixedRevenuePerSession: string  // ingreso fijo £/sesión
  sessionsPerMonth: string
  teacherCost: string
  parking: string
  parkingReimbursed: boolean
  costPerTrip: string
  enrollment: TicketEnrollment   // no se usa para revenue pero se mantiene para consistencia
}

export type Privada = {
  id: number
  familyName: string
  monthlyPayment: string    // lo que paga la familia a Sara
  teacherCost: string       // lo que cobra la profesora
  costPerTrip: string
  sessionsPerMonth: string
  parking: string
}

export type OverheadItem = {
  id: number
  name: string
  amount: string   // £/mes como string para el input controlado
}

export type CalculadoraConfig = {
  version: 1
  semanasPorTrimestre: number     // default 12
  overhead: { items: OverheadItem[] }
  playgroups: Playgroup[]
  clubs:      Club[]
  privadas:   Privada[]
}

// ─── Resultados de cálculo (read-only, derivados) ───────────────────────────

export type RevenueBreakdown = {
  trial:  number
  single: number
  term:   number
  total:  number
}

export type UnitResult = {
  id: number
  name: string
  type: 'playgroup' | 'club' | 'privada'
  ingresosMes:       number
  costesDirectos:    number
  gasolinaAsignada:  number
  overheadAsignado:  number
  totalCostes:       number
  beneficio:         number
  margen:            number | null
  breakEven:         number | null
  revBreakdown:      RevenueBreakdown
  children:          number
}

export type TotalesGlobales = {
  ingresosMes:    number
  costesTotales:  number
  beneficioNeto:  number
  totalNinos:     number
  margenGlobal:   number | null
  overheadTotal:  number
  overheadPorUnidad: number
  unidades: {
    playgroups: UnitResult[]
    clubs:      UnitResult[]
    privadas:   UnitResult[]
  }
}
