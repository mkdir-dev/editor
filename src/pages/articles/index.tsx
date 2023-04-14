import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { usePaginatedQuery, useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import {
  Container,
  SimpleGrid,
  ButtonGroup,
  Button,
  IconButton,
  Spinner,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"
import { z } from "zod"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Layout from "src/core/layouts/Layout"
import getArticles from "src/articles/queries/getArticles"
import deleteArticle from "src/articles/mutations/deleteArticle"
import { DescriptionSchema } from "src/articles/schemas"
import { CardContent } from "src/core/components/CardContent"

const ITEMS_PER_PAGE = 12

export type Description = z.infer<typeof DescriptionSchema>
export interface CardContentProps {
  descriptionData: Description
}

export const ArticlesList = () => {
  const user = useCurrentUser()
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ articles, hasMore }] = usePaginatedQuery(getArticles, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const [deleteArticleMutation] = useMutation(deleteArticle)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <Container
      maxW="container.xl"
      minHeight={"100%"}
      display={"flex"}
      flexDirection={"column"}
      flex={"1 0 auto"}
    >
      <SimpleGrid spacing={10} columns={[2, null, 3]} flex={"1 0 auto"}>
        {articles.map((article) => {
          const descriptionData: Description = JSON.parse(JSON.stringify(article.description))

          return (
            <Card key={article.id}>
              <CardHeader
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                flexWrap={"wrap-reverse"}
              >
                <Heading size="md">{article.title}</Heading>
                {(user?.id === article.userId || user?.role !== "USER") && (
                  <IconButton
                    variant="ghost"
                    colorScheme={"teal"}
                    size={"md"}
                    aria-label="See menu"
                    icon={<DeleteIcon />}
                    onClick={async () => {
                      if (window.confirm("This will be deleted")) {
                        await deleteArticleMutation({ id: article.id })
                        await router.push(Routes.ArticlesPage())
                      }
                    }}
                  />
                )}
              </CardHeader>

              <CardBody>
                <CardContent descriptionData={descriptionData} />
              </CardBody>
              <CardFooter>
                <Link
                  style={{ width: "100%" }}
                  href={Routes.ShowArticlePage({ articleId: article.id })}
                >
                  <Button colorScheme={"teal"} variant={"ghost"} w={"100%"}>
                    View here
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </SimpleGrid>

      <ButtonGroup w={"100%"} mt={10} gap={4}>
        <Button
          colorScheme={"teal"}
          w={"100%"}
          variant={"outline"}
          isDisabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </Button>

        <Link style={{ width: "100%" }} href={Routes.NewArticlePage()}>
          <Button colorScheme={"teal"} w={"100%"}>
            Create Article
          </Button>
        </Link>

        <Button
          colorScheme={"teal"}
          w={"100%"}
          variant={"outline"}
          isDisabled={!hasMore}
          onClick={goToNextPage}
        >
          Next
        </Button>
      </ButtonGroup>
    </Container>
  )
}

const ArticlesPage = () => {
  return (
    <Layout title="Articles">
      <Suspense fallback={<Spinner color={"teal"} size="md" />}>
        <ArticlesList />
      </Suspense>
    </Layout>
  )
}

export default ArticlesPage
