import type { CalculadoraConfig, OverheadItem, Playgroup, Club, Privada } from '../calc/types'

export function makeEnrollment() {
  return {
    trial:  { count: '', price: '15' },
    single: { count: '', pricePerSession: '12', sessionsPerMonth: '4' },
    term:   { count: '', totalPrice: '192', termWeeks: '12' },
  }
}

export function makePlaygroup(id: number, overrides: Partial<Playgroup> = {}): Playgroup {
  return {
    id,
    name:             `Playgroup ${id}`,
    venue:            '',
    rent:             '',
    rentNote:         '',
    parking:          '',
    teacherCost:      '',
    costPerTrip:      '10',
    sessionsPerMonth: '4',
    enrollment:       makeEnrollment(),
    ...overrides,
  }
}

export function makeClub(id: number): Club {
  return {
    id,
    name:                   `Club ${id}`,
    fixedRevenuePerSession: '',
    sessionsPerMonth:       '4',
    teacherCost:            '',
    parking:                '',
    parkingReimbursed:      false,
    costPerTrip:            '10',
    enrollment:             makeEnrollment(),
  }
}

export function makePrivada(id: number): Privada {
  return {
    id,
    familyName:       `Familia ${id}`,
    monthlyPayment:   '',
    teacherCost:      '',
    costPerTrip:      '10',
    sessionsPerMonth: '4',
    parking:          '',
  }
}

// Overhead real de SLM (valores corregidos por Sara, abril 2026)
const DEFAULT_OVERHEAD_ITEMS: OverheadItem[] = [
  { id: 1,  name: 'Teléfono (GiffGaff)',             amount: '10.00'  },
  { id: 2,  name: 'Web / Hosting',                   amount: '53.50'  },
  { id: 3,  name: 'OpenAI',                          amount: '17.93'  },
  { id: 4,  name: 'Canva',                           amount: '13.00'  },
  { id: 5,  name: 'Amazon Prime',                    amount: '8.99'   },
  { id: 6,  name: 'Spotify',                        amount: '12.99'  },
  { id: 7,  name: 'Gestor / Accountants',            amount: '150.00' },
  { id: 8,  name: 'Seguro negocio (Simply Business)', amount: '30.19' },
  { id: 9,  name: 'AA Membership',                   amount: '16.54'  },
  { id: 10, name: 'DVLA (coche)',                    amount: '29.31'  },
  { id: 11, name: 'Marketing (Happity)',              amount: '30.00'  },
  { id: 12, name: 'Parking casa (anual ÷ 12)',       amount: '29.75'  },
  { id: 13, name: 'Seguro del coche',                amount: '111.23' },
  { id: 14, name: 'Materiales (media ene–feb CSV)',  amount: '97.00'  },
]

export const DEFAULT_CONFIG: CalculadoraConfig = {
  version:             1,
  semanasPorTrimestre: 12,
  overhead: { items: DEFAULT_OVERHEAD_ITEMS },
  playgroups: [
    makePlaygroup(1, {
      name: 'Finchley Road (Sharesy)',
      rent: '194.40', rentNote: 'Mensual',
      teacherCost: '200', costPerTrip: '10', sessionsPerMonth: '4',
    }),
    makePlaygroup(2, {
      name: "Kensington (St. Mary's Abbots)",
      rent: '195.00', rentNote: '£292.50 medio trimestre ÷ 1.5 = £195/mes',
      teacherCost: '100', costPerTrip: '15', sessionsPerMonth: '4',
    }),
  ],
  clubs:    [],
  privadas: [],
}
