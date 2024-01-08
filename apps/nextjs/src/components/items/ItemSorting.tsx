import { HStack, Menu, ButtonGroup, MenuButton, Button, IconButton, Icon, MenuList, MenuItem, Text, type StackProps } from "@chakra-ui/react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { type SortingDirection } from "~/utils/sorting/types"

export type Sorting = 'name' | 'date'

type Props = {
  sorting: Sorting,
  sortingDirection: SortingDirection,
  updateSorting: (sorting: Sorting, direction: SortingDirection) => void
} & StackProps
export const ItemSorting = ({ sorting, sortingDirection, updateSorting, ...rest }: Props) => {
  return <HStack {...rest}>
    <Text color='gray' whiteSpace='nowrap'>Sort by:</Text>
    <Menu>
      <ButtonGroup isAttached variant='outline'>
        <MenuButton as={Button}>
          {sorting === 'name' ? 'Name' : 'Date added'}
        </MenuButton>
        <IconButton
          onClick={() => updateSorting(sorting, sortingDirection === 'desc' ? 'asc' : 'desc')}
          aria-label='sorting direction'
          icon={
            sortingDirection === 'desc'
              ? <Icon as={ArrowDown} />
              : <Icon as={ArrowUp} />
          }
        />
      </ButtonGroup>
      <MenuList>
        <MenuItem onClick={() => updateSorting('name', sortingDirection)}>Name</MenuItem>
        <MenuItem onClick={() => updateSorting('date', sortingDirection)}>Date added</MenuItem>
      </MenuList>
    </Menu>
  </HStack>
}