'use client'

import { useMemo, useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
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
  onMonthChange?: (year: number, month: number) => void
}

export default function CalendarView({ data, onSelectDate, onMonthChange }: Props) {
  const now = new Date()
  const today = formatDate(now)
  const routineIds = ROUTINES.map((r) => r.id)

  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()

  const goToPrev = () => {
    const newYear = viewMonth === 0 ? viewYear - 1 : viewYear
    const newMonth = viewMonth === 0 ? 11 : viewMonth - 1
    setViewYear(newYear); setViewMonth(newMonth)
    onMonthChange?.(newYear, newMonth)
  }

  const goToNext = () => {
    if (isCurrentMonth) return
    const newYear = viewMonth === 11 ? viewYear + 1 : viewYear
    const newMonth = viewMonth === 11 ? 0 : viewMonth + 1
    setViewYear(newYear); setViewMonth(newMonth)
    onMonthChange?.(newYear, newMonth)
  }

  const streak = useMemo(() => calcStreak(data, routineIds), [data])
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const days = getDaysInMonth(viewYear, viewMonth)

  const getDoneCount = (d: number): number => {
    const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const day = data[key] ?? {}
    return routineIds.filter((id) => day[id]?.done).length
  }

  const heatColor = (count: number) => {
    if (count === 0) return ''
    if (count === 1) return 'bg-blue-100'
    if (count === 2) return 'bg-blue-200'
    if (count === 3) return 'bg-blue-400 text-white'
    return 'bg-blue-600 text-white'
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      {/* ヘッダー */}
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goToPrev} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
            <IconChevronLeft size={16} />
          </button>
          <p className="text-sm font-medium text-gray-900 w-20 text-center">
            {viewYear}年{viewMonth + 1}月
          </p>
          <button onClick={goToNext} className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${isCurrentMonth ? 'text-gray-200 cursor-default' : 'hover:bg-blue-50 text-gray-400 hover:text-blue-600'}`}>
            <IconChevronRight size={16} />
          </button>
        </div>
        {streak > 0 ? (
          <span className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm">
            🔥 {streak}日連続
          </span>
        ) : (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-400">
            記録をつけよう
          </span>
        )}
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
          const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const count = getDoneCount(d)
          const isToday = key === today
          const heat = heatColor(count)
          return (
            <button
              key={d}
              onClick={() => onSelectDate(key)}
              className={`
                relative flex aspect-square items-center justify-center rounded-md text-[11px] transition-colors
                ${heat || 'text-gray-400 hover:bg-blue-50'}
                ${isToday ? 'ring-1 ring-blue-400 ring-offset-1' : ''}
              `}
            >
              {d}
            </button>
          )
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-3 flex gap-3 items-center">
        <span className="text-[10px] text-gray-400">達成度</span>
        {[['bg-blue-100','1'], ['bg-blue-200','2'], ['bg-blue-400','3'], ['bg-blue-600','4']].map(([cls, label]) => (
          <div key={label} className="flex items-center gap-1">
            <span className={`h-3 w-3 rounded-sm ${cls}`} />
            <span className="text-[10px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
