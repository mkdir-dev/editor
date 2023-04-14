import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateArticleSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateArticleSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const article = await db.article.create({
      data: { ...input, description: JSON.parse(JSON.stringify(input.description)) },
    })

    console.log("article", article)

    return article
  }
)
