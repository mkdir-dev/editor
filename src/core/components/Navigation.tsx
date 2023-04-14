import { Routes } from "@blitzjs/next"
import { Box, ButtonGroup, Button, Spinner } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Suspense } from "react"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const paths = [
  { name: "Home", pathname: Routes.Home().pathname, href: Routes.Home() },
  { name: "Articles", pathname: Routes.ArticlesPage().pathname, href: Routes.ArticlesPage() },
]

const Navigation: React.FC = () => {
  const currentUser = useCurrentUser()
  const { asPath } = useRouter()

  return (
    <Box display={"flex"} alignItems={"center"}>
      <Suspense fallback={<Spinner color={"teal"} size="md" />}>
        {currentUser ? (
          <ButtonGroup>
            {paths.map((path) => {
              return (
                <Link key={`${path.name}-${path.pathname}`} href={path.href}>
                  <Button colorScheme={asPath === path.pathname ? "teal" : "gray"} variant={"link"}>
                    {path.name}
                  </Button>
                </Link>
              )
            })}
          </ButtonGroup>
        ) : (
          <Link href={Routes.Home()}>
            <Button
              colorScheme={asPath === Routes.Home().pathname ? "teal" : "gray"}
              variant={"link"}
              disabled={asPath === Routes.Home().pathname}
            >
              Home
            </Button>
          </Link>
        )}
      </Suspense>
    </Box>
  )
}

export default Navigation
