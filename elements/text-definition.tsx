import { Type } from "lucide-react"

import { ElementData, ElementDefinition } from "@/elements/types"

export interface TextElementData extends ElementData {
  content: string
}

export const TextElementDef: ElementDefinition<TextElementData> = {
  icon: Type,
  name: "Text",
  create: () => ({
    id: crypto.randomUUID(),
    type: "text",
    tag: "span",
    classes: ["text-base"],
    content: "Text",
  }),
  editableProps: ["content"],
  validTags: ["span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "label"],
  renderElement: (
    data: TextElementData,
    selectedElementId: string | null,
    onClick: (e: React.MouseEvent, elementId: string) => void,
  ) => {
    const commonProps = {
      className: data.classes.join(" "),
      style:
        selectedElementId === data.id
          ? {
              outline: "2px solid #3b82f6",
              outlineOffset: "2px",
            }
          : {},
      onClick: (e: React.MouseEvent) => {
        onClick(e, data.id)
      },
    }

    switch (data.tag) {
      case "h1":
        return (
          <h1 key={data.id} {...commonProps}>
            {data.content || "Heading 1"}
          </h1>
        )

      case "h2":
        return (
          <h2 key={data.id} {...commonProps}>
            {data.content || "Heading 2"}
          </h2>
        )

      case "h3":
        return (
          <h3 key={data.id} {...commonProps}>
            {data.content || "Heading 3"}
          </h3>
        )

      case "h4":
        return (
          <h4 key={data.id} {...commonProps}>
            {data.content || "Heading 4"}
          </h4>
        )

      case "h5":
        return (
          <h5 key={data.id} {...commonProps}>
            {data.content || "Heading 5"}
          </h5>
        )

      case "h6":
        return (
          <h6 key={data.id} {...commonProps}>
            {data.content || "Heading 6"}
          </h6>
        )

      case "p":
        return (
          <p key={data.id} {...commonProps}>
            {data.content || "Paragraph"}
          </p>
        )

      case "span":
        return (
          <span key={data.id} {...commonProps}>
            {data.content || "Text"}
          </span>
        )

      case "label":
        return (
          <label key={data.id} {...commonProps}>
            {data.content || "Label"}
          </label>
        )
    }

    throw new Error(`Unsupported tag: ${data.tag}`)
  },
  parse: (node: HTMLElement) => ({
    content: node.textContent?.trim() ?? "Text",
  }),
  export: (data: TextElementData) => {
    const classAttr = data.classes?.length
      ? ` class="${data.classes.join(" ")}"`
      : ""

    return `<${data.tag}${classAttr}>${data.content}</${data.tag}>`
  },
}
