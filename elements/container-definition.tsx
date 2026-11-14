import { Frame } from "lucide-react"

import { ELEMENT_REGISTRY } from "@/elements"
import { ElementData, ElementDefinition } from "@/elements/types"

export interface ContainerElementData extends ElementData {
  children: ElementData[]
  backgroundImage?: string
}

export const ContainerElementDef: ElementDefinition<ContainerElementData> = {
  icon: Frame,
  name: "Container",
  create: () => ({
    id: crypto.randomUUID(),
    type: "container",
    tag: "div",
    classes: ["p-4", "border", "border-gray-200", "rounded", "min-h-25"],
    children: [],
    backgroundImage: "",
  }),
  editableProps: ["backgroundImage"],
  validTags: [
    "div",
    "header",
    "footer",
    "section",
    "article",
    "aside",
    "main",
    "nav",
  ],
  renderElement: (
    data: ContainerElementData,
    selectedElementId: string | null,
    onClick: (e: React.MouseEvent, elementId: string) => void,
  ) => {
    const commonProps: {
      className: string
      style: React.CSSProperties
      onClick: (e: React.MouseEvent) => void
    } = {
      className: data.classes.join(" "),
      style:
        selectedElementId === data.id
          ? { outline: "2px solid #3b82f6", outlineOffset: "2px" }
          : {},
      onClick: (e: React.MouseEvent) => {
        onClick(e, data.id)
      },
    }

    if (data.backgroundImage) {
      commonProps.style = {
        ...commonProps.style,
        backgroundImage: `url('${data.backgroundImage}')`,
      }
    }

    const Tag = data.tag as React.ElementType

    return (
      <Tag key={data.id} {...commonProps}>
        {data.children.map((child) =>
          ELEMENT_REGISTRY[child.type].renderElement(
            child,
            selectedElementId,
            onClick,
          ),
        )}
      </Tag>
    )
  },
  parse: (node: HTMLElement) => ({
    backgroundImage: node.style.backgroundImage.slice(5, -2) || "",
  }),
  export: (data: ContainerElementData, extras: { childrenHTML: string }) => {
    const classAttr = data.classes?.length
      ? ` class="${data.classes.join(" ")}"`
      : ""

    const styleAttr = data.backgroundImage
      ? ` style="background-image: url('${data.backgroundImage}');"`
      : ""

    const childrenHTML = data.children.map((child) =>
      ELEMENT_REGISTRY[child.type].export(child),
    )

    return `<${data.tag}${classAttr}${styleAttr}>${childrenHTML.join("")}</${
      data.tag
    }>`

    // return `<${data.tag}${classAttr}${styleAttr}>${
    //   (childrenHTML.length > 0 ? "\n" : "") +
    //   childrenHTML.map((element) => `\t${element}`).join("\n") +
    //   (childrenHTML.length > 0 ? "\n" : "")
    // }</${data.tag}>`
  },
}
