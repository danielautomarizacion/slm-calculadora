'use client'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export default function PoundInput({ value, onChange, placeholder = '0', className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[12px] pointer-events-none">
        £
      </span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg pl-6 pr-2 py-1.5 text-[13px] text-right focus:outline-none focus:ring-2 focus:ring-[#00b4d8] bg-white"
      />
    </div>
  )
}
