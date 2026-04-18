'use client'

import { useCalc } from '@/lib/state/CalcContext'
import Field from '@/components/ui/Field'
import EnrollmentEditor from '@/components/ui/EnrollmentEditor'
import InfoBox from '@/components/ui/InfoBox'
import { makePlaygroup } from '@/lib/state/defaults'
import type { TicketEnrollment } from '@/lib/calc/types'

const fmtDec = (n: number) => `£${n.toFixed(2)}`
const fmt    = (n: number) => `£${n.toFixed(0)}`

export default function PlaygroupsPage() {
  const { config, totales, dispatch } = useCalc()
  const { playgroups } = config
  const { overheadTotal, overheadPorUnidad } = totales
  const totalUnidades =
    config.playgroups.length + config.clubs.length + config.privadas.length

  function addPlaygroup() {
    const nextId = Math.max(0, ...playgroups.map(p => p.id)) + 1
    dispatch({ type: 'ADD_PLAYGROUP', payload: makePlaygroup(nextId) })
  }

  function update(id: number, field: string, value: string) {
    dispatch({ type: 'UPDATE_PLAYGROUP', payload: { id, field: field as never, value } })
  }

  function updateEnrollment(id: number, enrollment: TicketEnrollment) {
    dispatch({ type: 'UPDATE_ENROLLMENT_PG', payload: { id, enrollment } })
  }

  return (
    <div>
      <InfoBox>
        Overhead {fmt(overheadTotal)}/mes ÷ {totalUnidades} unidades
        = <strong>{fmtDec(overheadPorUnidad)}</strong> asignado a cada una.
      </InfoBox>

      {playgroups.map(pg => (
        <div key={pg.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <input
              value={pg.name}
              onChange={e => update(pg.id, 'name', e.target.value)}
              className="text-[15px] font-extrabold border-none border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-[#00b4d8] py-1 flex-1 mr-4"
            />
            {playgroups.length > 1 && (
              <button
                onClick={() => dispatch({ type: 'REMOVE_PLAYGROUP', payload: pg.id })}
                className="bg-red-50 text-red-600 font-bold text-[12px] px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
              >
                Eliminar
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <Field
              label="Renta" emoji="🏠"
              value={pg.rent} onChange={v => update(pg.id, 'rent', v)}
              hint={pg.rentNote || undefined}
            />
            <Field
              label="Parking" emoji="🚗"
              value={pg.parking} onChange={v => update(pg.id, 'parking', v)}
            />
            <Field
              label="Profesora(s)" emoji="👩‍🏫"
              value={pg.teacherCost} onChange={v => update(pg.id, 'teacherCost', v)}
            />
            <Field
              label="Coste/desplazamiento (gasolina)" emoji="⛽"
              value={pg.costPerTrip} onChange={v => update(pg.id, 'costPerTrip', v)}
              hint="£ por viaje ida-vuelta a este venue"
            />
            <Field
              label="Sesiones/mes" emoji="📅"
              value={pg.sessionsPerMonth} onChange={v => update(pg.id, 'sessionsPerMonth', v)}
              noSymbol
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-3">Niños matriculados</p>
            <EnrollmentEditor
              enrollment={pg.enrollment}
              onChange={en => updateEnrollment(pg.id, en)}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addPlaygroup}
        className="w-full py-3.5 rounded-xl border-2 border-dashed border-[#00b4d8] bg-[#EBF7FD] text-[#00b4d8] font-bold text-[14px] hover:bg-blue-50 transition-colors"
      >
        + Añadir playgroup
      </button>
    </div>
  )
}
