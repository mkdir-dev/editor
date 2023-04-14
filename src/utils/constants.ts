import { LabeledTextFieldProps } from "src/core/components/LabeledTextField"

export const fieldsAuthForm: LabeledTextFieldProps[] = [
  {
    name: "email",
    label: "Email",
    placeholder: "Email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Password",
    required: true,
    type: "password",
  },
]
