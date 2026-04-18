'use client'

import type { TicketEnrollment } from '@/lib/calc/types'
import PoundInput from './PoundInput'

const TICKET_TYPES = [
  { key: 'trial',  label: 'Trial',         emoji: '🎯', hint: 'Sesión de prueba (pago único)' },
  { key: 'single', label: 'Sesión suelta',  emoji: '🎫', hint: 'Por sesión, sin compromiso'    },
  { key: 'term',   label: 'Term Ticket',    emoji: '📦', hint: 'Paquete de trimestre'           },
] as const

type Props = {
  enrollment: TicketEnrollment
  onChange: (e: TicketEnrollment) => void
}

export default function EnrollmentEditor({ enrollment, onChange }: Props) {
  function upd<K extends keyof TicketEnrollment>(
    type: K,
    field: string,
    val: string,
  ) {
    onChange({
      ...enrollment,
      [type]: { ...enrollment[type], [field]: val },
    })
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Trial */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-[11px] font-bold text-gray-700 mb-2">
          🎯 Trial <span className="font-normal text-gray-400">— Sesión de prueba</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Nº niños</div>
            <input
              type="number"
              value={enrollment.trial.count}
              onChange={e => upd('trial', 'count', e.target.value)}
              placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
            />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Precio (£)</div>
            <PoundInput value={enrollment.trial.price} onChange={v => upd('trial', 'price', v)} />
          </div>
        </div>
      </div>

      {/* Sesión suelta */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-[11px] font-bold text-gray-700 mb-2">
          🎫 Sesión suelta <span className="font-normal text-gray-400">— Por sesión</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Nº niños</div>
            <input
              type="number"
              value={enrollment.single.count}
              onChange={e => upd('single', 'count', e.target.value)}
              placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
            />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">£/sesión</div>
            <PoundInput value={enrollment.single.pricePerSession} onChange={v => upd('single', 'pricePerSession', v)} />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Sesiones/mes</div>
            <input
              type="number"
              value={enrollment.single.sessionsPerMonth}
              onChange={e => upd('single', 'sessionsPerMonth', e.target.value)}
              placeholder="4"
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
            />
          </div>
        </div>
      </div>

      {/* Term Ticket */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-[11px] font-bold text-gray-700 mb-2">
          📦 Term Ticket <span className="font-normal text-gray-400">— Paquete trimestre</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Nº niños</div>
            <input
              type="number"
              value={enrollment.term.count}
              onChange={e => upd('term', 'count', e.target.value)}
              placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
            />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Precio term (£)</div>
            <PoundInput value={enrollment.term.totalPrice} onChange={v => upd('term', 'totalPrice', v)} />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Semanas lectivas</div>
            <input
              type="number"
              value={enrollment.term.termWeeks}
              onChange={e => upd('term', 'termWeeks', e.target.value)}
              placeholder="12"
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
