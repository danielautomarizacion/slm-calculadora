'use client'

import { useCalc } from '@/lib/state/CalcContext'
import Field from '@/components/ui/Field'
import InfoBox from '@/components/ui/InfoBox'
import { makePrivada } from '@/lib/state/defaults'

const fmtDec = (n: number) => `£${n.toFixed(2)}`
const fmt    = (n: number) => `£${n.toFixed(0)}`

export default function PrivadasPage() {
  const { config, totales, dispatch } = useCalc()
  const { privadas } = config
  const { overheadTotal, overheadPorUnidad } = totales
  const totalUnidades =
    config.playgroups.length + config.clubs.length + config.privadas.length

  function addPrivada() {
    const nextId = Math.max(0, ...privadas.map(p => p.id)) + 1
    dispatch({ type: 'ADD_PRIVADA', payload: makePrivada(nextId) })
  }

  function update(id: number, field: string, value: string) {
    dispatch({ type: 'UPDATE_PRIVADA', payload: { id, field: field as never, value } })
  }

  return (
    <div>
      <InfoBox>
        Una fila por familia. Overhead {fmt(overheadTotal)}/mes ÷ {totalUnidades} unidades
        = <strong>{fmtDec(overheadPorUnidad)}</strong> asignado a cada una.
      </InfoBox>

      {privadas.length === 0 && (
        <p className="text-center text-gray-400 text-[13px] py-8">
          Sin familias configuradas. Pulsa el botón para añadir una.
        </p>
      )}

      {privadas.map(pr => (
        <div key={pr.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm border-l-4 border-[#4338ca]">
          <div className="flex justify-between items-center mb-4">
            <input
              value={pr.familyName}
              onChange={e => update(pr.id, 'familyName', e.target.value)}
              className="text-[15px] font-extrabold border-none border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-[#4338ca] py-1 flex-1 mr-4"
              placeholder="Nombre familia"
            />
            <button
              onClick={() => dispatch({ type: 'REMOVE_PRIVADA', payload: pr.id })}
              className="bg-red-50 text-red-600 font-bold text-[12px] px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
            >
              Eliminar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field
              label="Pago familia/mes" emoji="💷"
              value={pr.monthlyPayment}
              onChange={v => update(pr.id, 'monthlyPayment', v)}
              hint="Lo que paga la familia"
            />
            <Field
              label="Profesora/mes" emoji="👩‍🏫"
              value={pr.teacherCost}
              onChange={v => update(pr.id, 'teacherCost', v)}
            />
            <Field
              label="Coste/desplazamiento" emoji="⛽"
              value={pr.costPerTrip}
              onChange={v => update(pr.id, 'costPerTrip', v)}
            />
            <Field
              label="Sesiones/mes" emoji="📅"
              value={pr.sessionsPerMonth}
              onChange={v => update(pr.id, 'sessionsPerMonth', v)}
              noSymbol
            />
            <Field
              label="Parking domicilios" emoji="🚗"
              value={pr.parking}
              onChange={v => update(pr.id, 'parking', v)}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addPrivada}
        className="w-full py-3.5 rounded-xl border-2 border-dashed border-[#4338ca] bg-[#f5f3ff] text-[#4338ca] font-bold text-[14px] hover:bg-[#ede9fe] transition-colors"
      >
        + Añadir familia privada
      </button>
    </div>
  )
}
