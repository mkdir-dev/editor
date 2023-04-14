import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from "react"
import { useFormContext } from "react-hook-form"
import { FormControl, FormLabel, FormHelperText, Input } from "@chakra-ui/react"
import { ErrorMessage } from "@hookform/error-message"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field placeholder. */
  placeholder?: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  /** Field required. */
  required?: boolean | undefined

  /** Other props. */
  labelProps?: ComponentPropsWithoutRef<"label">
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, placeholder, type, required, labelProps, outerProps }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext()

    return (
      <FormControl ref={ref} isRequired={required} isDisabled={isSubmitting} {...outerProps}>
        <FormLabel {...labelProps}>{label}</FormLabel>
        <Input variant="outline" placeholder={placeholder} {...register(name)} type={type} />
        <ErrorMessage
          render={({ message }) => <FormHelperText color={"red"}>{message}</FormHelperText>}
          errors={errors}
          name={name}
        />
      </FormControl>
    )
  }
)

export default LabeledTextField
