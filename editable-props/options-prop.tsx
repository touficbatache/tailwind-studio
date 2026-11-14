import { useState } from "react"
import { X } from "lucide-react"

import { EditableProp, ElementData, NON_EDITABLE_PROP } from "@/elements/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function createOptionsProp<
  T extends ElementData & { options: string[] },
>(): EditableProp<T> {
  return {
    property: "options",
    label: "Options",
    render: (element, update) => {
      const [newOption, setNewOption] = useState("")

      const handleAddOption = () => {
        if (newOption.trim()) {
          const currentOptions = element!.options || []
          if (!currentOptions.includes(newOption.trim())) {
            update({
              options: [...currentOptions, newOption.trim()],
            } as Partial<T>)
          }
          setNewOption("")
        }
      }

      const handleRemoveOption = (optionToRemove: string) => {
        const currentOptions = element!.options || []
        if (currentOptions.includes(optionToRemove)) {
          update({
            options: currentOptions.filter((o) => o !== optionToRemove),
          } as Partial<T>)
        }
      }

      if (!element) {
        return <div></div>
      }

      return (
        <>
          <Label>Select Options</Label>

          {/* Add new option */}
          <div className="flex gap-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Enter option text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddOption()
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddOption}
              disabled={!newOption.trim()}
            >
              Add
            </Button>
          </div>

          {/* Display existing options */}
          {element.options && element.options.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Current Options
              </Label>
              <div className="space-y-1">
                {element.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                  >
                    <span>{option}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => handleRemoveOption(option)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )
    },
  }
}
