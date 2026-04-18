'use client'

import PoundInput from './PoundInput'

type Props = {
  label: string
  emoji?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  noSymbol?: boolean
}

export default function Field({ label, emoji, value, onChange, placeholder, hint, noSymbol }: Props) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
        {emoji ? `${emoji} ` : ''}{label}
      </label>
      {noSymbol ? (
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? '0'}
          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00b4d8] bg-white"
        />
      ) : (
        <PoundInput value={value} onChange={onChange} placeholder={placeholder} />
      )}
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}
