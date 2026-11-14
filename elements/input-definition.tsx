import { TextCursorInput } from "lucide-react"

import { ElementData, ElementDefinition } from "@/elements/types"

export interface InputElementData extends ElementData {
  // type: string
  placeholder: string
}

export const InputElementDef: ElementDefinition<InputElementData> = {
  icon: TextCursorInput,
  name: "Input",
  create: () => ({
    id: crypto.randomUUID(),
    type: "input",
    tag: "input",
    classes: ["px-3", "py-2", "border", "border-gray-300", "rounded"],
    // type: "text",
    placeholder: "Input field",
  }),
  editableProps: ["placeholder"],
  validTags: ["input", "textarea"],
  renderElement: (
    data: InputElementData,
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

    if (data.tag === "input") {
      return (
        <input
          key={data.id}
          {...commonProps}
          placeholder={data.placeholder || "Input field"}
        />
      )
    } else if (data.tag === "textarea") {
      return (
        <textarea
          key={data.id}
          {...commonProps}
          placeholder={data.placeholder || "Textarea"}
        />
      )
    }

    throw new Error(`Unsupported tag: ${data.tag}`)
  },
  parse: (node: HTMLElement) => ({
    // type: node.getAttribute("type") || "text",
    placeholder: node.getAttribute("placeholder") || "",
  }),
  export: (data: InputElementData) => {
    const classAttr = data.classes?.length
      ? ` class="${data.classes.join(" ")}"`
      : ""

    // const typeAttr = data.type ? ` type="${data.type}"` : ""
    const placeholderAttr = data.placeholder
      ? ` placeholder="${data.placeholder}"`
      : ""

    return `<${data.tag}${classAttr}${placeholderAttr} />`
  },
}
