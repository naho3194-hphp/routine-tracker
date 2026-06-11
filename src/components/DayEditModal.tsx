'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconCheck, IconX, IconVolume, IconDeviceLaptop, IconRun, IconPencil } from '@tabler/icons-react'
import { ROUTINES } from '@/lib/constants'
import { useRoutineStore } from '@/store/routineStore'
import type { RoutineId } from '@/types'

const ICON_MAP: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  volume: IconVolume,
  'device-laptop': IconDeviceLaptop,
  run: IconRun,
  pencil: IconPencil,
}

interface Props {
  dateKey: string | null
  onClose: () => void
}

function formatDateLabel(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return `${m}月${d}日（${days[date.getDay()]}）`
}

export default function DayEditModal({ dateKey, onClose }: Props) {
  const { getRecord, setRecord } = useRoutineStore()
  const [minsInput, setMinsInput] = useState<Record<RoutineId, string>>({
    english: '', coursera: '', workout: '', drawing: '',
  })

  useEffect(() => {
    if (!dateKey) return
    const next: Record<RoutineId, string> = { english: '', coursera: '', workout: '', drawing: '' }
    for (const r of ROUTINES) {
      const rec = getRecord(dateKey, r.id)
      next[r.id] = rec.done && rec.mins != null ? String(rec.mins) : ''
    }
    setMinsInput(next)
  }, [dateKey])

  if (!dateKey) return null

  const handleToggle = (id: RoutineId) => {
    const rec = getRecord(dateKey, id)
    if (rec.done) {
      setRecord(dateKey, id, { done: false, mins: null })
      setMinsInput((prev) => ({ ...prev, [id]: '' }))
    } else {
      const mins = parseInt(minsInput[id]) || ROUTINES.find((r) => r.id === id)!.goalMins
      setRecord(dateKey, id, { done: true, mins })
    }
  }

  const handleMinsChange = (id: RoutineId, val: string) => {
    setMinsInput((prev) => ({ ...prev, [id]: val }))
    const rec = getRecord(dateKey, id)
    if (rec.done) {
      const mins = parseInt(val) || ROUTINES.find((r) => r.id === id)!.goalMins
      setRecord(dateKey, id, { done: true, mins })
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />
      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-3xl bg-white px-5 pb-10 pt-5 shadow-xl"
      >
        {/* ハンドル */}
        <div className="mb-5 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* ヘッダー */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-medium text-gray-900">{formatDateLabel(dateKey)}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* ルーティン一覧 */}
        <div className="flex flex-col gap-3">
          {ROUTINES.map((routine) => {
            const rec = getRecord(dateKey, routine.id)
            const Icon = ICON_MAP[routine.icon] ?? IconVolume
            return (
              <div
                key={routine.id}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                  rec.done ? 'border-blue-100 bg-white shadow-sm' : 'border-transparent bg-[#f0f4ff]'
                }`}
              >
                {/* アイコン */}
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${rec.done ? 'bg-blue-50' : 'bg-white'}`}>
                  <Icon size={18} className={rec.done ? 'text-blue-600' : 'text-blue-300'} />
                </div>

                {/* 名前 */}
                <span className="flex-1 text-sm font-medium text-gray-900">{routine.name}</span>

                {/* 分数入力 */}
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={minsInput[routine.id]}
                  onChange={(e) => handleMinsChange(routine.id, e.target.value)}
                  placeholder={`${routine.goalMins}分`}
                  className={`h-9 w-16 rounded-xl border text-center text-sm outline-none transition-colors ${
                    rec.done
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-500'
                  }`}
                />

                {/* チェックボタン */}
                <button
                  onClick={() => handleToggle(routine.id)}
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    rec.done
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 bg-white text-gray-300'
                  }`}
                >
                  <IconCheck size={16} />
                </button>
              </div>
            )
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
