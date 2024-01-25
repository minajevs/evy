import { type RefObject, useMemo } from 'react'

const getContext = () => {
  const fragment: DocumentFragment = document.createDocumentFragment()
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  fragment.appendChild(canvas)
  return canvas.getContext('2d') as CanvasRenderingContext2D
}

type Props = {
  ref: RefObject<HTMLInputElement>
  text: string
}
const useTextWidth = ({ ref, text }: Props) => {
  return useMemo(() => {
    if (ref.current?.value) {
      const context = getContext()
      const computedStyles = window.getComputedStyle(ref.current)
      context.font = computedStyles.font
      const metrics = context.measureText(text)

      return metrics.width
    }

    return NaN
  }, [ref, text])
}

export default useTextWidth
