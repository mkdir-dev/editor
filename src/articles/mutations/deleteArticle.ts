import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteArticleSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteArticleSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const article = await db.article.deleteMany({ where: { id } })

    return article
  }
)
