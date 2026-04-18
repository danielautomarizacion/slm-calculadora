import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getActiveConfig, getAllConfigs, saveConfig } from '@/lib/airtable/config'

export async function GET() {
  try {
    const [active, all] = await Promise.all([getActiveConfig(), getAllConfigs()])
    return Response.json({ active, all })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido'
    return Response.json({ error: msg }, { status: 500 })
  }
}

const saveSchema = z.object({
  nombre: z.string().min(1),
  config: z.unknown(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = saveSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.message }, { status: 400 })
  }

  try {
    const record = await saveConfig(
      parsed.data.nombre,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsed.data.config as any,
    )
    return Response.json({ record })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al guardar'
    return Response.json({ error: msg }, { status: 500 })
  }
}
