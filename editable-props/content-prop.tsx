import { EditableProp, ElementData } from "@/elements/types"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function createContentProp<
  T extends ElementData & { content?: string },
>(): EditableProp<T> {
  return {
    property: "content",
    label: "Content",
    render: (element, update) => {
      return (
        <>
          <Label htmlFor="content">Content</Label>
          <Input
            id="content"
            value={element?.content || ""}
            onChange={(e) => update({ content: e.target.value } as Partial<T>)}
            placeholder="Enter content"
          />
        </>
      )
    },
  }
}
