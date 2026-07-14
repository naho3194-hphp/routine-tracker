'use client'

import { motion } from 'framer-motion'

interface Props {
  done: number
  total: number
}

export default function ProgressRing({ done, total }: Props) {
  const r = 28
  const circumference = 2 * Math.PI * r
  const progress = total === 0 ? 0 : done / total
  const offset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg width="64" height="64" className="-rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#e0e7ff" strokeWidth="5" />
          <motion.circle
            cx="32" cy="32" r={r}
            fill="none"
            stroke="#2563EB"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-sm font-medium text-gray-900">{done}/{total}</span>
        </div>
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-widest text-gray-400">今日</span>
    </div>
  )
}
