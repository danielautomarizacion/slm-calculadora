import {
  readAirtableConfigs,
  createAirtableRecord,
  updateAirtableRecord,
  type AirtableRecord,
} from './client'
import { TABLES } from './constants'
import type { CalculadoraConfig } from '../calc/types'

type ConfigFields = {
  'Nombre configuración'?: string
  'Fecha guardado'?:       string
  'JSON config'?:          string
  Activa?:                 boolean
}

export type ConfigRecord = {
  id: string
  nombre: string
  fechaGuardado: string
  config: CalculadoraConfig
  activa: boolean
}

function mapConfig(rec: AirtableRecord<ConfigFields>): ConfigRecord | null {
  const raw = rec.fields['JSON config']
  if (!raw) return null
  try {
    return {
      id:            rec.id,
      nombre:        rec.fields['Nombre configuración'] ?? '',
      fechaGuardado: rec.fields['Fecha guardado']       ?? '',
      config:        JSON.parse(raw) as CalculadoraConfig,
      activa:        rec.fields.Activa ?? false,
    }
  } catch {
    return null
  }
}

export async function getActiveConfig(): Promise<ConfigRecord | null> {
  const tableId = TABLES.CALCULADORA_CONFIG
  if (!tableId) return null

  const records = await readAirtableConfigs<ConfigFields>(tableId, {
    filterByFormula: '{Activa}=TRUE()',
    maxRecords: '1',
  })

  if (records.length === 0) return null
  return mapConfig(records[0])
}

export async function getAllConfigs(): Promise<ConfigRecord[]> {
  const tableId = TABLES.CALCULADORA_CONFIG
  if (!tableId) return []

  const records = await readAirtableConfigs<ConfigFields>(tableId, {
    sort: '[{"field":"Fecha guardado","direction":"desc"}]',
  })

  return records.map(mapConfig).filter((c): c is ConfigRecord => c !== null)
}

export async function saveConfig(
  nombre: string,
  config: CalculadoraConfig,
): Promise<ConfigRecord> {
  const tableId = TABLES.CALCULADORA_CONFIG
  if (!tableId) throw new Error('CALCULADORA_CONFIG table ID no configurado en constants.ts')

  const activas = await readAirtableConfigs<ConfigFields>(tableId, {
    filterByFormula: '{Activa}=TRUE()',
  })
  for (const rec of activas) {
    await updateAirtableRecord(tableId, rec.id, { Activa: false })
  }

  const now = new Date().toISOString()
  const created = await createAirtableRecord<ConfigFields>(tableId, {
    'Nombre configuración': nombre,
    'Fecha guardado':       now,
    'JSON config':          JSON.stringify(config),
    Activa:                 true,
  })

  return {
    id:            created.id,
    nombre,
    fechaGuardado: now,
    config,
    activa:        true,
  }
}
