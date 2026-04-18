'use client'

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from 'react'
import type { CalculadoraConfig } from '../calc/types'
import type { TotalesGlobales } from '../calc/types'
import { calcularTotales } from '../calc/index'
import { DEFAULT_CONFIG } from './defaults'
import type { Action } from './actions'

function reducer(state: CalculadoraConfig, action: Action): CalculadoraConfig {
  switch (action.type) {
    case 'SET_CONFIG':   return action.payload
    case 'SET_SEMANAS':  return { ...state, semanasPorTrimestre: action.payload }

    case 'ADD_OVERHEAD':
      return { ...state, overhead: { items: [...state.overhead.items, action.payload] } }
    case 'UPDATE_OVERHEAD':
      return {
        ...state,
        overhead: {
          items: state.overhead.items.map(i =>
            i.id === action.payload.id
              ? { ...i, [action.payload.field]: action.payload.value }
              : i,
          ),
        },
      }
    case 'REMOVE_OVERHEAD':
      return { ...state, overhead: { items: state.overhead.items.filter(i => i.id !== action.payload) } }

    case 'ADD_PLAYGROUP':
      return { ...state, playgroups: [...state.playgroups, action.payload] }
    case 'UPDATE_PLAYGROUP':
      return {
        ...state,
        playgroups: state.playgroups.map(pg =>
          pg.id === action.payload.id
            ? { ...pg, [action.payload.field]: action.payload.value }
            : pg,
        ),
      }
    case 'UPDATE_ENROLLMENT_PG':
      return {
        ...state,
        playgroups: state.playgroups.map(pg =>
          pg.id === action.payload.id ? { ...pg, enrollment: action.payload.enrollment } : pg,
        ),
      }
    case 'REMOVE_PLAYGROUP':
      return { ...state, playgroups: state.playgroups.filter(pg => pg.id !== action.payload) }

    case 'ADD_CLUB':
      return { ...state, clubs: [...state.clubs, action.payload] }
    case 'UPDATE_CLUB':
      return {
        ...state,
        clubs: state.clubs.map(cl =>
          cl.id === action.payload.id
            ? { ...cl, [action.payload.field]: action.payload.value }
            : cl,
        ),
      }
    case 'REMOVE_CLUB':
      return { ...state, clubs: state.clubs.filter(cl => cl.id !== action.payload) }

    case 'ADD_PRIVADA':
      return { ...state, privadas: [...state.privadas, action.payload] }
    case 'UPDATE_PRIVADA':
      return {
        ...state,
        privadas: state.privadas.map(pr =>
          pr.id === action.payload.id
            ? { ...pr, [action.payload.field]: action.payload.value }
            : pr,
        ),
      }
    case 'REMOVE_PRIVADA':
      return { ...state, privadas: state.privadas.filter(pr => pr.id !== action.payload) }

    default:
      return state
  }
}

type CalcContextValue = {
  config:   CalculadoraConfig
  totales:  TotalesGlobales
  dispatch: React.Dispatch<Action>
}

const CalcContext = createContext<CalcContextValue | null>(null)

export function CalcProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(reducer, DEFAULT_CONFIG)
  const totales = useMemo(() => calcularTotales(config), [config])

  return (
    <CalcContext.Provider value={{ config, totales, dispatch }}>
      {children}
    </CalcContext.Provider>
  )
}

export function useCalc(): CalcContextValue {
  const ctx = useContext(CalcContext)
  if (!ctx) throw new Error('useCalc debe usarse dentro de CalcProvider')
  return ctx
}
