import { useState, ReactNode, PropsWithoutRef } from "react"
import { FormProvider, useForm, UseFormProps } from "react-hook-form"
import { Stack, Container, Center, Text, Button } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  maxWidthForm?: string
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: UseFormProps<z.infer<S>>["defaultValues"]
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  maxWidthForm,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  const ctx = useForm<z.infer<S>>({
    mode: "onBlur",
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: initialValues,
  })
  const [formError, setFormError] = useState<string | null>(null)

  return (
    <FormProvider {...ctx}>
      <Container maxW={maxWidthForm ?? "400px"}>
        <form
          onSubmit={ctx.handleSubmit(async (values) => {
            const result = (await onSubmit(values)) || {}
            for (const [key, value] of Object.entries(result)) {
              if (key === FORM_ERROR) {
                setFormError(value)
              } else {
                ctx.setError(key as any, {
                  type: "submit",
                  message: value,
                })
              }
            }
          })}
          {...props}
        >
          <Stack spacing={4}>{children}</Stack>

          {formError && (
            <Text fontSize="sm" color={"red"}>
              {formError}
            </Text>
          )}

          {submitText && (
            <Center>
              <Button
                colorScheme={"teal"}
                w={"100%"}
                mt={4}
                type="submit"
                disabled={ctx.formState.isSubmitting}
                isLoading={ctx.formState.isLoading}
                loadingText={"Saving..."}
              >
                {submitText}
              </Button>
            </Center>
          )}
        </form>
      </Container>
    </FormProvider>
  )
}

export default Form
