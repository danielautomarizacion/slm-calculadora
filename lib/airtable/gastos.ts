import { readAirtable, type AirtableRecord } from './client'
import { TABLES } from './constants'

// Campos reales de la tabla Gastos Operativos (creada por scripts/modulo_financiero.js)
type GastoFields = {
  Concepto?:          string
  Categoria?:         string
  'Tipo de gasto'?:   string   // campo opcional; puede no existir en todas las instalaciones
  'Importe GBP'?:     number
  Fecha?:             string
}

export type GastoOperativo = {
  id:       string
  concepto: string
  categoria: string
  importe:  number
  fecha:    string
}

function mapGasto(rec: AirtableRecord<GastoFields>): GastoOperativo {
  return {
    id:        rec.id,
    concepto:  rec.fields.Concepto        ?? '',
    categoria: rec.fields.Categoria       ?? rec.fields['Tipo de gasto'] ?? '',
    importe:   rec.fields['Importe GBP']  ?? 0,
    fecha:     rec.fields.Fecha           ?? '',
  }
}

export async function getGastosOperativos(): Promise<GastoOperativo[]> {
  if (!TABLES.GASTOS_OPERATIVOS) return []

  const records = await readAirtable<GastoFields>(TABLES.GASTOS_OPERATIVOS)
  return records.map(mapGasto)
}
