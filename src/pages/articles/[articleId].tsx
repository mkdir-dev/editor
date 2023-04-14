import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import {
  Container,
  Spinner,
  Box,
  Heading,
  Text,
  ButtonGroup,
  Button,
  Divider,
  Flex,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react"
import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { z } from "zod"

import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Layout from "src/core/layouts/Layout"
import getArticle from "src/articles/queries/getArticle"
import deleteArticle from "src/articles/mutations/deleteArticle"
import { DescriptionSchema, BlockSchema } from "src/articles/schemas"
import { CardFullContent } from "src/core/components/CardFullContent"

export type Description = z.infer<typeof DescriptionSchema>
export type Block = z.infer<typeof BlockSchema>
export interface CardContentProps {
  descriptionData: Description
}
export interface CardContentProps {
  blockData: Block
}

export const Article = () => {
  const user = useCurrentUser()
  const router = useRouter()
  const articleId = useParam("articleId", "number")
  const [deleteArticleMutation] = useMutation(deleteArticle)
  const [article] = useQuery(getArticle, { id: articleId })

  const descriptionData: Description = JSON.parse(JSON.stringify(article.description))

  return (
    <>
      <Head>
        <title>{`${article.title} | Article | Editor`}</title>
      </Head>

      <Card overflow={"hidden"} flex={"1 0 auto"}>
        <CardHeader px={10} bgColor={"gray.100"}>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Box>
              <Heading size={"md"} color={"teal"}>
                {article.title}
              </Heading>
              <Text>{article.category}</Text>
            </Box>

            {(user?.id === article.userId || user?.role !== "USER") && (
              <ButtonGroup>
                <Link href={Routes.EditArticlePage({ articleId: article.id })}>
                  <IconButton
                    variant="ghost"
                    colorScheme="teal"
                    aria-label={"edit"}
                    icon={<EditIcon />}
                  />
                </Link>

                <IconButton
                  variant="ghost"
                  colorScheme="teal"
                  aria-label={"delete"}
                  icon={<DeleteIcon />}
                  onClick={async () => {
                    if (window.confirm("This will be deleted")) {
                      await deleteArticleMutation({ id: article.id })
                      await router.push(Routes.ArticlesPage())
                    }
                  }}
                />
              </ButtonGroup>
            )}
          </Flex>
        </CardHeader>

        <CardBody px={10} display={"flex"} flexDirection={"column"} gap={2}>
          {descriptionData.blocks.map((block, idx) => (
            <CardFullContent key={`${article.id}-${idx}`} block={block} />
          ))}
        </CardBody>

        <Flex w={"100%"} py={10} px={10} justifyContent={"flex-end"} gap={4}>
          <Text as="cite">{article.author}</Text>
        </Flex>

        <Divider />

        <CardFooter px={10} justifyContent={"flex-end"}>
          <ButtonGroup w={"60%"} gap={4}>
            <Link href={Routes.ArticlesPage()} style={{ flex: "1 1 0" }}>
              <Button colorScheme={"teal"} w={"100%"} variant={"outline"}>
                Articles
              </Button>
            </Link>
            <Link href={Routes.NewArticlePage()} style={{ flex: "1 1 0" }}>
              <Button colorScheme={"teal"} w={"100%"}>
                Create Article
              </Button>
            </Link>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  )
}

const ShowArticlePage = () => {
  return (
    <Container maxW="container.xl" display={"flex"} flexDirection={"column"} flex={"1 0 auto"}>
      <Suspense fallback={<Spinner color={"teal"} size="md" />}>
        <Article />
      </Suspense>
    </Container>
  )
}

ShowArticlePage.authenticate = true
ShowArticlePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowArticlePage
