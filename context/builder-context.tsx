"use client"

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from "react"
import { html_beautify } from "js-beautify"

import type { ElementData } from "@/elements/types"
import { ELEMENT_REGISTRY } from "@/elements"

interface BuilderContextProps {
  elements: ElementData[]
  selectedElementId: string | null
  addElement: (element: Omit<ElementData, "id" | "parentId">) => void
  updateElement: (id: string, updates: Partial<ElementData>) => void
  deleteElement: (id: string) => void
  deleteAllElements: () => void
  setSelectedElementId: (id: string | null) => void
  findElementById: (elements: ElementData[], id: string) => ElementData | null
  moveElement: (
    id: string,
    newParentId: string | null,
    newIndex?: number,
  ) => void
  moveElementRelative: (
    id: string,
    newParentId: string | null,
    targetId: string,
    targetPosition: "before" | "after",
  ) => void
  generateHTML: () => string
  importFromHTML: (html: string) => void
  exportData: () => string
  importData: (data: string) => void
}

const BuilderContext = createContext<BuilderContextProps | undefined>(undefined)

interface BuilderProviderProps {
  children: ReactNode
}

export const BuilderProvider = ({ children }: BuilderProviderProps) => {
  const [elements, setElements] = useState<ElementData[]>([])
  const [hasRestored, setHasRestored] = useState(false)
  useEffect(() => {
    // Restore after mount, not in the initial state, so the first client render matches the server (no hydration mismatch)
    const raw = sessionStorage.getItem("builder.elements")
    if (raw) {
      try {
        setElements(JSON.parse(raw) as ElementData[])
      } catch (err) {
        console.warn("Failed to parse elements from sessionStorage:", err)
      }
    }
    setHasRestored(true)
  }, [])
  useEffect(() => {
    // Write every update to sessionStorage, once the saved state has been restored
    if (!hasRestored) return
    sessionStorage.setItem("builder.elements", JSON.stringify(elements))
    console.log("Elements updated in sessionStorage:", elements)
  }, [elements, hasRestored])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  )

  const addElement = (elementData: Omit<ElementData, "id" | "parentId">) => {
    const newElement: ElementData = {
      id: crypto.randomUUID(),
      ...elementData,
      parentId: undefined,
    }
    setElements((prevElements) => [...prevElements, newElement])
  }

  const updateElement = (id: string, updates: Partial<ElementData>) => {
    const updateRecursive = (elements: ElementData[]): ElementData[] => {
      return elements.map((element) => {
        if (element.id === id) {
          return { ...element, ...updates }
        }
        return {
          ...element,
          children: updateRecursive(element.children ?? []),
        }
      })
    }

    setElements((prevElements) => updateRecursive(prevElements))
  }

  const deleteElement = (id: string) => {
    setElements((prevElements) => {
      const elementToDelete = findElementById(prevElements, id)
      if (!elementToDelete) return prevElements

      const updatedElements = prevElements.filter(
        (element) => element.id !== id,
      )

      // Function to recursively update children
      const updateChildren = (elements: ElementData[]): ElementData[] => {
        return elements.map((element) => ({
          ...element,
          children: updateChildren(element.children ?? []).filter(
            (child) => child.id !== id,
          ),
        }))
      }

      return updateChildren(updatedElements)
    })
    setSelectedElementId(null)
  }

  const deleteAllElements = () => {
    setElements([])
    setSelectedElementId(null)
  }

  const findElementById = useCallback(
    (elements: ElementData[], id: string): ElementData | null => {
      for (const element of elements) {
        if (element.id === id) {
          return element
        }
        const found = findElementById(element.children ?? [], id)
        if (found) return found
      }
      return null
    },
    [],
  )

  const moveElement = (
    id: string,
    newParentId: string | null,
    newIndex?: number,
  ) => {
    setElements((prevElements) => {
      const elementToMove = findElementById(prevElements, id)
      if (!elementToMove) return prevElements

      // Remove element from the entire tree
      const removeElement = (elements: ElementData[]): ElementData[] => {
        return elements
          .filter((e) => e.id !== id)
          .map((e) => ({
            ...e,
            children: removeElement(e.children ?? []),
          }))
      }

      let updatedElements = removeElement(prevElements)

      // Update parentId
      elementToMove.parentId = newParentId || undefined

      // Recursively insert element into the correct parent
      const insertElement = (elements: ElementData[]): ElementData[] => {
        return elements.map((e) => {
          if (e.id === newParentId) {
            const children = [...(e.children ?? [])]
            if (newIndex !== undefined) {
              children.splice(newIndex, 0, elementToMove)
            } else {
              children.push(elementToMove)
            }
            return { ...e, children }
          }
          return { ...e, children: insertElement(e.children ?? []) }
        })
      }

      if (newParentId) {
        updatedElements = insertElement(updatedElements)
      } else {
        if (newIndex !== undefined) {
          updatedElements.splice(newIndex, 0, elementToMove)
        } else {
          updatedElements.push(elementToMove)
        }
      }

      return updatedElements
    })
  }

  const moveElementRelative = (
    id: string,
    newParentId: string | null,
    targetId: string,
    targetPosition: "before" | "after",
  ) => {
    setElements((prevElements) => {
      const elementToMove = findElementById(prevElements, id)
      if (!elementToMove) return prevElements

      // Remove element from the entire tree
      const removeElement = (elements: ElementData[]): ElementData[] => {
        return elements
          .filter((e) => e.id !== id)
          .map((e) => ({
            ...e,
            children: removeElement(e.children ?? []),
          }))
      }

      let updatedElements = removeElement(prevElements)

      const parentElement = newParentId
        ? findElementById(updatedElements, newParentId)
        : null
      const siblings = parentElement
        ? parentElement.children ?? []
        : updatedElements
      const targetIndex = siblings.findIndex((el) => el.id === targetId)

      if (targetIndex === -1) {
        console.warn(`Target element with id ${targetId} not found`)
        return updatedElements
      }

      const newIndex =
        targetPosition === "before" ? targetIndex : targetIndex + 1

      // Update parentId
      elementToMove.parentId = newParentId || undefined

      console.log("Dropping", targetPosition, "at index", newIndex)

      // Recursively insert element into the correct parent
      const insertElement = (elements: ElementData[]): ElementData[] => {
        return elements.map((e) => {
          if (e.id === newParentId) {
            const children = [...(e.children ?? [])]
            if (newIndex !== undefined) {
              children.splice(newIndex, 0, elementToMove)
            } else {
              children.push(elementToMove)
            }
            return { ...e, children }
          }
          return { ...e, children: insertElement(e.children ?? []) }
        })
      }

      if (newParentId) {
        updatedElements = insertElement(updatedElements)
      } else {
        if (newIndex !== undefined) {
          updatedElements.splice(newIndex, 0, elementToMove)
        } else {
          updatedElements.push(elementToMove)
        }
      }

      return updatedElements
    })
  }

  const generateHTML = () => {
    const html = elements
      .map((element) => ELEMENT_REGISTRY[element.type].export(element))
      .join("")

    const beautifiedHTML = html_beautify(html, {
      wrap_line_length: 100,
      inline: [], // disables inline behavior even more aggressively
    })

    return beautifiedHTML
  }

  const exportData = () => {
    return JSON.stringify(elements, null, 2)
  }

  const importData = (data: string) => {
    try {
      const parsedElements = JSON.parse(data) as ElementData[]
      setElements(parsedElements)
      setSelectedElementId(null)
    } catch (error) {
      console.error("Failed to import data:", error)
      throw new Error("Invalid data format")
    }
  }

  const importFromHTML = (html: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    const parseNode = (
      node: Element,
      parentId?: string,
    ): ElementData | null => {
      console.log(`Parsing node: ${node.tagName}, parentId: ${parentId}`)
      const tag = node.tagName.toLowerCase()
      const type = Object.entries(ELEMENT_REGISTRY).find(([type, def]) =>
        def.validTags.includes(tag),
      )?.[0]

      if (!type) {
        console.warn(`No element type found for tag: ${tag}`)
        return null
      }

      const def = ELEMENT_REGISTRY[type]
      const parsed = def.parse(node)

      const id = crypto.randomUUID()

      const classes = node.className.split(" ")

      const children = Array.from(node.children)
        .map((child) => parseNode(child, id))
        .filter(Boolean) as ElementData[]

      const element: ElementData = {
        ...def.create(),
        id,
        type,
        tag,
        classes,
        children,
        parentId,
        ...parsed,
      }

      return element
    }

    const newElements = Array.from(doc.body.children)
      .map((node) => parseNode(node))
      .filter(Boolean) as ElementData[]

    setElements(newElements)
  }

  const value = useMemo(
    () => ({
      elements,
      selectedElementId,
      addElement,
      updateElement,
      deleteElement,
      deleteAllElements,
      setSelectedElementId,
      findElementById,
      moveElement,
      moveElementRelative,
      generateHTML,
      importFromHTML,
      exportData,
      importData,
    }),
    [elements, selectedElementId],
  )

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  )
}

export const useBuilder = () => {
  const context = useContext(BuilderContext)
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider")
  }
  return context
}
