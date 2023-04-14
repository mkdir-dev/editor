import Layout from "src/core/layouts/Layout"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { ForgotPassword } from "src/auth/schemas"
import forgotPassword from "src/auth/mutations/forgotPassword"
import { useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import { Container, Heading, Text, useToast } from "@chakra-ui/react"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)
  const toast = useToast()

  return (
    <Layout title="Forgot Your Password?">
      {isSuccess ? (
        <Container maxW={"400px"}>
          <Heading color={"teal.700"} size={"sm"} textAlign={"center"} m={2}>
            Request Submitted
          </Heading>
          <Text textAlign={"center"}>
            If your email is in our system, you will receive instructions to reset your password
            shortly.
          </Text>
        </Container>
      ) : (
        <Form
          submitText="Send Reset Password Instructions"
          schema={ForgotPassword}
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            try {
              await forgotPasswordMutation(values)

              toast({
                title: "Password reset request completed successfully",
                status: "success",
                position: "bottom-right",
                isClosable: true,
              })
            } catch (error: any) {
              toast({
                title: "Sorry, we had an unexpected error. Please try again.",
                status: "error",
                position: "bottom-right",
                isClosable: true,
              })

              return {
                [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
              }
            }
          }}
        >
          <LabeledTextField name="email" label="Email" placeholder="Email" required />
        </Form>
      )}
    </Layout>
  )
}

export default ForgotPasswordPage
