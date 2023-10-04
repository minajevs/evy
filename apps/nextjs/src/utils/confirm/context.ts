import { createContext } from 'react'

type PromiseResolve<T> = (value: T) => void

export type OpenData = {
  resolve: PromiseResolve<boolean>
  withLoading: boolean
}

export type OpenProps = {
  text: string
  title?: string
}

export type ConfirmContext = {
  open: (data: OpenData, props: OpenProps) => void
  close: () => void
}

export default createContext<ConfirmContext>({
  open: () => {},
  close: () => {},
})
