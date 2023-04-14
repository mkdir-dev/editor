import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetArticlesInput
  extends Pick<Prisma.ArticleFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetArticlesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: articles,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.article.count({ where }),
      query: (paginateArgs) => db.article.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      articles,
      nextPage,
      hasMore,
      count,
    }
  }
)
