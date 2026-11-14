"use client"

import { useState } from "react"
import { ClipboardCopy, ClipboardPaste, X } from "lucide-react"
import { twMerge } from "tailwind-merge"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBuilder } from "@/context/builder-context"
import { TAILWIND_CLASSES } from "@/data/tailwind-classes"
import { useToast } from "@/hooks/use-toast"
import { ELEMENT_REGISTRY } from "@/elements"
import { EDITABLE_PROP_REGISTRY, EditablePropName } from "@/editable-props"

// New classes replace conflicting existing ones (e.g. text-3xl replaces text-base) instead of both being applied
const mergeClasses = (existing: string[], added: string[]) =>
  Array.from(
    new Set(twMerge(existing.join(" "), added.join(" ")).split(" ")),
  ).filter(Boolean)

export function PropertiesSidebar() {
  const { elements, selectedElementId, updateElement, findElementById } =
    useBuilder()
  const { toast } = useToast()
  const [classInput, setClassInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [newOption, setNewOption] = useState("")

  const selectedElement = selectedElementId
    ? findElementById(elements, selectedElementId)
    : null

  const handleClassInputChange = (value: string) => {
    setClassInput(value)
    if (value.trim()) {
      const classes = value.split(/\s+/)
      const lastClass = classes[classes.length - 1]
      const filtered = TAILWIND_CLASSES.filter((cls) =>
        cls.toLowerCase().includes(lastClass.toLowerCase()),
      ).slice(0, 10)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const addClassToElement = (classNames: string) => {
    if (selectedElement && classNames.trim()) {
      updateElement(selectedElement.id, {
        classes: mergeClasses(
          selectedElement.classes,
          classNames.split(" ").map((cls) => cls.trim()),
        ),
      })
      setClassInput("")
      setSuggestions([])
    }
  }

  const removeClassFromElement = (className: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        classes: selectedElement.classes.filter((cls) => cls !== className),
      })
    }
  }

  const handleElementTypeChange = (newTag: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { tag: newTag })
    }
  }

  const handleCopyClasses = async () => {
    if (selectedElement && selectedElement.classes.length > 0) {
      try {
        await navigator.clipboard.writeText(selectedElement.classes.join(" "))
        toast({
          title: "Classes Copied",
          description: "CSS classes have been copied to clipboard.",
        })
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy classes to clipboard.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePasteClasses = async () => {
    if (selectedElement) {
      try {
        const text = await navigator.clipboard.readText()
        console.log("Pasted text:", text)
        if (text.trim()) {
          const newClasses = text.trim().split(/\s+/).filter(Boolean)
          updateElement(selectedElement.id, {
            classes: mergeClasses(selectedElement.classes, newClasses),
          })
          toast({
            title: "Classes Pasted",
            description: `Added ${newClasses.length} classes from clipboard.`,
          })
        }
      } catch (error) {
        toast({
          title: "Paste Failed",
          description: "Failed to read from clipboard or no text found.",
          variant: "destructive",
        })
      }
    }
  }

  const handleClearAllClasses = () => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        classes: [],
      })
      toast({
        title: "Classes Cleared",
        description: "All CSS classes have been removed.",
      })
    }
  }

  return (
    <Sidebar side="right" width="80">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Properties</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4 p-4">
            {
              <>
                {!selectedElement && (
                  <div className="text-sm text-muted-foreground">
                    Select an element to edit its properties
                  </div>
                )}

                {/* Element Type */}
                {selectedElement && (
                  <div className="space-y-2">
                    <Label htmlFor="element-type">Element Type</Label>
                    <Select
                      value={selectedElement.tag}
                      onValueChange={handleElementTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          ELEMENT_REGISTRY[selectedElement.type].validTags || []
                        ).map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* https://rootedleb.com/wp-content/uploads/2025/06/clipart-pattern-scaled.png */}

                {/* {ELEMENT_REGISTRY[selectedElement.type].editableProps.map(
                  (prop) => {
                    const editableProp = EDITABLE_PROP_REGISTRY[prop]
                    // if (!EditableComponent) {
                    //   return (
                    //     <div key={prop.property} className="space-y-2">
                    //       <Label>{prop.label}</Label>
                    //       <div className="text-sm text-muted-foreground">
                    //         {EDITABLE_PROP_REGISTRY.NON_EDITABLE_PROP}
                    //       </div>
                    //     </div>
                    //   )
                    // }
                    if (selectedElement.hasOwnProperty(editableProp.property)) {
                      return (
                        <div className="space-y-2">
                          {editableProp.render(
                            selectedElement,
                            (updates: any) =>
                              updateElement(selectedElement.id, updates),
                          )}
                        </div>
                      )
                    } else {
                      return (
                        <div className="space-y-2">
                          <Label>{editableProp.label}</Label>
                          <div className="text-sm text-muted-foreground">
                            {NON_EDITABLE_PROP}
                          </div>
                        </div>
                      )
                    }
                  },
                )} */}

                {Object.entries(EDITABLE_PROP_REGISTRY).map(
                  ([propName, prop]) => {
                    if (
                      propName === "content" &&
                      selectedElement?.type === "list" &&
                      selectedElement.tag !== "li"
                    ) {
                      // Skip content prop for list elements that are not <li>
                      return null
                    }
                    return (
                      <div
                        key={propName}
                        className={`space-y-2 ${
                          // && selectedElement.hasOwnProperty(prop.property)
                          selectedElement &&
                          ELEMENT_REGISTRY[
                            selectedElement.type
                          ].editableProps.includes(propName as EditablePropName)
                            ? ""
                            : "hidden"
                        }`}
                      >
                        {prop.render(selectedElement, (updates: any) =>
                          updateElement(selectedElement!.id, updates),
                        )}
                      </div>
                    )
                  },
                )}

                {/* CSS Classes */}
                {selectedElement && (
                  <div className="space-y-2">
                    <Label htmlFor="css-classes">CSS Classes</Label>
                    <div className="relative">
                      <Input
                        id="css-classes"
                        value={classInput}
                        onChange={(e) => handleClassInputChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addClassToElement(classInput)
                          }
                        }}
                        placeholder="Type Tailwind classes..."
                      />
                      {suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                          {suggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                              onClick={() => addClassToElement(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Applied Classes */}
                {selectedElement && (
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      Applied Classes{" "}
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={handleCopyClasses}
                          disabled={selectedElement.classes.length === 0}
                        >
                          <ClipboardCopy className="h-3 w-3" />
                          <span className="text-xs">Copy</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={handlePasteClasses}
                        >
                          <ClipboardPaste className="h-3 w-3" />
                          <span className="text-xs">Paste</span>
                        </Button>
                      </div>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedElement.classes.length > 0 &&
                        selectedElement.classes.map((className) => (
                          <div
                            key={className}
                            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                          >
                            <span>{className}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                              onClick={() => removeClassFromElement(className)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      {selectedElement.classes.length === 0 && (
                        <span className="text-sm text-muted-foreground">
                          No classes added. Style this element by typing
                          Tailwind classes above.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            }
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
