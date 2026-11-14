import { EditableProp } from "@/elements/types"
import { createBackgroundImageProp } from "@/editable-props/background-image-prop"
import { createContentProp } from "@/editable-props/content-prop"
import { createHrefProp } from "@/editable-props/href-prop"
import { createOptionsProp } from "@/editable-props/options-prop"
import { createPlaceholderProp } from "@/editable-props/placeholder-prop"
import { createSrcProp } from "@/editable-props/src-prop"

export const EDITABLE_PROP_NAMES = [
  "backgroundImage",
  "content",
  "href",
  "options",
  "placeholder",
  "src",
] as const

export type EditablePropName = (typeof EDITABLE_PROP_NAMES)[number]

export const EDITABLE_PROP_REGISTRY: Record<
  EditablePropName,
  EditableProp<any>
> = {
  backgroundImage: createBackgroundImageProp(),
  content: createContentProp(),
  href: createHrefProp(),
  options: createOptionsProp(),
  placeholder: createPlaceholderProp(),
  src: createSrcProp(),
}
