import { SquareMousePointer } from "lucide-react"

import { ELEMENT_REGISTRY } from "@/elements"
import { ElementData, ElementDefinition } from "@/elements/types"

export interface ButtonElementData extends ElementData {
  children: ElementData[]
}

export const ButtonElementDef: ElementDefinition<ButtonElementData> = {
  icon: SquareMousePointer,
  name: "Button",
  create: () => ({
    id: crypto.randomUUID(),
    type: "button",
    tag: "button",
    classes: ["px-4", "py-2", "bg-blue-500", "text-white", "rounded"],
    children: [
      {
        id: crypto.randomUUID(),
        type: "text",
        tag: "span",
        classes: ["text-base"],
        content: "Button",
      },
    ],
  }),
  editableProps: [],
  validTags: ["button"], // forms support: "input[type=button]", "input[type=submit]"
  renderElement: (
    data: ButtonElementData,
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
      <button key={data.id} {...commonProps}>
        {data.children.map((child) =>
          ELEMENT_REGISTRY[child.type].renderElement(
            child,
            selectedElementId,
            onClick,
          ),
        )}
      </button>
    )
  },
  // Element children are parsed generically; a bare text label (<button>Hi</button>) has none, so wrap it in a text child
  parse: (node: HTMLElement) =>
    node.children.length === 0
      ? {
          children: [
            {
              ...ELEMENT_REGISTRY.text.create(),
              content: node.textContent?.trim() || "Button",
            },
          ],
        }
      : {},
  export: (data: ButtonElementData) => {
    const classAttr = data.classes?.length
      ? ` class="${data.classes.join(" ")}"`
      : ""

    const childrenHTML = data.children.map((child) =>
      ELEMENT_REGISTRY[child.type].export(child),
    )

    return `<${data.tag}${classAttr}>${childrenHTML.join("")}</${data.tag}>`
  },
}
