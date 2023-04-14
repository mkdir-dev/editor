import Link from "next/link"
import { Suspense } from "react"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { Container, Box, Button, Flex, Spinner } from "@chakra-ui/react"
import Navigation from "./Navigation"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  return (
    <Flex alignItems={"center"} flexWrap={"wrap"} gap={2}>
      {currentUser ? (
        <>{currentUser.email}</>
      ) : (
        <Link href={Routes.SignupPage()}>
          <Button colorScheme={"teal"} variant={"solid"}>
            Sign Up
          </Button>
        </Link>
      )}

      <Link href={currentUser ? Routes.Home() : Routes.LoginPage()}>
        <Button
          colorScheme={"teal"}
          variant={"outline"}
          onClick={async () => {
            if (currentUser) await logoutMutation()
          }}
        >
          {currentUser ? "Logout" : "Log In"}
        </Button>
      </Link>
    </Flex>
  )
}

const Header = () => {
  return (
    <Box as={"header"} px={10} py={5} bgColor={"InfoBackground"}>
      <Container
        maxW="container.xl"
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Suspense fallback={<Spinner color={"teal"} size="md" />}>
          <Navigation />
          <UserInfo />
        </Suspense>
      </Container>
    </Box>
  )
}

export default Header
