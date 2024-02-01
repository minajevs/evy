import { Icon } from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import { Button, type ButtonProps, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Input, InputGroup, InputRightElement, useClipboard } from "@chakra-ui/react"
import { env } from "~/env.mjs"
import { CopyCheckIcon, CopyIcon } from "lucide-react"
import { cloneElement, type ReactElement } from "react"

type Props = {
  buttonProps?: Omit<ButtonProps, 'onClick'>
  username: string
  collectionSlug?: string
  itemSlug?: string
  customButton?: ReactElement<{ onClick: () => void }>
}

const scheme = process.env.NODE_ENV === 'production' ? 'https' : 'http'

export const ShareDialog = ({ username, collectionSlug, itemSlug, buttonProps, customButton }: Props) => {
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
      {
        customButton !== undefined
          ? cloneElement(customButton, { onClick: onOpen, ...buttonProps })
          : <Button {...buttonProps} onClick={onOpen}>Share</Button>
      }

      <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInBottom' size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup my='2'>
              <Input isReadOnly value={url} onFocus={e => e.target.select()} />
              <InputRightElement width='8rem' justifyContent='end' pr='1.5'>
                <Button leftIcon={<Icon as={hasCopied ? CopyCheckIcon : CopyIcon} color={hasCopied ? 'green.500' : 'default'} />} h='1.75rem' size='md' onClick={handleCopy} >
                  {hasCopied ? 'Copied' : 'Copy'}
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