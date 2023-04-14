import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { ResetPassword } from "src/auth/schemas"
import resetPassword from "src/auth/mutations/resetPassword"
import { BlitzPage, Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { assert } from "blitz"
import { Container, Heading, Text, useToast } from "@chakra-ui/react"
import Layout from "src/core/layouts/Layout"

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter()
  const token = router.query.token?.toString()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)
  const toast = useToast()

  return (
    <>
      {isSuccess ? (
        <Container maxW={"400px"}>
          <Heading color={"teal.700"} size={"sm"} textAlign={"center"} m={2}>
            Password Reset Successfully
          </Heading>
          <Text textAlign={"center"}>
            Go to the <Link href={Routes.Home()}>homepage</Link>
          </Text>
        </Container>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPassword}
          initialValues={{
            password: "",
            passwordConfirmation: "",
            token,
          }}
          onSubmit={async (values) => {
            try {
              assert(token, "token is required.")
              await resetPasswordMutation({ ...values, token })

              toast({
                title: "Password reset successful",
                status: "success",
                position: "bottom-right",
                isClosable: true,
              })
            } catch (error: any) {
              if (error.name === "ResetPasswordError") {
                toast({
                  title: `${error.message}`,
                  status: "error",
                  position: "bottom-right",
                  isClosable: true,
                })

                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
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
            }
          }}
        >
          <LabeledTextField
            name="password"
            label="New Password"
            type="password"
            placeholder="Password"
            required
          />
          <LabeledTextField
            name="passwordConfirmation"
            label="Confirm New Password"
            type="password"
            placeholder="Password"
            required
          />
        </Form>
      )}
    </>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = "/"
ResetPasswordPage.getLayout = (page) => <Layout title="Reset Your Password">{page}</Layout>

export default ResetPasswordPage
