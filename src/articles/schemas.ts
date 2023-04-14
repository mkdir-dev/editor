import { z } from "zod"

const TableCell = z.string().optional()
const TableRow = z.array(TableCell).optional()
const TableContent = z.array(TableRow).optional()

const ItemDataSchema = z.object({
  content: z.string().optional(),
  text: z.string().optional(),
  checked: z.boolean().optional(),
  items: z.array(z.lazy(() => z.array(ItemDataSchema))).optional(),
})

const BlockDataSchema = z.object({
  text: z.string().optional(),
  level: z.number().optional(),
  style: z.string().optional(),
  caption: z.string().optional(),
  alignment: z.string().optional(),
  withHeadings: z.boolean().optional(),
  content: TableContent,
  title: z.string().optional(),
  message: z.string().optional(),
  items: z.array(ItemDataSchema).optional(),
})

export const BlockSchema = z.object({
  type: z.string(),
  data: BlockDataSchema,
})

export const DescriptionSchema = z.object({
  blocks: z.array(BlockSchema).nonempty({ message: "Description is required" }),
})

export const CreateArticleSchema = z.object({
  title: z.string().min(3).max(80),
  description: DescriptionSchema,
  category: z.string().min(1, { message: "Category is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  userId: z.number().or(z.null()),
})

export const UpdateArticleSchema = z.object({
  id: z.number(),
  data: CreateArticleSchema,
})

export const DeleteArticleSchema = z.object({
  id: z.number(),
})
