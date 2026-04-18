'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/',           label: 'Resultados'  },
  { href: '/overhead',   label: 'Overhead'    },
  { href: '/playgroups', label: 'Playgroups'  },
  { href: '/clubs',      label: 'Clubs'       },
  { href: '/privadas',   label: 'Privadas'    },
  { href: '/sync',       label: 'Sync'        },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header>
      <div className="bg-[#112954] px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-bold tracking-widest text-[#00b4d8] uppercase mb-0.5">
            Shaping Little Minds
          </p>
          <h1 className="text-xl font-black text-white m-0">Calculadora de Rentabilidad</h1>
        </div>
      </div>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto flex overflow-x-auto">
          {TABS.map(t => {
            const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href)
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`
                  px-5 py-3 text-[13px] whitespace-nowrap border-b-2 font-medium transition-colors
                  ${active
                    ? 'border-[#00b4d8] text-[#00b4d8] font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'}
                `}
              >
                {t.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
