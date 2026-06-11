'use client'

import { useMemo } from 'react'
import type { AppData } from '@/types'
import { ROUTINES } from '@/lib/constants'
import {
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  calcStreak,
} from '@/lib/dateUtils'

interface Props {
  data: AppData
  onSelectDate: (dateKey: string) => void
}

export default function CalendarView({ data, onSelectDate }: Props) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = formatDate(now)
  const routineIds = ROUTINES.map((r) => r.id)

  const streak = useMemo(() => calcStreak(data, routineIds), [data])
  const firstDay = getFirstDayOfMonth(year, month)
  const days = getDaysInMonth(year, month)

  const getDayStatus = (d: number): 'full' | 'partial' | 'none' => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const day = data[key] ?? {}
    const done = routineIds.filter((id) => day[id]?.done).length
    if (done === routineIds.length) return 'full'
    if (done > 0) return 'partial'
    return 'none'
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      {/* ヘッダー */}
      <div className="mb-3.5 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">
          {year}年{month + 1}月
        </p>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
          {streak > 0 ? `🔥 ${streak}日連続` : '記録をつけよう'}
        </span>
      </div>

      {/* 曜日ヘッダー */}
      <div className="mb-1 grid grid-cols-7">
        {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
          <div key={d} className="pb-1.5 text-center text-[10px] text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const status = getDayStatus(d)
          const isToday = key === today
          return (
            <button
              key={d}
              onClick={() => onSelectDate(key)}
              className={`
                relative flex aspect-square items-center justify-center rounded-md transition-colors
                hover:bg-blue-50
                ${isToday ? 'ring-1 ring-blue-400 ring-offset-1' : ''}
              `}
            >
              {status === 'none' ? (
                <span className="text-[11px] text-gray-400">{d}</span>
              ) : (
                <span
                  className={`
                    h-1.5 w-1.5 rounded-full
                    ${status === 'full' ? 'bg-blue-600' : 'border border-blue-400 bg-blue-100'}
                  `}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-3 flex gap-3.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <span className="text-[10px] text-gray-400">全完了</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-blue-400 bg-blue-100" />
          <span className="text-[10px] text-gray-400">一部完了</span>
        </div>
      </div>
    </div>
  )
}
