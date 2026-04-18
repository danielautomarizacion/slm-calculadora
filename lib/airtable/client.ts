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
      throw new Error(`Airtable ${res.status}: ${t
