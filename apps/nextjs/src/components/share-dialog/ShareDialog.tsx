import { CheckIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { Button, type ButtonProps, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Input, InputGroup, InputRightAddon, InputRightElement, useClipboard, useBoolean } from "@chakra-ui/react"
import { env } from "~/env.mjs"

type Props = {
  buttonProps: Omit<ButtonProps, 'onClick'>
  username: string
  collectionSlug?: string
  itemSlug?: string
}

const scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http'

export const ShareDialog = ({ username, collectionSlug, itemSlug, buttonProps }: Props) => {
  const path = [username, collectionSlug, itemSlug].filter(Boolean).join('/')
  const shortPath = [collectionSlug, itemSlug].filter(Boolean).join('/')

  const isProfilePath = collectionSlug === undefined && itemSlug === undefined

  const url = `${scheme}://${env.NEXT_PUBLIC_HOST}/${path}`

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onCopy, hasCopied } = useClipboard(url)

  const handleCopy = () => {
    onCopy()
  }

  return (
    <>
      <Button {...buttonProps} onClick={onOpen}>Share</Button>

      <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInBottom' size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup my='2'>
              <Input isReadOnly value={url} onFocus={e => e.target.select()} />
              <InputRightElement width='8rem' justifyContent='end' pr='1.5'>
                <Button h='1.75rem' size='md' onClick={handleCopy}>
                  {hasCopied ? <><CheckIcon color='green.500' mr='1' />Copied</> : 'Copy'}
                </Button>
              </InputRightElement>
            </InputGroup>
            {
              isProfilePath
                ? <Button variant='link' as={Link} href={`/profile/edit`}>Edit username in settings</Button>
                : <Button variant='link' as={Link} href={`/my/${shortPath}/edit`}>Edit URL in settings</Button>
            }
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