import { ELEMENT_REGISTRY } from "../elements"
import { useBuilder } from "../context/builder-context"
import { Button } from "@/components/ui/button"

export function FloatingToolbar() {
  const { addElement } = useBuilder()

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="grid grid-cols-8 gap-2 bg-background border border-border rounded-lg shadow-lg p-2">
        {Object.values(ELEMENT_REGISTRY).map((def) => (
          <Button
            key={def.name}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-1"
            onClick={() => addElement(def.create())}
          >
            <def.icon className="h-4 w-4 text-neutral-600" />
            <span className="text-xs">{def.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
