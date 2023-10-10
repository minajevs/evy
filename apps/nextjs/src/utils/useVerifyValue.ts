import { useState } from 'react'
import { useDebounce } from './useDebounce'

export const useVerifyValue = (defaultValue: string) => {
  const [currentValue, setCurrentValue] = useState(defaultValue)
  const debounceValue = useDebounce(currentValue, 500)

  const valueChanged = currentValue !== defaultValue
  const debounceValueChanged = debounceValue !== defaultValue
  const debounceSettled = debounceValue === currentValue || !valueChanged

  return {
    debounceSettled,
    shouldVerify: valueChanged && debounceValueChanged && debounceSettled,
    verifyValue: debounceValue,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setCurrentValue(event.target.value),
  }
}
