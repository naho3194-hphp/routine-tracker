'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconVolume,
  IconDeviceLaptop,
  IconRun,
  IconPencil,
  IconCheck,
} from '@tabler/icons-react'
import type { Routine, RoutineRecord } from '@/types'

const ICON_MAP: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  volume: IconVolume,
  'device-laptop': IconDeviceLaptop,
  run: IconRun,
  pencil: IconPencil,
}

interface Props {
  routine: Routine
  record: RoutineRecord
  onComplete: (mins: number) => void
  onUndo: () => void
}

export default function RoutineCard({ routine, record, onComplete, onUndo }: Props) {
  const [inputMode, setInputMode] = useState(false)
  const [minsValue, setMinsValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const Icon = ICON_MAP[routine.icon] ?? IconVolume

  const handleQuickComplete = () => {
    onComplete(routine.goalMins)
  }

  const handleRecordSubmit = () => {
    const v = parseInt(minsValue)
    const mins = v > 0 ? v : routine.goalMins
    onComplete(mins)
    setInputMode(false)
    setMinsValue('')
  }

  const handleInputMode = () => {
    setInputMode(true)
    setTimeout(() => inputRef.current?.focus(), 10)
  }

  return (
    <motion.div
      layout
      className={`
        flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition-colors duration-200
        shadow-sm
        ${record.done
          ? 'border-blue-100 bg-white shadow-blue-100'
          : 'border-transparent bg-white'
        }
      `}
    >
      {/* アイコン */}
      <div
        className={`
          flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-200
          ${record.done ? 'bg-blue-50' : 'bg-[#f0f4ff]'}
        `}
      >
        <Icon
          size={20}
          className={record.done ? 'text-blue-600' : 'text-blue-300'}
        />
      </div>

      {/* テキスト */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{routine.name}</p>
        <p className={`mt-0.5 text-xs ${record.done ? 'text-blue-500' : 'text-gray-400'}`}>
          {record.done
            ? `${record.mins ?? routine.goalMins}分 完了`
            : `目標 ${routine.goalMins}分`}
        </p>
      </div>

      {/* アクション */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <AnimatePresence mode="wait">
          {record.done ? (
            <motion.button
              key="undo"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 0.9, 1.1, 1] }}
              transition={{ duration: 0.4, times: [0, 0.3, 0.6, 0.8, 1] }}
              exit={{ scale: 0.8 }}
              onClick={onUndo}
              aria-label="取り消し"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white"
            >
              <IconCheck size={18} />
            </motion.button>
          ) : inputMode ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="number"
                min={1}
                max={999}
                value={minsValue}
                onChange={(e) => setMinsValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRecordSubmit()}
                placeholder="分"
                className="h-11 w-14 rounded-full border-2 border-blue-600 bg-white text-center text-sm text-gray-900 outline-none"
              />
              <button
                onClick={handleRecordSubmit}
                aria-label="完了"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white"
              >
                <IconCheck size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={handleInputMode}
                className="flex h-11 items-center rounded-full border border-gray-200 bg-white px-3 text-xs text-gray-500 transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                時間を記録
              </button>
              <button
                onClick={handleQuickComplete}
                aria-label={`${routine.goalMins}分で完了`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                <IconCheck size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
