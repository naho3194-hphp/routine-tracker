'use client'

import { useMemo, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRoutineStore } from '@/store/routineStore'
import { ROUTINES } from '@/lib/constants'
import { todayKey, formatDateLabel } from '@/lib/dateUtils'
import { getRandomQuote } from '@/lib/quotes'
import type { Quote } from '@/lib/quotes'
import RoutineCard from '@/components/RoutineCard'
import StatsGrid from '@/components/StatsGrid'
import CalendarView from '@/components/CalendarView'
import CompletionBanner from '@/components/CompletionBanner'
import DayEditModal from '@/components/DayEditModal'
import Confetti from '@/components/Confetti'
import ProgressRing from '@/components/ProgressRing'
import MonthlyChart from '@/components/MonthlyChart'
import type { RoutineId } from '@/types'

export default function Home() {
  const { data, setRecord, getRecord } = useRoutineStore()
  const today = todayKey()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)
  const now = new Date()
  const [chartYear, setChartYear] = useState(now.getFullYear())
  const [chartMonth, setChartMonth] = useState(now.getMonth())

  useEffect(() => {
    setQuote(getRandomQuote())
  }, [])

  const doneCount = useMemo(() => {
    const day = data[today] ?? {}
    return ROUTINES.filter((r) => day[r.id]?.done).length
  }, [data, today])

  const totalMins = useMemo(() => {
    const day = data[today] ?? {}
    return ROUTINES.reduce((sum, r) => sum + (day[r.id]?.done ? (day[r.id]?.mins ?? r.goalMins) : 0), 0)
  }, [data, today])

  const sortedRoutines = useMemo(() => {
    const day = data[today] ?? {}
    return [...ROUTINES].sort((a, b) => {
      const aDone = day[a.id]?.done ? 1 : 0
      const bDone = day[b.id]?.done ? 1 : 0
      return aDone - bDone
    })
  }, [data, today])

  const allDone = doneCount === ROUTINES.length

  const handleComplete = (id: RoutineId, mins: number) => {
    setRecord(today, id, { done: true, mins })
  }

  const handleUndo = (id: RoutineId) => {
    setRecord(today, id, { done: false, mins: null })
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#f0f4ff] px-4.5 pb-12 pt-8">
      <Confetti trigger={allDone} />

      {/* ヘッダー */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="mb-1.5 text-[11px] uppercase tracking-widest text-blue-400">
            {formatDateLabel()}
          </p>
          {quote && (
            <div>
              <p className="text-lg font-medium leading-snug text-gray-900">「{quote.text}」</p>
              <p className="mt-1.5 text-xs text-blue-400">― {quote.author}</p>
            </div>
          )}
        </div>
        {/* ⑤ 進捗リング */}
        <div className="ml-4 flex-shrink-0">
          <ProgressRing done={doneCount} total={ROUTINES.length} />
        </div>
      </div>

      {/* 全完了バナー */}
      <CompletionBanner show={allDone} />

      {/* ルーティン一覧 */}
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        <p className="text-[10px] uppercase tracking-widest text-gray-400">
          今日のルーティン
          {doneCount > 0 && (
            <span className="ml-2 text-blue-500">{doneCount}/{ROUTINES.length}</span>
          )}
        </p>
      </div>
      <div className="mb-8 flex flex-col gap-2.5">
        <AnimatePresence>
          {sortedRoutines.map((routine) => (
            <motion.div
              key={routine.id}
              layout
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <RoutineCard
                routine={routine}
                record={getRecord(today, routine.id)}
                onComplete={(mins) => handleComplete(routine.id, mins)}
                onUndo={() => handleUndo(routine.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 統計 */}
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        <p className="text-[10px] uppercase tracking-widest text-gray-400">サマリー</p>
      </div>
      <div className="mb-8">
        <StatsGrid
          doneCount={doneCount}
          totalMins={totalMins}
          totalRoutines={ROUTINES.length}
        />
      </div>

      {/* カレンダー */}
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        <p className="text-[10px] uppercase tracking-widest text-gray-400">今月の記録</p>
      </div>
      <div className="mb-4">
        <CalendarView
          data={data}
          onSelectDate={setSelectedDate}
          onMonthChange={(y, m) => { setChartYear(y); setChartMonth(m) }}
        />
      </div>

      {/* ③ 月間達成率グラフ */}
      <MonthlyChart data={data} year={chartYear} month={chartMonth} />

      <DayEditModal dateKey={selectedDate} onClose={() => setSelectedDate(null)} />
    </main>
  )
}
