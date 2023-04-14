import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"
import { Center, Spinner, Box, Button, Flex } from "@chakra-ui/react"

const Home: BlitzPage = () => {
  return (
    <Layout title="Home">
      <Center>
        <Suspense
          fallback={Spinner ? <Spinner color={"teal"} thickness="4px" size="xl" /> : "Loading"}
        >
          Welcome!
        </Suspense>
      </Center>
    </Layout>
  )
}

export default Home
