'use client'

import { useCalc } from '@/lib/state/CalcContext'
import Field from '@/components/ui/Field'
import InfoBox from '@/components/ui/InfoBox'
import { makeClub } from '@/lib/state/defaults'

const fmtDec = (n: number) => `£${n.toFixed(2)}`
const fmt    = (n: number) => `£${n.toFixed(0)}`

export default function ClubsPage() {
  const { config, totales, dispatch } = useCalc()
  const { clubs } = config
  const { overheadTotal, overheadPorUnidad } = totales
  const totalUnidades =
    config.playgroups.length + config.clubs.length + config.privadas.length

  function addClub() {
    const nextId = Math.max(0, ...clubs.map(c => c.id)) + 1
    dispatch({ type: 'ADD_CLUB', payload: makeClub(nextId) })
  }

  function update(id: number, field: string, value: string | boolean) {
    dispatch({ type: 'UPDATE_CLUB', payload: { id, field: field as never, value } })
  }

  return (
    <div>
      <InfoBox>
        Clubs de ingreso fijo: el ingreso no depende del número de niños.
        Overhead {fmt(overheadTotal)}/mes ÷ {totalUnidades} unidades
        = <strong>{fmtDec(overheadPorUnidad)}</strong> asignado a cada uno.
      </InfoBox>

      {clubs.length === 0 && (
        <p className="text-center text-gray-400 text-[13px] py-8">
          Sin clubs configurados. Pulsa el botón para añadir uno.
        </p>
      )}

      {clubs.map(cl => (
        <div key={cl.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <input
              value={cl.name}
              onChange={e => update(cl.id, 'name', e.target.value)}
              className="text-[15px] font-extrabold border-none border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-[#00b4d8] py-1 flex-1 mr-4"
            />
            <button
              onClick={() => dispatch({ type: 'REMOVE_CLUB', payload: cl.id })}
              className="bg-red-50 text-red-600 font-bold text-[12px] px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
            >
              Eliminar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Ingreso fijo/sesión" emoji="💷"
              value={cl.fixedRevenuePerSession}
              onChange={v => update(cl.id, 'fixedRevenuePerSession', v)}
              hint="Lo que paga el local por cada sesión"
            />
            <Field
              label="Sesiones/mes" emoji="📅"
              value={cl.sessionsPerMonth}
              onChange={v => update(cl.id, 'sessionsPerMonth', v)}
              noSymbol
            />
            <Field
              label="Profesora(s)" emoji="👩‍🏫"
              value={cl.teacherCost}
              onChange={v => update(cl.id, 'teacherCost', v)}
            />
            <Field
              label="Coste/desplazamiento" emoji="⛽"
              value={cl.costPerTrip}
              onChange={v => update(cl.id, 'costPerTrip', v)}
              hint="£ por viaje ida-vuelta"
            />
            <div>
              <Field
                label="Parking" emoji="🚗"
                value={cl.parking}
                onChange={v => update(cl.id, 'parking', v)}
              />
              <label className="flex items-center gap-2 mt-1.5 text-[12px] text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cl.parkingReimbursed}
                  onChange={e => update(cl.id, 'parkingReimbursed', e.target.checked)}
                  className="rounded"
                />
                Parking reembolsado por el local
              </label>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addClub}
        className="w-full py-3.5 rounded-xl border-2 border-dashed border-[#00b4d8] bg-[#EBF7FD] text-[#00b4d8] font-bold text-[14px] hover:bg-blue-50 transition-colors"
      >
        + Añadir club
      </button>
    </div>
  )
}
