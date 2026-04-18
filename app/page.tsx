'use client'

import { useCalc } from '@/lib/state/CalcContext'
import ResultCard from '@/components/ui/ResultCard'
import InfoBox from '@/components/ui/InfoBox'

const fmt       = (n: number) => `£${Math.abs(n).toFixed(0)}`
const fmtDec    = (n: number) => `£${Math.abs(n).toFixed(2)}`
const fmtSigned = (n: number) => (n >= 0 ? '+ ' : '− ') + `£${Math.abs(n).toFixed(0)}`
const pct       = (n: number) => `${n.toFixed(1)}%`

export default function DashboardPage() {
  const { config, totales } = useCalc()
  const { overheadTotal, overheadPorUnidad, unidades } = totales
  const totalUnidades =
    config.playgroups.length + config.clubs.length + config.privadas.length

  return (
    <div>
      <InfoBox>
        Overhead {fmt(overheadTotal)}/mes ÷ {totalUnidades} unidades
        = <strong>{fmtDec(overheadPorUnidad)}</strong> asignado a cada una.
      </InfoBox>

      {unidades.playgroups.map(r => {
        const pg = config.playgroups.find(p => p.id === r.id)!
        return (
          <ResultCard
            key={r.id}
            result={r}
            costRows={[
              ['🏠 Renta',         parseFloat(pg.rent)        || 0],
              ['🚗 Parking',       parseFloat(pg.parking)     || 0],
              ['👩‍🏫 Profesora(s)', parseFloat(pg.teacherCost) || 0],
            ]}
          />
        )
      })}

      {unidades.clubs.map(r => {
        const cl = config.clubs.find(c => c.id === r.id)!
        return (
          <ResultCard
            key={r.id}
            result={r}
            accentColor="#0891b2"
            costRows={[
              ['👩‍🏫 Profesora(s)', parseFloat(cl.teacherCost) || 0],
              ['🚗 Parking',       parseFloat(cl.parking)     || 0],
            ]}
          />
        )
      })}

      {unidades.privadas.map(r => {
        const pr = config.privadas.find(p => p.id === r.id)!
        return (
          <ResultCard
            key={r.id}
            result={r}
            accentColor="#4338ca"
            costRows={[
              ['👩‍🏫 Profesora(s)',     parseFloat(pr.teacherCost) || 0],
              ['🚗 Parking domicilios', parseFloat(pr.parking)     || 0],
            ]}
          />
        )
      })}

      {/* Resumen global */}
      <div className="bg-[#112954] text-white rounded-2xl p-5">
        <p className="font-extrabold text-[15px] mb-4">📊 Resumen global del negocio / mes</p>

        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: 'Ingresos',  value: fmt(totales.ingresosMes)         },
            { label: 'Costes',    value: fmt(totales.costesTotales)        },
            { label: 'Beneficio', value: fmtSigned(totales.beneficioNeto) },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
              <div className="text-[10px] opacity-70 mb-1">{s.label}</div>
              <div className="font-extrabold text-[18px]">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total niños',   value: totales.totalNinos },
            { label: 'Margen global', value: totales.margenGlobal != null ? pct(totales.margenGlobal) : '—' },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.08] rounded-xl p-2.5 text-center">
              <div className="text-[10px] opacity-70 mb-1">{s.label}</div>
              <div className="font-extrabold text-base">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
