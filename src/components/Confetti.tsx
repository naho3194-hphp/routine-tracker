'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface Props {
  trigger: boolean
}

export default function Confetti({ trigger }: Props) {
  const fired = useRef(false)

  useEffect(() => {
    if (!trigger) { fired.current = false; return }
    if (fired.current) return
    fired.current = true

    const colors = ['#2563EB', '#60a5fa', '#93c5fd', '#ffffff', '#1d4ed8']

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors })
    setTimeout(() => confetti({ particleCount: 50, spread: 80, origin: { y: 0.5 }, colors }), 200)
    setTimeout(() => confetti({ particleCount: 40, spread: 100, origin: { y: 0.4 }, colors }), 400)
  }, [trigger])

  return null
}
