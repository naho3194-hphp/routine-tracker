'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'

interface Props {
  doneCount: number
  totalMins: number
  totalRoutines: number
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)

  useEffect(() => {
    if (!ref.current) return
    const from = prev.current
    prev.current = value
    if (from === value) return
    const controls = animate(from, value, {
      duration: 0.4,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [value])

  return <span ref={ref}>{value}</span>
}

export default function StatsGrid({ doneCount, totalMins, totalRoutines }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="rounded-2xl bg-white px-3.5 py-4 shadow-sm">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-400">完了</p>
        <p className="text-3xl font-medium text-blue-600">
          <AnimatedNumber value={doneCount} />
          <span className="ml-1 text-sm font-normal text-gray-400">/ {totalRoutines}</span>
        </p>
      </div>
      <div className="rounded-2xl bg-white px-3.5 py-4 shadow-sm">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-400">合計時間</p>
        <p className="text-3xl font-medium text-blue-600">
          <AnimatedNumber value={totalMins} />
          <span className="ml-1 text-sm font-normal text-gray-400">分</span>
        </p>
      </div>
    </div>
  )
}
