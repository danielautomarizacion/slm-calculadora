import type {
  CalculadoraConfig,
  OverheadItem,
  Playgroup,
  Club,
  Privada,
  TicketEnrollment,
} from '../calc/types'

export type Action =
  | { type: 'SET_CONFIG';             payload: CalculadoraConfig }
  | { type: 'SET_SEMANAS';            payload: number }
  // Overhead
  | { type: 'ADD_OVERHEAD';           payload: OverheadItem }
  | { type: 'UPDATE_OVERHEAD';        payload: { id: number; field: keyof OverheadItem; value: string } }
  | { type: 'REMOVE_OVERHEAD';        payload: number }
  // Playgroups
  | { type: 'ADD_PLAYGROUP';          payload: Playgroup }
  | { type: 'UPDATE_PLAYGROUP';       payload: { id: number; field: keyof Playgroup; value: string } }
  | { type: 'UPDATE_ENROLLMENT_PG';   payload: { id: number; enrollment: TicketEnrollment } }
  | { type: 'REMOVE_PLAYGROUP';       payload: number }
  // Clubs
  | { type: 'ADD_CLUB';               payload: Club }
  | { type: 'UPDATE_CLUB';            payload: { id: number; field: keyof Club; value: string | boolean } }
  | { type: 'REMOVE_CLUB';            payload: number }
  // Privadas
  | { type: 'ADD_PRIVADA';            payload: Privada }
  | { type: 'UPDATE_PRIVADA';         payload: { id: number; field: keyof Privada; value: string } }
  | { type: 'REMOVE_PRIVADA';         payload: number }
