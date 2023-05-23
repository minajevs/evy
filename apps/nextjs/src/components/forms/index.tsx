import { zodResolver } from '@hookform/resolvers/zod'
import { type ComponentProps } from 'react'
import {
	type FieldValues,
	FormProvider,
	type SubmitHandler,
	type UseFormReturn,
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
		resolver: zodResolver(schema),
	})
}

type FormProps<T extends FieldValues = any> = Omit<ComponentProps<'form'>, 'onSubmit'> & {
	form: UseFormReturn<T>
	onSubmit: SubmitHandler<T>
}

export const Form = <T extends FieldValues>({
	form,
	onSubmit,
	children,
	...props
}: FormProps<T>) => {
	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} {...props}>
				<fieldset
					disabled={form.formState.isSubmitting}
				>
					{children}
				</fieldset>
			</form>
		</FormProvider>
	)
}
