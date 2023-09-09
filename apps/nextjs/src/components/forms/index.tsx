import { zodResolver } from '@hookform/resolvers/zod'
import {
	useForm as useHookForm,
	type UseFormProps as UseHookFormProps,
} from 'react-hook-form'
import { type TypeOf, type ZodSchema } from 'zod'

type UseFormProps<T extends ZodSchema<any>> = UseHookFormProps<TypeOf<T>> & {
	schema: T
}

export const useForm = <T extends ZodSchema<any>>({
	schema,
	...formConfig
}: UseFormProps<T>) => {
	return useHookForm({
		...formConfig,
		mode: 'onChange',
		resolver: zodResolver(schema)
	})
}
