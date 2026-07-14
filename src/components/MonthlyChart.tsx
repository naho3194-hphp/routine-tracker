'use client'

import type { AppData } from '@/types'
import { ROUTINES } from '@/lib/constants'

interface Props {
  data: AppData
  year: number
  month: number
}

export default function MonthlyChart({ data, year, month }: Props) {
  const total = ROUTINES.length
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const bars = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const day = data[key] ?? {}
    const done = ROUTINES.filter((r) => day[r.id]?.done).length
    return { d, ratio: total === 0 ? 0 : done / total, done }
  })

  const isThisMonth =
    year === today.getFullYear() && month === today.getMonth()
  const todayD = today.getDate()

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="mb-3 text-[10px] uppercase tracking-widest text-gray-400">月間達成率</p>
      <div className="flex items-end gap-[2px] h-14">
        {bars.map(({ d, ratio, done }) => {
          const isFuture = isThisMonth && d > todayD
          const isToday = isThisMonth && d === todayD
          return (
            <div
              key={d}
              className="group relative flex flex-1 flex-col items-center justify-end"
              title={`${d}日: ${done}/${total}`}
            >
              <div
                className={`
                  w-full rounded-t-sm transition-all duration-300
                  ${isFuture
                    ? 'bg-gray-100'
                    : ratio === 1
                    ? 'bg-blue-600'
                    : ratio > 0
                    ? 'bg-blue-300'
                    : 'bg-gray-100'}
                  ${isToday ? 'ring-1 ring-blue-400' : ''}
                `}
                style={{ height: isFuture ? '4px' : `${Math.max(ratio * 100, ratio > 0 ? 20 : 4)}%` }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-1.5 flex justify-between">
        <span className="text-[9px] text-gray-300">1</span>
        <span className="text-[9px] text-gray-300">{Math.round(daysInMonth / 2)}</span>
        <span className="text-[9px] text-gray-300">{daysInMonth}</span>
      </div>
    </div>
  )
}
