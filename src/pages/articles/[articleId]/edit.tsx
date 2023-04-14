import React, { useState } from "react"
import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { Spinner, Heading, Center, ButtonGroup, Button, useToast } from "@chakra-ui/react"
import { OutputData } from "@editorjs/editorjs"

import Layout from "src/core/layouts/Layout"
import { UpdateArticleSchema } from "src/articles/schemas"
import getArticle from "src/articles/queries/getArticle"
import updateArticle from "src/articles/mutations/updateArticle"
import { ArticleForm } from "src/articles/components/ArticleForm"

const EditArticlePage = () => {
  const router = useRouter()
  const articleId = useParam("articleId", "number")
  const toast = useToast()
  const [updateArticleMutation] = useMutation(updateArticle)
  const [article, { setQueryData }] = useQuery(
    getArticle,
    { id: articleId },
    {
      staleTime: Infinity,
    }
  )
  const [data, setData] = useState<OutputData>(JSON.parse(JSON.stringify(article.description)))

  return (
    <Suspense fallback={<Spinner color={"teal"} size="md" />}>
      <Head>
        <title>{`${article.title} | Article | Editor`}</title>
      </Head>

      <Center>
        <Heading size={"md"} my={4} color={"teal"}>
          Update Article
        </Heading>
      </Center>

      <ArticleForm
        submitText="Update Article"
        initialValues={{
          title: article.title,
          description: data,
          category: article.category,
          author: article.author || "",
          userId: article.userId || null,
        }}
        editorData={data}
        onChangeEditorData={() => setData(data)}
        onSubmit={async (values) => {
          try {
            const updated = await updateArticleMutation({
              id: article.id,
              data: values,
            })

            await setQueryData(updated)

            toast({
              title: "Article updated successfully",
              status: "success",
              position: "bottom-right",
              isClosable: true,
            })

            await router.push(Routes.ShowArticlePage({ articleId: updated.id }))
          } catch (error) {
            toast({
              title: `Sorry, we had an unexpected error. Please try again. - ${error.toString()}`,
              status: "error",
              position: "bottom-right",
              isClosable: true,
            })
          }
        }}
      />

      <Center>
        <ButtonGroup w={"100%"} flexDirection={"column"} alignItems={"center"} mt={4} gap={4}>
          <Link href={Routes.NewArticlePage()}>
            <Button colorScheme={"teal"} variant={"link"}>
              Create Article
            </Button>
          </Link>
          <Link href={Routes.ArticlesPage()} style={{ marginLeft: 0 }}>
            <Button colorScheme={"teal"} variant={"link"}>
              Articles
            </Button>
          </Link>
        </ButtonGroup>
      </Center>
    </Suspense>
  )
}

EditArticlePage.authenticate = true
EditArticlePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditArticlePage
