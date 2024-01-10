import { useState, type RefObject, useEffect } from 'react'

export const useHasOverflow = (ref: RefObject<HTMLDivElement | null>) => {
  const [isOverflow, setIsOverflow] = useState(false)

  useEffect(() => {
    const { current } = ref

    const trigger = () => {
      const hasOverflow = current!.scrollWidth > current!.clientWidth
      setIsOverflow(hasOverflow)
    }

    if (current) {
      trigger()
    }
  }, [ref])

  return isOverflow
}
