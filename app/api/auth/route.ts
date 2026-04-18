import { NextRequest } from 'next/server'
import { z } from 'zod'
import { signSession, cookieOptions } from '@/lib/auth'

const schema = z.object({ pin: z.string().min(4).max(8) })

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'PIN requerido' }, { status: 400 })
  }

  const expectedPin = process.env.APP_PIN
  if (!expectedPin) {
    return Response.json({ error: 'APP_PIN no configurado en el servidor' }, { status: 500 })
  }

  if (parsed.data.pin !== expectedPin) {
    return Response.json({ error: 'PIN incorrecto' }, { status: 401 })
  }

  const token = await signSession()
  const opts   = cookieOptions()

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${opts.name}=${token}; Path=${opts.path}; HttpOnly; SameSite=Lax; Max-Age=${opts.maxAge}${opts.secure ? '; Secure' : ''}`,
    },
  })
}
