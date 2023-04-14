import {
  Heading,
  Text,
  OrderedList,
  UnorderedList,
  List,
  ListItem,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react"
import { z } from "zod"

import { BlockSchema } from "src/articles/schemas"

export type Block = z.infer<typeof BlockSchema>
export interface CardFullContentProps {
  block: Block
}

export const CardFullContent = (props: CardFullContentProps) => {
  const { block } = props
  const { type, data } = block

  if ((type === "paragraph" || type === "header") && data?.text) {
    return <Text dangerouslySetInnerHTML={{ __html: data.text }} />
  }

  if (type === "list" && data?.items) {
    const existOrder = data?.style === "ordered"

    if (existOrder) {
      return (
        <OrderedList>
          {data?.items.map(({ content }, index) => (
            <ListItem key={`${index}-${content}}`} dangerouslySetInnerHTML={{ __html: content }} />
          ))}
        </OrderedList>
      )
    } else {
      return (
        <UnorderedList>
          {data?.items.map(({ content }, index) => (
            <ListItem key={`${index}-${content}}`} dangerouslySetInnerHTML={{ __html: content }} />
          ))}
        </UnorderedList>
      )
    }
  }

  if (type === "quote" && data?.text) {
    return (
      <>
        <Heading size="md" dangerouslySetInnerHTML={{ __html: data.text }} />
        {data.caption && <Text dangerouslySetInnerHTML={{ __html: data.caption }} />}
      </>
    )
  }

  if (type === "checklist" && data?.items) {
    return (
      <List>
        {data?.items.map(({ text, checked }, index) => (
          <ListItem
            key={`${index}-${checked}-${text}}`}
            display={"flex"}
            alignItems={"center"}
            gap={2}
          >
            <Checkbox defaultChecked={checked} isDisabled={true} />
            <Text dangerouslySetInnerHTML={{ __html: text }} />
          </ListItem>
        ))}
      </List>
    )
  }

  if (type === "table" && data?.content) {
    return (
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              {data?.content[0]?.map((el, idx) => {
                return <Th key={`${idx}-${el}}`} dangerouslySetInnerHTML={{ __html: el ?? "" }} />
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data?.content
              ?.map((row, index) => {
                return (
                  <Tr key={`${index}-${row}}`}>
                    {row?.map((el, i) => (
                      <Td key={`${i}-${el}}`} dangerouslySetInnerHTML={{ __html: el ?? "" }} />
                    ))}
                  </Tr>
                )
              })
              .slice(0)}
          </Tbody>
        </Table>
      </TableContainer>
    )
  }

  if (type === "warning" && data?.title) {
    return (
      <>
        <Heading size="md" dangerouslySetInnerHTML={{ __html: data.title }} />
        {data.message && <Text dangerouslySetInnerHTML={{ __html: data.message }} />}
      </>
    )
  }

  return <></>
}
