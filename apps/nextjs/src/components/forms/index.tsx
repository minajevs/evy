/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod'
import {
	useFormContext,
	useForm as useHookForm,
	type UseFormProps as UseHookFormProps,
} from 'react-hook-form'
import { type z, type TypeOf, type ZodSchema } from 'zod'

type UseFormProps<T extends ZodSchema<any>> = UseHookFormProps<TypeOf<T>> & {
	schema: T
}

export const useZodForm = <T extends ZodSchema<any>>({
	schema,
	...formConfig
}: UseFormProps<T>) => {
	return useHookForm({
		...formConfig,
		mode: 'onChange',
		resolver: zodResolver(schema)
	})
}

export const useZodFormContext = <T extends ZodSchema<any>>() => {
	return useFormContext<z.infer<T>>()
}
