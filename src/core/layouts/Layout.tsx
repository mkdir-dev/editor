import Head from "next/head"
import React from "react"
import { BlitzLayout } from "@blitzjs/next"
import Header from "../components/Header"
import { Box, Center, Heading } from "@chakra-ui/react"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <Box display={"flex"} flexDirection={"column"} minHeight={"100vh"}>
      <Head>
        <title>{`${title} | Editor` || "Editor"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Box
        as={"main"}
        pt={5}
        pb={10}
        px={10}
        minHeight={"100%"}
        display={"flex"}
        flexDirection={"column"}
        flex={"1 0 auto"}
      >
        {title && (
          <Center>
            <Heading size={"md"} my={4} color={"teal"}>
              {title}
            </Heading>
          </Center>
        )}

        {children}
      </Box>
    </Box>
  )
}

export default Layout
