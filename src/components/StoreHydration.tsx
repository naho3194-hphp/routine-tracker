'use client'

import { useEffect } from 'react'
import { useRoutineStore } from '@/store/routineStore'

export default function StoreHydration() {
  useEffect(() => {
    useRoutineStore.persist.rehydrate()
  }, [])
  return null
}
