import React from "react"
import { Routes } from "@blitzjs/next"
import { PromiseReturnType } from "blitz"
import dynamic from "next/dynamic"
import { OutputData } from "@editorjs/editorjs"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { CreateArticleSchema } from "src/articles/schemas"
import createArticle from "src/articles/mutations/createArticle"
import updateArticle from "src/articles/mutations/updateArticle"

type ArticleFormProps = {
  initialValues: any
  submitText: string
  editorData: OutputData
  onChangeEditorData: (val: OutputData) => void
  onSubmit: (val) => Promise<void>
  // onSuccess?: (article: PromiseReturnType<typeof createArticle>) => void
}

const EditorBlock = dynamic(() => import("src/core/components/Editor"), {
  ssr: false,
})

export const ArticleForm = (props: ArticleFormProps) => {
  const { submitText, initialValues, editorData, onChangeEditorData, onSubmit } = props

  return (
    <Form
      maxWidthForm={"container.sm"}
      submitText={submitText}
      schema={CreateArticleSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <LabeledTextField name="title" label="Title" placeholder="Title" required />
      <EditorBlock
        name="description"
        label="Description"
        placeholder="Description"
        data={editorData}
        onChange={onChangeEditorData}
        holder="create-article"
      />
      <LabeledTextField name="category" label="Category" placeholder="Category" required />
      <LabeledTextField name="author" label="Author" placeholder="Author" />
    </Form>
  )
}
