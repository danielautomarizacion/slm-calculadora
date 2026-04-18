type Props = {
  label: string
  value: string | number
  color?: string
  bg?: string
}

export default function StatBadge({ label, value, color = '#374151', bg = '#f3f4f6' }: Props) {
  return (
    <div
      className="rounded-lg px-3 py-2 text-center"
      style={{ background: bg }}
    >
      <div className="text-[10px] text-gray-500 mb-0.5">{label}</div>
      <div className="font-extrabold text-[15px]" style={{ color }}>{value}</div>
    </div>
  )
}
