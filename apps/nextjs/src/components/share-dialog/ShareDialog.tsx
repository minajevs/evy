import { CheckIcon } from "@chakra-ui/icons"
import { Button, type ButtonProps, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Input, InputGroup, InputRightAddon, InputRightElement, useClipboard, useBoolean } from "@chakra-ui/react"

type Props = {
  children: string
  buttonProps: Omit<ButtonProps, 'onClick'>
}
export const ShareDialog = ({ children: url, buttonProps }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onCopy, hasCopied } = useClipboard(url)

  const handleCopy = () => {
    onCopy()
  }

  return (
    <>
      <Button {...buttonProps} onClick={onOpen}>Share</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
              <Input isReadOnly value={url} onFocus={e => e.target.select()} />
              <InputRightElement width='8rem' justifyContent='end' pr='1.5'>
                <Button h='1.75rem' size='md' onClick={handleCopy}>
                  {hasCopied ? <><CheckIcon color='green.500' mr='1' />Copied</> : 'Copy'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' width='5rem' onClick={onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}