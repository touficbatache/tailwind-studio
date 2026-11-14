import { ImageIcon } from "lucide-react"

import { ElementData, ElementDefinition } from "@/elements/types"

export interface ImageElementData extends ElementData {
  src: string
}

export const ImageElementDef: ElementDefinition<ImageElementData> = {
  icon: ImageIcon,
  name: "Image",
  create: () => ({
    id: crypto.randomUUID(),
    type: "image",
    tag: "img",
    classes: ["w-32", "h-32", "object-cover"],
    src: "/placeholder.svg?height=128&width=128",
  }),
  editableProps: ["src"],
  validTags: ["img"],
  renderElement: (
    data: ImageElementData,
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
      <img
        key={data.id}
        {...commonProps}
        src={data.src || "/placeholder.svg?height=128&width=128"}
        alt=""
      />
    )
  },
  parse: (node: HTMLElement) => ({
    src: node.getAttribute("src") || "",
  }),
  export: (data: ImageElementData) => {
    const classAttr = data.classes?.length
      ? ` class="${data.classes.join(" ")}"`
      : ""

    const srcAttr = data.src ? ` src="${data.src}"` : ""

    return `<${data.tag}${classAttr}${srcAttr} />`
  },
}
