import { Text, type FlexProps, Flex, Button, ButtonGroup, Icon } from "@chakra-ui/react"
import { ChevronsLeft, ChevronsRight } from "lucide-react"

type Props = {
  currentPage: number
  pageSize?: number
  totalItems: number,
  changePage: (page: number) => void
} & FlexProps
export const Pagination = ({ currentPage, pageSize = 10, totalItems, changePage, ...rest }: Props) => {
  const totalPages = Math.ceil(totalItems / pageSize)
  if (totalPages === 1) return null

  const lastItem = Math.min(currentPage * pageSize, totalItems)
  const firstItem = (currentPage - 1) * pageSize + 1

  const buttons = getPaginationButtons(totalPages, currentPage)

  return <Flex
    direction={{ base: 'column', md: 'row' }}
    justifyContent="space-between"
    alignItems="center"
    width="full"
    {...rest}>
    <Text>Showing {firstItem} to {lastItem} of {totalItems} items</Text>
    <ButtonGroup isAttached variant='outline'>
      {buttons.map((x, i) => {
        if (x === 'first') {
          return <Button key={i} leftIcon={<Icon boxSize={4} as={ChevronsLeft} />} onClick={() => changePage(1)}>1</Button>
        }
        if (x === 'last') {
          return <Button key={i} rightIcon={<Icon boxSize={4} as={ChevronsRight} />} onClick={() => changePage(totalPages)}>{totalPages}</Button>
        }

        return <Button key={i} onClick={() => currentPage !== x ? changePage(+x) : void 0} isActive={currentPage === x}>{x}</Button>
      })}
    </ButtonGroup>
  </Flex>
}

const getPaginationButtons = (totalPages: number, currentPage: number) => {
  if (totalPages <= 3) return [...new Array<undefined>(totalPages)].map((_, i) => i + 1)

  if (currentPage <= 3) return [1, 2, 3, 4, 'last']
  if (currentPage > totalPages - 3) return ['first', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  return ['first', currentPage - 1, currentPage, currentPage + 1, 'last']
}
