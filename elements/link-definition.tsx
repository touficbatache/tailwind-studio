import { Link } from "lucide-react"

import { ElementData, ElementDefinition } from "@/elements/types"

export interface LinkElementData extends ElementData {
  content: string
  href: string
}

export const LinkElementDef: ElementDefinition<LinkElementData> = {
  icon: Link,
  name: "Link",
  create: () => ({
    id: crypto.randomUUID(),
    type: "link",
    tag: "a",
    classes: ["text-blue-500", "underline"],
    content: "Link text",
    href: "#",
  }),
  editableProps: ["content", "href"],
  validTags: ["a"],
  renderElement: (
    data: LinkElementData,
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

    return (
      <a key={data.id} {...commonProps} href={data.href || "#"}>
        {data.content || "Link text"}
      </a>
    )
  },
  parse: (node: HTMLElement) => ({
    content: node.textContent?.trim() ?? "",
    href: node.getAttribute("href") || "",
  }),
  export: (data: LinkElementData) => {
    const classAttr = data.classes?.length
      ? ` class="${data.classes.join(" ")}"`
      : ""

    const hrefAttr = data.href ? ` href="${data.href}"` : ""

    return `<${data.tag}${classAttr}${hrefAttr}>${data.content}</${data.tag}>`
  },
}
