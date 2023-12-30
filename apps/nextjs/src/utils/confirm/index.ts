import { useContext } from 'react'
import ConfirmContext, { type OpenProps } from '~/utils/confirm/context'

export const useConfirm = () => {
  const { open, close } = useContext(ConfirmContext)

  const confirm = (props: OpenProps) => {
    return new Promise<boolean>((resolve) => {
      open(
        {
          resolve,
          withLoading: false,
        },
        props,
      )
    })
  }

  const confirmWithLoading = (props: OpenProps) => {
    return new Promise<boolean>((resolve) => {
      open(
        {
          resolve,
          withLoading: true,
        },
        props,
      )
    })
  }

  return { confirm, confirmWithLoading, close }
}
