// IDs de tablas Airtable — base appoMD81OdbKkPOhz
export const BASE_ID = process.env.AIRTABLE_BASE_ID ?? 'appoMD81OdbKkPOhz'

export const TABLES = {
  SERVICIOS:          'tblLqKqGKPOMmxQ0A',
  PROFESORAS:         'tblfw45X155Dx5GGx',
  GASTOS_OPERATIVOS:  'tblUvO0nAQuVWXsba',
  CALCULADORA_CONFIG: 'tblqZPtRtljmKXBar',
} as const

export const AIRTABLE_API = 'https://api.airtable.com/v0'
