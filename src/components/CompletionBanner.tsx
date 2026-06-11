'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  show: boolean
}

export default function CompletionBanner({ show }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!show) { setVisible(false); return }
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center gap-3 rounded-2xl bg-blue-600 px-5 py-4"
        >
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-medium text-white">今日のルーティン完了！</p>
            <p className="mt-0.5 text-xs text-blue-200">素晴らしい。この調子で続けましょう</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
