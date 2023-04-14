import React, { useState } from "react"
import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/router"
import { Spinner, Center, ButtonGroup, Button, useToast } from "@chakra-ui/react"
import { OutputData } from "@editorjs/editorjs"

import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { ArticleForm } from "src/articles/components/ArticleForm"
import createArticle from "src/articles/mutations/createArticle"

const NewArticlePage = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const [createArticleMutation] = useMutation(createArticle)
  const toast = useToast()
  const [data, setData] = useState<OutputData>({
    blocks: [
      {
        type: "paragraph",
        data: {
          text: "Description",
        },
      },
    ],
  })

  return (
    <Layout title={"Create New Article"}>
      <Suspense fallback={<Spinner color={"teal"} size="md" />}>
        <ArticleForm
          submitText="Create Article"
          initialValues={{
            title: "",
            description: data,
            category: "",
            author: currentUser?.email || "",
            userId: currentUser?.id || null,
          }}
          editorData={data}
          onChangeEditorData={() => setData(data)}
          onSubmit={async (values) => {
            try {
              const article = await createArticleMutation(values)

              toast({
                title: "Article created successfully",
                status: "success",
                position: "bottom-right",
                isClosable: true,
              })

              await router.push(Routes.ShowArticlePage({ articleId: article.id }))
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
          <ButtonGroup flexDirection={"column"} mt={4} gap={4}>
            <Link href={Routes.ArticlesPage()}>
              <Button colorScheme={"teal"} variant={"link"}>
                Articles
              </Button>
            </Link>
          </ButtonGroup>
        </Center>
      </Suspense>
    </Layout>
  )
}

NewArticlePage.authenticate = true

export default NewArticlePage
