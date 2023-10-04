import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useBoolean, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react"
import ConfirmContext, { type OpenProps, type OpenData } from "~/utils/confirm/context"

type Props = {
  children: React.ReactNode
}
export const ConfirmProvider = ({ children }: Props) => {
  const [data, setData] = useState<{ data: OpenData, props: OpenProps } | null>(null)

  const { isOpen, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure()
  const [loading, { on, off }] = useBoolean()
  const cancelRef = useRef(null)

  const onOpen = (data: OpenData, props: OpenProps) => {
    setData({ data, props })
    onOpenAlert()
  }

  const onClose = () => {
    data?.data.resolve(false)
    onCloseAlert()
    off()
  }

  const onConfirm = () => {
    data?.data.resolve(true)
    if (data?.data.withLoading ?? false) {
      on()
    } else {
      onClose()
    }
  }

  const onCancel = () => {
    data?.data.resolve(false)
    onClose()
  }


  return <ConfirmContext.Provider value={{
    open: onOpen,
    close: onClose
  }}>
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}

      closeOnEsc={!loading}
      closeOnOverlayClick={!loading}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {data?.props.title ?? "Alert"}
          </AlertDialogHeader>

          <AlertDialogBody>
            {data?.props.text}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onCancel} hidden={loading}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={onConfirm} ml={3} isLoading={loading}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
    {children}
  </ConfirmContext.Provider>
}