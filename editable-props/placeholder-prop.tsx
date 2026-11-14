import { EditableProp, ElementData } from "@/elements/types"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function createPlaceholderProp<
  T extends ElementData & { placeholder: string },
>(): EditableProp<T> {
  return {
    property: "placeholder",
    label: "Placeholder",
    render: (element, update) => {
      return (
        <>
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={element?.placeholder || ""}
            onChange={(e) =>
              update({ placeholder: e.target.value } as Partial<T>)
            }
            placeholder="Enter image URL"
          />
        </>
      )
    },
  }
}
