import { EditableProp, ElementData } from "@/elements/types"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function createHrefProp<
  T extends ElementData & { href: string },
>(): EditableProp<T> {
  return {
    property: "href",
    label: "Link URL",
    render: (element, update) => {
      return (
        <>
          <Label htmlFor="href">Link URL</Label>
          <Input
            id="href"
            value={element?.href || ""}
            onChange={(e) => update({ href: e.target.value } as Partial<T>)}
            placeholder="Enter link URL"
          />
        </>
      )
    },
  }
}
