import { ButtonGroup, type ButtonGroupProps, Icon, IconButton } from "@chakra-ui/react"
import { FiGrid, FiList } from "react-icons/fi"

export type View = 'grid' | 'table'

type Props = {
  currentView: View,
  updateView: (view: View) => void
} & ButtonGroupProps
export const ItemViewSelector = ({ currentView, updateView, ...rest }: Props) => {
  return <ButtonGroup isAttached variant='outline' {...rest}>
    <IconButton
      aria-label="grid view"
      icon={<Icon as={FiGrid} />}
      isActive={currentView === 'grid'}
      onClick={() => updateView('grid')}
    />
    <IconButton
      aria-label="table view"
      icon={<Icon as={FiList} />}
      isActive={currentView === 'table'}
      onClick={() => updateView('table')}
    />
  </ButtonGroup>
}