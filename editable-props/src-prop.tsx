import { EditableProp, ElementData } from "@/elements/types"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function createSrcProp<
  T extends ElementData & { src: string },
>(): EditableProp<T> {
  return {
    property: "src",
    label: "Image Source",
    render: (element, update) => {
      return (
        <>
          <Label htmlFor="src">Image Source</Label>
          <Input
            id="src"
            value={element?.src || ""}
            onChange={(e) => update({ src: e.target.value } as Partial<T>)}
            placeholder="Enter image URL"
          />
        </>
      )
    },
  }
}
