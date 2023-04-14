import { useMutation } from "@blitzjs/rpc"
import { Stack, Center, Button, useToast } from "@chakra-ui/react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import signup from "src/auth/mutations/signup"
import { Signup } from "src/auth/schemas"
import { fieldsAuthForm } from "src/utils/constants"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const toast = useToast()

  return (
    <Stack w={"100%"} flexDirection={"column"}>
      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()

            toast({
              title: "Account created successfully",
              status: "success",
              position: "bottom-right",
              isClosable: true,
            })
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              toast({
                title: "This email is already being used",
                status: "error",
                position: "bottom-right",
                isClosable: true,
              })
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              toast({
                title: `${error.toString()}`,
                status: "error",
                position: "bottom-right",
                isClosable: true,
              })
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        {fieldsAuthForm.map((field) => {
          return (
            <LabeledTextField
              key={`signupForm-${field.name}`}
              name={field.name}
              label={field.label}
              placeholder={field.placeholder}
              required={field.required}
              type={field.type}
            />
          )
        })}
      </Form>

      <Center>
        <Link href={Routes.LoginPage()}>
          <Button colorScheme={"teal"} w={"100%"} mt={4} variant={"link"}>
            Log In
          </Button>
        </Link>
      </Center>
    </Stack>
  )
}

export default SignupForm
