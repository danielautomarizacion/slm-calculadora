import { AIRTABLE_API, BASE_ID } from './constants'

export type AirtableRecord<T = Record<string, unknown>> = {
  id: string
  fields: T
  createdTime: string
}

type AirtableListResponse<T> = {
  records: AirtableRecord<T>[]
  offset?: string
}

async function fetchAll<T>(
  tableId: string,
  pat: string,
  params: Record<string, string> = {},
  fields: string[] = [],
): Promise<AirtableRecord<T>[]> {
  const records: AirtableRecord<T>[] = []
  let offset: string | undefined

  do {
    const url = new URL(`${AIRTABLE_API}/${BASE_ID}/${tableId}`)
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
    for (const f of fields) url.searchParams.append('fields[]', f)
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${pat}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Airtable ${res.status}: ${text}`)
    }

    const data: AirtableListResponse<T> = await res.json()
    records.push(...data.records)
    offset = data.offset
  } while (offset)

  return records
}

export function readAirtable<T>(
  tableId: string,
  params?: Record<string, string>,
  fields?: string[],
): Promise<AirtableRecord<T>[]> {
  const pat = process.env.AIRTABLE_PAT_READ
  if (!pat) throw new Error('AIRTABLE_PAT_READ no configurado')
  return fetchAll<T>(tableId, pat, params ?? {}, fields ?? [])
}

export async function createAirtableRecord<T>(
  tableId: string,
  fields: Record<string, unknown>,
): Promise<AirtableRecord<T>> {
  const pat = process.env.AIRTABLE_PAT_WRITE
  if (!pat) throw new Error('AIRTABLE_PAT_WRITE no configurado')

  const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/${tableId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Airtable ${res.status}: ${text}`)
  }

  return res.json()
}

export async function updateAirtableRecord<T>(
  tableId: string,
  recordId: string,
  fields: Record<string, unknown>,
): Promise<AirtableRecord<T>> {
  const pat = process.env.AIRTABLE_PAT_WRITE
  if (!pat) throw new Error('AIRTABLE_PAT_WRITE no configurado')

  const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/${tableId}/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Airtable ${res.status}: ${text}`)
  }

  return res.json()
}

export async function readAirtableConfigs<T>(
  tableId: string,
  params?: Record<string, string>,
  fields?: string[],
): Promise<AirtableRecord<T>[]> {
  const pat = process.env.AIRTABLE_PAT_WRITE
  if (!pat) throw new Error('AIRTABLE_PAT_WRITE no configurado')
  return fetchAll<T>(tableId, pat, params ?? {}, fields ?? [])
}
