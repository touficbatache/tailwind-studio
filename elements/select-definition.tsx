import { StretchHorizontal } from "lucide-react"

import { ElementData, ElementDefinition } from "@/elements/types"

export interface SelectElementData extends ElementData {
  options: string[]
}

export const SelectElementDef: ElementDefinition<SelectElementData> = {
  icon: StretchHorizontal,
  name: "Dropdown",
  create: () => ({
    id: crypto.randomUUID(),
    type: "select",
    tag: "select",
    classes: [
      "px-3",
      "py-2",
      "border",
      "border-gray-300",
      "rounded",
      "bg-white",
    ],
    options: ["Option 1", "Option 2", "Option 3"],
  }),
  editableProps: ["options"],
  validTags: ["select"],
  renderElement: (
    data: SelectElementData,
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
      <select key={data.id} {...commonProps}>
        {data.options && data.options.length > 0 ? (
          data.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))
        ) : (
          <option>{data.options[0] || "Select option"}</option>
        )}
      </select>
    )
  },
  parse: (node: HTMLElement) => ({
    options: Array.from(node.querySelectorAll("option")).map(
      (o) => o.textContent ?? "",
    ),
  }),
  export: (data: SelectElementData) => {
    const classAttr = data.classes?.length
      ? ` class="${data.classes.join(" ")}"`
      : ""

    const options = (data.options ?? [])
      .map((o) => `<option value="${o}">${o}</option>`)
      .join("")

    return `<${data.tag}${classAttr}>${options}</${data.tag}>`
  },
}
