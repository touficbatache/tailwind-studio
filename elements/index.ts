import { ElementDefinition } from "@/elements/types"
import { ButtonElementDef } from "@/elements/button-definition"
import { ContainerElementDef } from "@/elements/container-definition"
import { ImageElementDef } from "@/elements/image-definition"
import { InputElementDef } from "@/elements/input-definition"
import { LinkElementDef } from "@/elements/link-definition"
import { ListElementDef } from "@/elements/list-definition"
import { SelectElementDef } from "@/elements/select-definition"
import { TextElementDef } from "@/elements/text-definition"

export const ELEMENT_REGISTRY: Record<string, ElementDefinition<any>> = {
  container: ContainerElementDef,
  text: TextElementDef,
  button: ButtonElementDef,
  image: ImageElementDef,
  link: LinkElementDef,
  list: ListElementDef,
  input: InputElementDef,
  select: SelectElementDef,
}
