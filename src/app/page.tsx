'use client'

import { useMemo, useState } from 'react'
import { useRoutineStore } from '@/store/routineStore'
import { ROUTINES } from '@/lib/constants'
import { todayKey, getGreeting, formatDateLabel } from '@/lib/dateUtils'
import RoutineCard from '@/components/RoutineCard'
import StatsGrid from '@/components/StatsGrid'
import CalendarView from '@/components/CalendarView'
import CompletionBanner from '@/components/CompletionBanner'
import DayEditModal from '@/components/DayEditModal'
import type { RoutineId } from '@/types'

export default function Home() {
  const { data, setRecord, getRecord } = useRoutineStore()
  const today = todayKey()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const doneCount = useMemo(() => {
    const day = data[today] ?? {}
    return ROUTINES.filter((r) => day[r.id]?.done).length
  }, [data, today])

  const totalMins = useMemo(() => {
    const day = data[today] ?? {}
    return ROUTINES.reduce((sum, r) => sum + (day[r.id]?.done ? (day[r.id]?.mins ?? r.goalMins) : 0), 0)
  }, [data, today])

  const handleComplete = (id: RoutineId, mins: number) => {
    setRecord(today, id, { done: true, mins })
  }

  const handleUndo = (id: RoutineId) => {
    setRecord(today, id, { done: false, mins: null })
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#f0f4ff] px-4.5 pb-12 pt-8">
      {/* ヘッダー */}
      <p className="mb-1.5 text-[11px] uppercase tracking-widest text-blue-400">
        {formatDateLabel()}
      </p>
      <h1 className="mb-8 text-2xl font-medium text-gray-900">{getGreeting()}</h1>

      {/* 全完了バナー */}
      <CompletionBanner show={doneCount === ROUTINES.length} />

      {/* ルーティン一覧 */}
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        <p className="text-[10px] uppercase tracking-widest text-gray-400">今日のルーティン</p>
      </div>
      <div className="mb-8 flex flex-col gap-2.5">
        {ROUTINES.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            record={getRecord(today, routine.id)}
            onComplete={(mins) => handleComplete(routine.id, mins)}
            onUndo={() => handleUndo(routine.id)}
          />
        ))}
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
