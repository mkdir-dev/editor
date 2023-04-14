import React, { memo, useEffect, useRef } from "react"
import { ErrorMessage } from "@hookform/error-message"
import { useFormContext } from "react-hook-form"
import EditorJS, { OutputData } from "@editorjs/editorjs"
import Header from "@editorjs/header"
import Paragraph from "@editorjs/paragraph"
import NestedList from "@editorjs/nested-list"
import Quote from "@editorjs/quote"
import Checklist from "@editorjs/checklist"
import Table from "@editorjs/table"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"
import Warning from "@editorjs/warning"

import { Box, FormControl, FormLabel, FormHelperText } from "@chakra-ui/react"

interface EditorBlockProps {
  name: string
  label: string
  placeholder?: string
  holder: string
  data?: OutputData | undefined
  onChange(val: OutputData): void
}

const EDITOR_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      levels: [1, 2, 3, 4],
      defaultLevel: 3,
    },
  },

  list: {
    class: NestedList,
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  table: {
    class: Table,
    inlineToolbar: true,
  },
  marker: {
    class: Marker,
    inlineToolbar: true,
  },
  inlineCode: {
    class: InlineCode,
    inlineToolbar: true,
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
  },
}

export const EditorBlock = (props: EditorBlockProps) => {
  const { name, label, placeholder, holder, data, onChange } = props

  const ref = useRef<EditorJS | null>(null)
  const {
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useFormContext()

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        data,
        async onChange(api, event) {
          const data = await api.saver.save()
          onChange(data)

          setValue(name, data, { shouldDirty: true })
        },
      })
      ref.current = editor
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (errors?.[`${name}`]) console.log("errs", errors?.[`${name}`])

  return (
    <FormControl isRequired isDisabled={isSubmitting}>
      <FormLabel>{label}</FormLabel>
      <Box id={holder} placeholder={placeholder} {...register(name)} className="cdx-input" />

      <ErrorMessage
        render={() => <FormHelperText color={"red"}>Validation error!</FormHelperText>}
        errors={errors}
        name={name}
      />
    </FormControl>
  )
}

export default memo(EditorBlock)
