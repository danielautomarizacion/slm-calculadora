import { getServicios }        from '@/lib/airtable/servicios'
import { getProfesoras }       from '@/lib/airtable/profesoras'
import { getGastosOperativos } from '@/lib/airtable/gastos'

export async function GET() {
  try {
    const [servicios, profesoras, gastos] = await Promise.all([
      getServicios().catch(() => []),
      getProfesoras().catch(() => []),
      getGastosOperativos().catch(() => []),
    ])

    return Response.json({ servicios, profesoras, gastos })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido'
    return Response.json({ error: msg }, { status: 500 })
  }
}
