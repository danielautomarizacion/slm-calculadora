import type { UnitResult } from '@/lib/calc/types'
import StatBadge from './StatBadge'

const fmt       = (n: number) => `£${Math.abs(n).toFixed(0)}`
const fmtDec    = (n: number) => `£${Math.abs(n).toFixed(2)}`
const fmtSigned = (n: number) => (n >= 0 ? '+ ' : '− ') + `£${Math.abs(n).toFixed(0)}`
const pct       = (n: number) => `${n.toFixed(1)}%`

type CostRow = [string, number]

type Props = {
  result:       UnitResult
  costRows:     CostRow[]
  accentColor?: string
}

export default function ResultCard({ result, costRows, accentColor = '#00b4d8' }: Props) {
  const isProfit = result.beneficio >= 0
  const { revBreakdown: rev } = result

  return (
    <div
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="font-extrabold text-[15px] text-gray-900">{result.name}</span>
        <span
          className="font-extrabold text-base px-3.5 py-1 rounded-full"
          style={{
            background: isProfit ? '#DCFCE7' : '#FEE2E2',
            color:      isProfit ? '#15803d' : '#dc2626',
          }}
        >
          {fmtSigned(result.beneficio)}/mes
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <StatBadge label="Ingresos"   value={fmt(result.ingresosMes)}   bg="#f0fdf4" color="#15803d" />
        <StatBadge label="Costes"     value={fmt(result.totalCostes)}   bg="#fef2f2" color="#dc2626" />
        <StatBadge label="Break-even" value={result.breakEven != null ? `${result.breakEven} niños` : '—'} bg="#eff6ff" color="#1d4ed8" />
        <StatBadge label="Margen"     value={result.margen != null ? pct(result.margen) : '—'} bg="#fefce8" color="#854d0e" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-[13px]">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Costes directos</p>
          {costRows.map(([label, val]) => (
            <div key={label} className={`flex justify-between mb-1 ${val > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
              <span>{label}</span>
              <span className="font-semibold">{val > 0 ? fmt(val) : '—'}</span>
            </div>
          ))}
          {result.gasolinaAsignada > 0 && (
            <div className="flex justify-between mb-1 text-gray-700">
              <span>⛽ Gasolina</span>
              <span className="font-semibold">{fmt(result.gasolinaAsignada)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
            <span>Overhead asignado</span>
            <span className="text-gray-500">{fmtDec(result.overheadAsignado)}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Ingresos por ticket</p>
          {[
            ['🎯 Trial',   rev.trial ],
            ['🎫 Sueltas', rev.single],
            ['📦 Term',    rev.term  ],
          ].map(([label, val]) => (
            <div key={label as string} className={`flex justify-between mb-1 ${(val as number) > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
              <span>{label}</span>
              <span className="font-semibold">{(val as number) > 0 ? fmt(val as number) : '—'}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
            <span>Total niños</span>
            <span>{result.children}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
