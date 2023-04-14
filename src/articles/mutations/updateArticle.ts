import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateArticleSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateArticleSchema),
  resolver.authorize(),
  async ({ id, ...input }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const article = await db.article.update({
      where: { id },
      data: { ...input.data, description: JSON.parse(JSON.stringify(input.data.description)) },
    })

    return article
  }
)
