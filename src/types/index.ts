export type RoutineId = 'english' | 'coursera' | 'workout' | 'drawing'

export interface Routine {
  id: RoutineId
  name: string
  goalMins: number
  icon: string // Tabler icon name e.g. "volume"
}

export interface RoutineRecord {
  done: boolean
  mins: number | null
}

export type DayData = Partial<Record<RoutineId, RoutineRecord>>

export interface AppData {
  [dateKey: string]: DayData // e.g. "2026-06-10"
}
