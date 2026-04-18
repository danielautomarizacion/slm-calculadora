'use client'

import { useState } from 'react'
import { useCalc } from '@/lib/state/CalcContext'
import PoundInput from '@/components/ui/PoundInput'

const fmtDec = (n: number) => `£${Math.abs(n).toFixed(2)}`
const fmt    = (n: number) => `£${Math.abs(n).toFixed(0)}`

export default function OverheadPage() {
  const { config, totales, dispatch } = useCalc()
  const [newName,   setNewName]   = useState('')
  const [newAmount, setNewAmount] = useState('')
  const { overhead } = config

  function updateItem(id: number, field: 'name' | 'amount', value: string) {
    dispatch({ type: 'UPDATE_OVERHEAD', payload: { id, field, value } })
  }

  function removeItem(id: number) {
    dispatch({ type: 'REMOVE_OVERHEAD', payload: id })
  }

  function addItem() {
    if (!newName.trim() || !newAmount) return
    dispatch({
      type: 'ADD_OVERHEAD',
      payload: { id: Date.now(), name: newName.trim(), amount: newAmount },
    })
    setNewName('')
    setNewAmount('')
  }

  const { overheadTotal, overheadPorUnidad } = totales
  const totalUnidades =
    config.playgroups.length + config.clubs.length + config.privadas.length

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-extrabold text-gray-900 mb-1">Gastos Generales (Overhead)</h2>
      <p className="text-[13px] text-gray-500 mb-5">
        Se reparten entre {totalUnidades} unidad{totalUnidades !== 1 ? 'es' : ''} (
        {config.playgroups.length} playgroup{config.playgroups.length !== 1 ? 's' : ''},
        {' '}{config.clubs.length} club{config.clubs.length !== 1 ? 's' : ''},
        {' '}{config.privadas.length} privada{config.privadas.length !== 1 ? 's' : ''}).
        {' '}Asignado a cada una: <strong>{fmtDec(overheadPorUnidad)}/mes</strong>
      </p>

      <div className="mb-6">
        <div className="grid grid-cols-[1fr_130px_40px] gap-2 mb-2 px-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Concepto</span>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide text-right">Importe/mes</span>
          <span />
        </div>

        {overhead.items.map(item => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_130px_40px] gap-2 items-center border-b border-gray-100 py-1.5"
          >
            <input
              value={item.name}
              onChange={e => updateItem(item.id, 'name', e.target.value)}
              className="text-[13px] border-none bg-transparent focus:outline-none px-2 py-1 hover:bg-gray-50 rounded"
            />
            <PoundInput value={item.amount} onChange={v => updateItem(item.id, 'amount', v)} />
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-300 hover:text-red-400 text-lg font-light leading-none px-2 py-1 rounded transition-colors"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="bg-[#EBF7FD] rounded-b-xl px-3 py-2.5 flex justify-between items-center font-extrabold mt-1">
          <span className="text-[13px] text-gray-700">TOTAL OVERHEAD</span>
          <span className="text-[16px] text-[#00b4d8]">{fmt(overheadTotal)}/mes</span>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nuevo concepto"
          onKeyDown={e => e.key === 'Enter' && addItem()}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
        />
        <PoundInput value={newAmount} onChange={setNewAmount} className="w-32" />
        <button
          onClick={addItem}
          className="bg-[#00b4d8] text-white font-bold px-4 py-2 rounded-lg text-[13px] hover:bg-[#0096c7] transition-colors"
        >
          + Añadir
        </button>
      </div>
    </div>
  )
}
