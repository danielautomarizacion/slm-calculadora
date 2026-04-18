import { readAirtable, type AirtableRecord } from './client'
import { TABLES } from './constants'

type ServicioFields = {
  Nombre?:                    string
  Tipo?:                      string
  'Location o venue'?:        string
  'Precio term ticket GBP'?:  number
  Estado?:                    string
}

export type Servicio = {
  id:     string
  nombre: string
  tipo:   string
  venue:  string
  precio: number
  estado: string
}

function mapServicio(rec: AirtableRecord<ServicioFields>): Servicio {
  return {
    id:     rec.id,
    nombre: rec.fields.Nombre                    ?? '',
    tipo:   rec.fields.Tipo                      ?? '',
    venue:  rec.fields['Location o venue']       ?? '',
    precio: rec.fields['Precio term ticket GBP'] ?? 0,
    estado: rec.fields.Estado                    ?? '',
  }
}

export async function getServicios(): Promise<Servicio[]> {
  const records = await readAirtable<ServicioFields>(
    TABLES.SERVICIOS,
    {},
    ['Nombre', 'Tipo', 'Location o venue', 'Precio term ticket GBP', 'Estado'],
  )
  return records.map(mapServicio)
}
