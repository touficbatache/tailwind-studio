import { EditableProp, ElementData } from "@/elements/types"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function createBackgroundImageProp<
  T extends ElementData & { backgroundImage?: string },
>(): EditableProp<T> {
  return {
    property: "backgroundImage",
    label: "Background Image",
    render: (element, update) => {
      return (
        <>
          <Label htmlFor="background-image-url">Background Image URL</Label>
          <Input
            id="background-image-url"
            value={element?.backgroundImage || ""}
            onChange={(e) =>
              update({ backgroundImage: e.target.value } as Partial<T>)
            }
            placeholder="Enter background image URL"
          />
        </>
      )
    },
  }
}
