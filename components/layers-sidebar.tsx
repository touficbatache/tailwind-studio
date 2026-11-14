"use client"

import type React from "react"

import { ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useBuilder } from "../context/builder-context"
import { ELEMENT_REGISTRY } from "../elements"
import { ElementData } from "@/elements/types"

export function LayersSidebar() {
  const {
    elements,
    selectedElementId,
    setSelectedElementId,
    findElementById,
    deleteElement,
    moveElement,
    moveElementRelative,
  } = useBuilder()
  const [expandedElements, setExpandedElements] = useState<Set<string>>(
    new Set(),
  )
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{
    id: string
    position: "before" | "after" | "inside"
  } | null>(null)

  const toggleExpanded = (id: string) => {
    setExpandedElements((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDraggedElement(elementId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (
    e: React.DragEvent,
    targetId: string,
    position: "before" | "after" | "inside",
  ) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    if (draggedElement && draggedElement !== targetId) {
      setDropTarget({ id: targetId, position })
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drop target if we're leaving the entire sidebar area
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropTarget(null)
    }
  }

  function isDescendant(
    draggedId: string,
    targetId: string,
    elements: ElementData[],
  ): boolean {
    const queue = [...elements]

    while (queue.length) {
      const current = queue.shift()
      if (!current) continue

      if (current.id === targetId) {
        return true
      }

      if (current.children && current.children?.length) {
        queue.push(...current.children)
      }
    }

    return false
  }

  const handleDrop = (
    e: React.DragEvent,
    targetId: string,
    position: "before" | "after" | "inside",
  ) => {
    console.log("handleDrop", e, elements, targetId, position)

    e.preventDefault()

    if (!draggedElement || draggedElement === targetId) {
      setDraggedElement(null)
      setDropTarget(null)
      return
    }

    const targetElement = findElementById(elements, targetId)
    if (!targetElement) return

    if (
      isDescendant(
        draggedElement,
        targetId,
        findElementById(elements, draggedElement)?.children || [],
      )
    ) {
      console.warn("Invalid drop: cannot drop into or near own descendant")
      setDraggedElement(null)
      setDropTarget(null)
      return
    }

    if (position === "inside") {
      // Check if target can contain children (containers)
      if (
        targetElement.type === "container" ||
        targetElement.type === "list" ||
        targetElement.type === "button"
      ) {
        console.log("Dropping inside", targetId)
        moveElement(draggedElement, targetId)
        setExpandedElements((prev) => new Set([...prev, targetId])) // Auto-expand when dropping inside
      }
    } else {
      // Moving before or after - need to find the parent and index
      const parentId = targetElement.parentId || null
      // console.log("Target element: ", targetElement)
      // console.log("Parent ID:", parentId)
      // const parentElement = parentId
      //   ? findElementById(elements, parentId)
      //   : null
      // const siblings = parentElement ? parentElement.children : elements
      // const targetIndex = siblings.findIndex((el) => el.id === targetId)
      // console.log("Target index:", targetIndex)

      // if (targetIndex !== -1) {
      // const newIndex = position === "before" ? targetIndex : targetIndex + 1
      // console.log("Dropping", position, "at index", newIndex)
      moveElementRelative(draggedElement, parentId, targetId, position)
      // }
    }

    setDraggedElement(null)
    setDropTarget(null)
  }

  const canDropInside = (element: ElementData) => {
    return (
      element.type === "container" ||
      element.type === "list" ||
      element.type == "button"
    )
  }

  const renderElement = (element: ElementData, depth = 0) => {
    const hasChildren =
      element.children !== undefined && element.children.length > 0
    const content =
      "content" in element && typeof element.content === "string"
        ? element.content
        : undefined
    const isExpanded = expandedElements.has(element.id)
    const isSelected = selectedElementId === element.id
    const isDragging = draggedElement === element.id
    const isDropTarget = dropTarget?.id === element.id

    // Get the element definition and icon
    const def = ELEMENT_REGISTRY[element.type]
    const Icon = def?.icon

    return (
      <div key={element.id} className="relative">
        {/* Drop zone before element */}
        <div
          className={`h-1 w-full transition-colors ${
            isDropTarget && dropTarget?.position === "before"
              ? "bg-blue-500"
              : "hover:bg-blue-200"
          }`}
          onDragOver={(e) => handleDragOver(e, element.id, "before")}
          onDrop={(e) => handleDrop(e, element.id, "before")}
        />

        <SidebarMenuItem>
          <div
            className={`flex items-center gap-1 w-full group relative ${
              isSelected ? "bg-sidebar-accent rounded-md" : ""
            } ${isDragging ? "opacity-50" : ""} ${
              isDropTarget &&
              dropTarget?.position === "inside" &&
              canDropInside(element)
                ? "bg-blue-100 border-2 border-blue-500 border-dashed"
                : ""
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, element.id)}
            onDragOver={
              canDropInside(element)
                ? (e) => handleDragOver(e, element.id, "inside")
                : (e) => e.preventDefault()
            }
            onDrop={
              canDropInside(element)
                ? (e) => handleDrop(e, element.id, "inside")
                : (e) =>
                    dropTarget?.id && dropTarget?.position
                      ? handleDrop(e, dropTarget?.id, dropTarget?.position)
                      : undefined
            }
            onDragLeave={handleDragLeave}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => hasChildren && toggleExpanded(element.id)}
                style={{ marginLeft: `${depth * 12}px` }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div
                className="h-6 w-6 flex items-center justify-center"
                style={{ marginLeft: `${depth * 12}px` }}
              >
                {Icon && <Icon className="h-4 w-4" />}
              </div>
            )}

            <SidebarMenuButton
              onClick={() => setSelectedElementId(element.id)}
              className="flex-1 justify-start h-6 cursor-move"
            >
              <span className="text-xs">
                {element.tag}
                {content &&
                  ` - ${content.slice(0, 20)}${
                    content.length > 20 ? "..." : ""
                  }`}
              </span>
            </SidebarMenuButton>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                deleteElement(element.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </SidebarMenuItem>

        {hasChildren && isExpanded && (
          <div className="ml-3 border-l border-sidebar-border pl-2">
            {element.children?.map((child) => renderElement(child, depth + 1))}
          </div>
        )}

        {/* Drop zone after element */}
        <div
          className={`h-1 w-full transition-colors ${
            isDropTarget && dropTarget?.position === "after"
              ? "bg-blue-500"
              : "hover:bg-blue-200"
          }`}
          onDragOver={(e) => handleDragOver(e, element.id, "after")}
          onDrop={(e) => handleDrop(e, element.id, "after")}
        />
      </div>
    )
  }

  return (
    <Sidebar
      side="left"
      width="64"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => setDraggedElement(null)}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Layers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {elements.length === 0 ? (
                <div className="text-xs text-muted-foreground p-2">
                  No elements yet. Add some from the toolbar below.
                </div>
              ) : (
                <div onDragLeave={handleDragLeave} className="space-y-0">
                  {elements.map((element) => renderElement(element))}

                  {/* Drop zone at the end for root level */}
                  {/* <div
                    className={`h-2 w-full transition-colors ${
                      dropTarget?.id === "root"
                        ? "bg-blue-500"
                        : "hover:bg-blue-200"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = "move"
                      if (draggedElement) {
                        setDropTarget({ id: "root", position: "after" })
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (draggedElement) {
                        moveElement(draggedElement, null, elements.length)
                        setDraggedElement(null)
                        setDropTarget(null)
                      }
                    }}
                  /> */}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
