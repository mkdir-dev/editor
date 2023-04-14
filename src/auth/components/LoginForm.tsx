import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import login from "src/auth/mutations/login"
import { Login } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { Stack, Center, Button, ButtonGroup, useToast } from "@chakra-ui/react"
import { fieldsAuthForm } from "src/utils/constants"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
  const toast = useToast()

  return (
    <Stack w={"100%"} flexDirection={"column"}>
      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)

            toast({
              title: "You are signed in to the app",
              status: "success",
              position: "bottom-right",
              isClosable: true,
            })
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              toast({
                title: `Sorry, those credentials are invalid`,
                status: "error",
                position: "bottom-right",
                isClosable: true,
              })

              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              toast({
                title: `Sorry, we had an unexpected error. Please try again. - ${error.toString()}`,
                status: "error",
                position: "bottom-right",
                isClosable: true,
              })

              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        {fieldsAuthForm.map((field) => {
          return (
            <LabeledTextField
              key={`loginForm-${field.name}`}
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
        <ButtonGroup flexDirection={"column"} mt={4} gap={4}>
          <Link href={Routes.ForgotPasswordPage()}>
            <Button colorScheme={"teal"} variant={"link"}>
              Forgot your password?
            </Button>
          </Link>

          <Link href={Routes.SignupPage()}>
            <Button colorScheme={"teal"} w={"100%"} variant={"link"}>
              Sign Up
            </Button>
          </Link>
        </ButtonGroup>
      </Center>
    </Stack>
  )
}

export default LoginForm
