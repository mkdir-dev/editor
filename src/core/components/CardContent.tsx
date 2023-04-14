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

import { DescriptionSchema } from "src/articles/schemas"

export type Description = z.infer<typeof DescriptionSchema>
export interface CardContentProps {
  descriptionData: Description
}

export const CardContent = (props: CardContentProps) => {
  const { descriptionData } = props
  const descriptionDataType = descriptionData.blocks[0].type
  const content = descriptionData.blocks[0]

  if (
    (descriptionDataType === "paragraph" || descriptionDataType === "header") &&
    content.data?.text
  ) {
    return <Text dangerouslySetInnerHTML={{ __html: content.data.text }} />
  }

  if (descriptionDataType === "list" && content.data?.items) {
    const existOrder = content.data?.style === "ordered"

    if (existOrder) {
      return (
        <OrderedList>
          {content.data?.items.map(({ content }, index) => (
            <ListItem key={`${index}-${content}}`} dangerouslySetInnerHTML={{ __html: content }} />
          ))}
        </OrderedList>
      )
    } else {
      return (
        <UnorderedList>
          {content.data?.items.map(({ content }, index) => (
            <ListItem key={`${index}-${content}}`} dangerouslySetInnerHTML={{ __html: content }} />
          ))}
        </UnorderedList>
      )
    }
  }

  if (descriptionDataType === "quote" && content.data?.text) {
    return (
      <>
        <Heading size="md" dangerouslySetInnerHTML={{ __html: content.data.text }} />
        {content.data.caption && (
          <Text dangerouslySetInnerHTML={{ __html: content.data.caption }} />
        )}
      </>
    )
  }

  if (descriptionDataType === "checklist" && content.data?.items) {
    return (
      <List>
        {content.data?.items.map(({ text, checked }, index) => (
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

  if (descriptionDataType === "table" && content.data?.content) {
    return (
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              {content.data?.content[0]?.map((el, idx) => {
                return <Th key={`${idx}-${el}}`} dangerouslySetInnerHTML={{ __html: el ?? "" }} />
              })}
            </Tr>
          </Thead>
          <Tbody>
            {content.data?.content
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

  if (descriptionDataType === "warning" && content.data?.title) {
    return (
      <>
        <Heading size="md" dangerouslySetInnerHTML={{ __html: content.data.title }} />
        {content.data.message && (
          <Text dangerouslySetInnerHTML={{ __html: content.data.message }} />
        )}
      </>
    )
  }

  return <></>
}
