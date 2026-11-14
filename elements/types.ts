import { LucideIcon } from "lucide-react"
import { EditablePropName } from "@/editable-props"

export interface ElementData {
  id: string
  type: string // Type of the element, e.g., "button", "image", "link"
  tag: string
  classes: string[]
  parentId?: string
  children?: ElementData[] // Only set on element types that can hold other elements (container, list, button)
}

export interface EditableProp<T extends ElementData> {
  property: keyof T
  label: string
  render: (
    element: T | undefined,
    update: (updates: Partial<T>) => void,
  ) => React.ReactNode
}

export const NON_EDITABLE_PROP = "This property is not editable"

export interface ElementDefinition<T extends ElementData> {
  icon: LucideIcon
  name: string
  create: () => T
  editableProps: EditablePropName[] // Editable properties specific to this element type, excluding ElementData properties, which are common to all elements
  validTags: string[]
  renderElement: (
    data: T,
    selectedElementId: string | null,
    onClick: (e: React.MouseEvent, elementId: string) => void,
  ) => React.ReactNode
  parse: (node: any) => Partial<Omit<T, keyof ElementData>> // ElementData properties are parsed separately, as they are common to all elements. same for the children property.
  export: (data: T, extras?: any) => string
}
