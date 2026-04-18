import { readAirtable, type AirtableRecord } from './client'
import { TABLES } from './constants'

type ProfesoraFields = {
  Nombre?:                 string
  'Tarifa base GBP hora'?: number
  'Tipo de clase'?:        string[]
}

export type Profesora = {
  id:          string
  nombre:      string
  tarifaBase:  number
  tipoDeCiase: string
}

function mapProfesora(rec: AirtableRecord<ProfesoraFields>): Profesora {
  const tipos = rec.fields['Tipo de clase']
  return {
    id:          rec.id,
    nombre:      rec.fields.Nombre                  ?? '',
    tarifaBase:  rec.fields['Tarifa base GBP hora'] ?? 0,
    tipoDeCiase: Array.isArray(tipos) ? tipos.join(', ') : '',
  }
}

export async function getProfesoras(): Promise<Profesora[]> {
  const records = await readAirtable<ProfesoraFields>(
    TABLES.PROFESORAS,
    {},
    ['Nombre', 'Tarifa base GBP hora', 'Tipo de clase'],
  )
  return records.map(mapProfesora)
}
