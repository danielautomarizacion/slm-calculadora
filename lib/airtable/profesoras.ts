import { readAirtable, type AirtableRecord } from './client'
import { TABLES } from './constants'

type ProfesinaFields = {
  Nombre?: string
  'Tarifa base'?: number
  'Tipo de clase'?: string
}

export type Profesora = {
  id: string
  nombre: string
  tarifaBase: number
  tipoDeCiase: string
}

function mapProfesora(rec: AirtableRecord<ProfesinaFields>): Profesora {
  return {
    id:          rec.id,
    nombre:      rec.fields.Nombre         ?? '',
    tarifaBase:  rec.fields['Tarifa base'] ?? 0,
    tipoDeCiase: rec.fields['Tipo de clase'] ?? '',
  }
}

export async function getProfesoras(): Promise<Profesora[]> {
  const records = await readAirtable<ProfesinaFields>(TABLES.PROFESORAS, {
    'fields[]': 'Nombre,Tarifa base,Tipo de clase',
  })
  return records.map(mapProfesora)
}
