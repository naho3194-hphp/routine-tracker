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
import type { RoutineId } from '@/types'

export default function Home() {
  const { data, setRecord, getRecord } = useRoutineStore()
  const today = todayKey()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)

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

  // ⑦ 完了項目を下に
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
      {/* ① 紙吹雪 */}
      <Confetti trigger={allDone} />

      {/* ヘッダー */}
      <p className="mb-1.5 text-[11px] uppercase tracking-widest text-blue-400">
        {formatDateLabel()}
      </p>
      {quote && (
        <div className="mb-8">
          <p className="text-lg font-medium leading-snug text-gray-900">「{quote.text}」</p>
          <p className="mt-1.5 text-xs text-blue-400">― {quote.author}</p>
        </div>
      )}

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
      <CalendarView data={data} onSelectDate={setSelectedDate} />

      <DayEditModal dateKey={selectedDate} onClose={() => setSelectedDate(null)} />
    </main>
  )
}
