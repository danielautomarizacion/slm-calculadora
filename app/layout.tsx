import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { CalcProvider } from '@/lib/state/CalcContext'
import Nav from '@/components/Nav'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calculadora de Rentabilidad — SLM',
  description: 'Shaping Little Minds — herramienta interna de análisis de rentabilidad',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8fafc]">
        <CalcProvider>
          <Nav />
          <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
            {children}
          </main>
        </CalcProvider>
      </body>
    </html>
  )
}
