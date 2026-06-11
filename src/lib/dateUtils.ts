import type { AppData } from '@/types'

export function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey(): string {
  return formatDate(new Date())
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 5)  return '夜更かしですね'
  if (h < 12) return 'おはようございます'
  if (h < 18) return 'こんにちは'
  return 'お疲れ様です'
}

export function formatDateLabel(d = new Date()): string {
  const wd = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${wd}）`
}

export function calcStreak(data: AppData, routineIds: string[]): number {
  let streak = 0
  const d = new Date()
  while (true) {
    const key = formatDate(d)
    const day = data[key] ?? {}
    const allDone = routineIds.every(id => day[id as keyof typeof day]?.done)
    if (allDone) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}
