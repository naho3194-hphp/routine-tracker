import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppData, RoutineId, RoutineRecord } from '@/types'
import { todayKey } from '@/lib/dateUtils'

interface RoutineStore {
  data: AppData
  _hydrated: boolean
  setRecord: (date: string, id: RoutineId, record: RoutineRecord) => void
  getRecord: (date: string, id: RoutineId) => RoutineRecord
  getTodayDoneCount: () => number
  getTodayTotalMins: () => number
}

const DEFAULT_RECORD: RoutineRecord = { done: false, mins: null }

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      data: {},
      _hydrated: false,

      setRecord: (date, id, record) =>
        set((state) => ({
          data: {
            ...state.data,
            [date]: {
              ...(state.data[date] ?? {}),
              [id]: record,
            },
          },
        })),

      getRecord: (date, id) => {
        const day = get().data[date]
        return day?.[id] ?? DEFAULT_RECORD
      },

      getTodayDoneCount: () => {
        const day = get().data[todayKey()] ?? {}
        return Object.values(day).filter((r) => r?.done).length
      },

      getTodayTotalMins: () => {
        const day = get().data[todayKey()] ?? {}
        return Object.values(day).reduce(
          (sum, r) => sum + (r?.done ? (r.mins ?? 15) : 0),
          0
        )
      },
    }),
    {
      name: 'routine-v1',
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true
      },
    }
  )
)
