import { List } from "lucide-react"

import { ELEMENT_REGISTRY } from "@/elements"
import { ElementData, ElementDefinition } from "@/elements/types"

export interface ListElementData extends ElementData {
  children: ListElementData[]
  content?: string
}

export const ListElementDef: ElementDefinition<ListElementData> = {
  icon: List,
  name: "List",
  create: () => ({
    id: crypto.randomUUID(),
    type: "list",
    tag: "ul",
    classes: ["list-disc", "pl-6"],
    children: [
      // {
      //   id: crypto.randomUUID(),
      //   type: "list",
      //   tag: "li",
      //   classes: [],
      //   content: "List item 1",
      //   children: [],
      // },
      // {
      //   id: crypto.randomUUID(),
      //   type: "list",
      //   tag: "li",
      //   classes: [],
      //   content: "List item 2",
      //   children: [],
      // },
    ],
  }),
  editableProps: ["content"],
  validTags: ["ul", "ol", "li"],
  renderElement: (
    data: ListElementData,
    selectedElementId: string | null,
    onClick: (e: React.MouseEvent, elementId: string) => void,
  ) => {
    const commonProps = {
      className: data.classes.join(" "),
      style:
        selectedElementId === data.id
          ? { outline: "2px solid #3b82f6", outlineOffset: "2px" }
          : {},
      onClick: (e: React.MouseEvent) => {
        onClick(e, data.id)
      },
    }

    switch (data.tag) {
      case "ul":
        return (
          <ul key={data.id} {...commonProps}>
            {data.children.map((child) =>
              ELEMENT_REGISTRY[child.type].renderElement(
                child,
                selectedElementId,
                onClick, // TODO: this will create an issue because parent will be selected when clicking on child
              ),
            )}
          </ul>
        )

      case "ol":
        return (
          <ol key={data.id} {...commonProps}>
            {data.children.map((child) =>
              ELEMENT_REGISTRY[child.type].renderElement(
                child,
                selectedElementId,
                onClick, // TODO: this will create an issue because parent will be selected when clicking on child
              ),
            )}
          </ol>
        )

      case "li":
        return (
          <li key={data.id} {...commonProps}>
            {data.content || "List item"}
          </li>
        )
    }

    throw new Error(`Unsupported tag: ${data.tag}`)
  },
  parse: (node: HTMLElement) => ({
    content:
      node.tagName.toLowerCase() === "li"
        ? node.textContent?.trim()
        : undefined,
  }),
  export: (data: ListElementData) => {
    const classAttr = data.classes?.length
      ? ` class="${data.classes.join(" ")}"`
      : ""

    const items = data.children
      .map((child) => `<li>${child.content ?? ""}</li>`)
      .join("")

    return `<${data.tag}${classAttr}>${items}</${data.tag}>`
  },
}
