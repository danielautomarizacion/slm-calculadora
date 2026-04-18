import type { ReactNode } from 'react'

export default function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-4 text-[13px] text-blue-800 leading-relaxed">
      ℹ️ {children}
    </div>
  )
}
