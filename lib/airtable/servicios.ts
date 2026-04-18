import { readAirtable, type AirtableRecord } from './client'
import { TABLES } from './constants'

// Nombres de campos tal como están en Airtable (español)
type ServicioFields = {
  Nombre?: string
  Tipo?: string          // Playgroup | Privada Messy Play | Privada Regular
  Venue?: string
  Profesora?: string[]   // linked record
  Precio?: number
  Estado?: string
}

export type Servicio = {
  id: string
  nombre: string
  tipo: string
  venue: string
  precio: number
  estado: string
}

function mapServicio(rec: AirtableRecord<ServicioFields>): Servicio {
  return {
    id:     rec.id,
    nombre: rec.fields.Nombre  ?? '',
    tipo:   rec.fields.Tipo    ?? '',
    venue:  rec.fields.Venue   ?? '',
    precio: rec.fields.Precio  ?? 0,
    estado: rec.fields.Estado  ?? '',
  }
}

export async function getServicios(): Promise<Servicio[]> {
  const records = await readAirtable<ServicioFields>(TABLES.SERVICIOS, {
    'fields[]': 'Nombre,Tipo,Venue,Precio,Estado',
  })
  return records.map(mapServicio)
}
