import { Box, type BoxProps, Button, Card, CardBody, Collapse, Icon, useDisclosure } from "@chakra-ui/react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { FeedbackForm } from "./FeedbackForm"
import { useCookies } from "react-cookie"
import { useCallback } from "react"

export const feedbackSeenCookieName = 'preference:seen-feedback'

type Props = {
  seenFeedback: boolean
} & BoxProps
export const FeedbackWidget = ({ seenFeedback, ...rest }: Props) => {
  const [cookies, setCookie] = useCookies([feedbackSeenCookieName])
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: !seenFeedback })

  const toggle = useCallback(() => {
    onToggle()
    setCookie(feedbackSeenCookieName, 'true', { path: '/', sameSite: 'strict' })
  }, [onToggle, setCookie])

  return <Box
    position='fixed'
    bottom={1}
    right={1}
    display='flex'
    flexDirection='column'
    alignItems='end'
    {...rest}
  >
    <Button variant='solid' onClick={toggle} display='flex' rightIcon={<Icon as={isOpen ? ChevronDown : ChevronUp} />}>
      Have some feedback?
    </Button>
    <Collapse in={isOpen} animateOpacity unmountOnExit={false}>
      <Card
        shadow='xl'
      >
        <CardBody>
          <FeedbackForm />
        </CardBody>
      </Card>
    </Collapse>
  </Box>
}