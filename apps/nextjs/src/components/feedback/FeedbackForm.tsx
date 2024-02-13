import { createFeedbackSchema } from "@evy/api/schemas"
import { useZodForm } from "../forms"
import { Box, Button, Checkbox, FormControl, FormLabel, HStack, Icon, Input, useBoolean } from "@chakra-ui/react"
import { CheckCircleIcon, SendIcon } from "lucide-react"
import { api } from "~/utils/api"

export const FeedbackForm = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
    reset
  } = useZodForm({
    schema: createFeedbackSchema,
    defaultValues: { needsResponse: false }
  })
  const [loading, { on, off }] = useBoolean()
  const [success, { on: onSuccess, off: offSuccess }] = useBoolean()

  const mutation = api.feedback.create.useMutation()

  const onSubmit = handleSubmit(async (input) => {
    if (success) return
    on()
    await mutation.mutateAsync(input)

    reset()
    off()
    onSuccess()
    setTimeout(() => offSuccess(), 3000)
  })

  return <form onSubmit={onSubmit}>
    <Box width='full'>
      <FormControl isInvalid={errors.text !== undefined} isRequired>
        <FormLabel>Your feedback</FormLabel>
        <Input
          isDisabled={loading}
          {...register('text')}
          placeholder='Feedback'
        />
      </FormControl>
    </Box>
    <HStack mt={2} justifyContent='space-between'>
      <Checkbox isDisabled={loading} colorScheme="primary" {...register('needsResponse')}>I want to get a response</Checkbox>
      <Button isLoading={loading} leftIcon={<Icon as={success ? CheckCircleIcon : SendIcon} />} variant='solid' isDisabled={(!isValid || loading) && !success} colorScheme={success ? 'green' : 'secondary'} type="submit">
        {
          success
            ? 'Sent!'
            : 'Send'
        }
      </Button>
    </HStack>
  </form>
}