'use client'

import { useState } from 'react'
import { useCalc } from '@/lib/state/CalcContext'
import type { Servicio } from '@/lib/airtable/servicios'
import type { Profesora } from '@/lib/airtable/profesoras'
import type { GastoOperativo } from '@/lib/airtable/gastos'

type SyncData = {
  servicios:  Servicio[]
  profesoras: Profesora[]
  gastos:     GastoOperativo[]
}

export default function SyncPage() {
  const { config, dispatch } = useCalc()
  const [syncing,   setSyncing]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [syncData,  setSyncData]  = useState<SyncData | null>(null)
  const [syncError, setSyncError] = useState('')
  const [saveMsg,   setSaveMsg]   = useState('')
  const [saveName,  setSaveName]  = useState(`Config ${new Date().toLocaleDateString('es-GB')}`)

  async function handleSync() {
    setSyncing(true)
    setSyncError('')
    setSyncData(null)
    try {
      const res = await fetch('/api/sync')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: SyncData = await res.json()
      setSyncData(data)
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : 'Error de conexión')
    } finally {
      setSyncing(false)
    }
  }

  async function handleSave() {
    if (!saveName.trim()) return
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/config', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nombre: saveName, config }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? `HTTP ${res.status}`)
      }
      setSaveMsg('✅ Configuración guardada en Airtable')
    } catch (e) {
      setSaveMsg(`❌ ${e instanceof Error ? e.message : 'Error al guardar'}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleLoad() {
    setSyncing(true)
    setSyncError('')
    try {
      const res = await fetch('/api/config')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { active } = await res.json()
      if (active?.config) {
        dispatch({ type: 'SET_CONFIG', payload: active.config })
        setSaveMsg('✅ Configuración cargada desde Airtable')
      } else {
        setSyncError('No hay configuración activa guardada en Airtable')
      }
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : 'Error de conexión')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-4">

      {/* Guardar / Cargar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-base font-extrabold text-gray-900 mb-4">💾 Guardar / Cargar configuración</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={saveName}
            onChange={e => setSaveName(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
            placeholder="Nombre de la configuración"
          />
          <button
            onClick={handleSave}
            disabled={saving || !saveName.trim()}
            className="bg-[#00b4d8] text-white font-bold px-4 py-2 rounded-lg text-[13px] hover:bg-[#0096c7] transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>

        <button
          onClick={handleLoad}
          disabled={syncing}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-[13px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {syncing ? 'Cargando…' : '⬇️ Cargar configuración activa desde Airtable'}
        </button>

        {saveMsg && (
          <p className={`mt-3 text-[13px] ${saveMsg.startsWith('✅') ? 'text-green-700' : 'text-red-600'}`}>
            {saveMsg}
          </p>
        )}
      </div>

      {/* Sincronizar desde Airtable */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-base font-extrabold text-gray-900 mb-2">🔄 Sincronizar datos de Airtable</h2>
        <p className="text-[13px] text-gray-500 mb-4">
          Lee Servicios, Profesoras y Gastos Operativos para sugerir valores. Solo lectura — no modifica nada.
        </p>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-[#112954] text-white font-bold px-4 py-2 rounded-lg text-[13px] hover:bg-[#0d1f3c] transition-colors disabled:opacity-50"
        >
          {syncing ? 'Consultando Airtable…' : '🔄 Sincronizar con Airtable'}
        </button>

        {syncError && (
          <p className="mt-3 text-[13px] text-red-600">{syncError}</p>
        )}

        {syncData && (
          <div className="mt-4 space-y-4">
            <SyncSection title="Servicios" items={syncData.servicios.map(s => `${s.nombre} (${s.tipo}) — £${s.precio}`)} />
            <SyncSection title="Profesoras" items={syncData.profesoras.map(p => `${p.nombre} — £${p.tarifaBase}/mes`)} />
            <SyncSection title="Gastos Operativos" items={syncData.gastos.map(g => `${g.concepto} — £${g.importe} (${g.fecha})`)} />
          </div>
        )}
      </div>

    </div>
  )
}

function SyncSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return (
    <div>
      <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-[13px] text-gray-400">Sin registros</p>
    </div>
  )
  return (
    <div>
      <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-[13px] text-gray-700 bg-gray-50 rounded-lg px-3 py-1.5">{item}</li>
        ))}
      </ul>
    </div>
  )
}
