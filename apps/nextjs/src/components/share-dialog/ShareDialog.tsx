import { Box, Icon, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import { Button, type ButtonProps, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Input, InputGroup, InputRightElement, useClipboard } from "@chakra-ui/react"
import { env } from "~/env.mjs"
import { CopyCheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react"
import { cloneElement, type ReactElement } from "react"
import { QRCodeSVG } from "qrcode.react"
import EvyLogo from "../../../public/logo.svg"


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
            <Tabs>
              <TabList>
                <Tab>Link</Tab>
                <Tab>QR Code</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <InputGroup my='2'>
                    <Input isReadOnly value={url} onFocus={e => e.target.select()} />
                    <InputRightElement width='8rem' justifyContent='end' pr='1.5'>
                      <IconButton aria-label="open sharing link" icon={<Icon as={ExternalLinkIcon} />} h='1.75rem' mr={1} as={Link} href={url} target="_blank" rel="noopener noreferrer" />
                      <Button leftIcon={<Icon as={hasCopied ? CopyCheckIcon : CopyIcon} color={hasCopied ? 'green.500' : 'default'} />} h='1.75rem' size='md' onClick={handleCopy} >
                        {hasCopied ? 'Copied' : 'Copy'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </TabPanel>
                <TabPanel>
                  <Box display='flex' justifyContent='center'>
                    <QRCodeSVG
                      size={256}
                      value={url}
                      level='M'
                      imageSettings={{
                        src: EvyLogo.src,
                        excavate: true,
                        height: 64,
                        width: 64
                      }}
                    />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
            {
              isProfilePath
                ? <Button variant='link' as={Link} href={`/profile/edit`}>Edit username in settings</Button>
                : <Button variant='link' as={Link} href={`/my/${shortPath}/edit`}>Edit URL in settings</Button>
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='secondary' width='5rem' onClick={onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}