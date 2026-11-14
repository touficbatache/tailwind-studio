"use client"

import React, { use, useEffect, useState, useRef } from "react"

import { useBuilder } from "../context/builder-context"
import { ELEMENT_REGISTRY } from "@/elements"
import { el } from "date-fns/locale"

export function Canvas() {
  const { elements, selectedElementId, setSelectedElementId } = useBuilder()

  const canvasContainer = useRef<HTMLDivElement>(null)

  // const canvasHeight = useMemo(() => {
  //   console.log("Calculating canvas height...")
  //   const container = canvasContainer.current
  //   if (!container) {
  //     console.warn("Canvas container not found")
  //     return 112
  //   }

  //   console.log("Dimensions:", {
  //     container: container,
  //     top: container.getBoundingClientRect().top,
  //     height: container.clientHeight,
  //     windowHeight: window.innerHeight,
  //   })

  //   setTimeout(() => {
  //     console.log("Canvas height recalculated:", {
  //       container: container,
  //       top: container.getBoundingClientRect().top,
  //       height: container.clientHeight,
  //       windowHeight: window.innerHeight,
  //     })
  //   }, 1000)

  //   return Math.max(
  //     window.innerHeight -
  //       (container.getBoundingClientRect().top + container.clientHeight) -
  //       1,
  //     112,
  //   )
  // }, [canvasContainer, elements])

  const [canvasHeight, setCanvasHeight] = useState(112)

  useEffect(() => {
    const container = canvasContainer.current
    if (!container) return

    // console.log("Calculating canvas height...", {
    //   container: container,
    //   top: container.getBoundingClientRect().top,
    //   height: container.clientHeight,
    //   windowHeight: window.innerHeight,
    // })
    setCanvasHeight(
      Math.max(
        window.innerHeight -
          (container.getBoundingClientRect().top + container.clientHeight) -
          1,
        112,
      ),
    )
    // console.log("Canvas height updated:", canvasHeight)
  }, [canvasContainer, elements])

  // px-8 pb-32 pt-24

  return (
    // before:content-[''] before:absolute before:left-0 before:top-8 before:right-0 before:h-[1px] before:bg-[#c9e6ff]
    <div
      data-canvas
      className="relative flex-1 bg-white pt-16 overflow-auto min-h-screen"
      onClick={() => setSelectedElementId(null)}
    >
      <div className="h-8 flex justify-between border-[#c9e6ff] border-b">
        <div className="w-8 h-8 border-[#c9e6ff] border-r"></div>
        <div className="w-8 h-8 border-[#c9e6ff] border-l"></div>
      </div>
      <div ref={canvasContainer} className="px-[31px]">
        <div className="border-[#c9e6ff] border-x">
          {elements.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <p className="text-lg">Your canvas is empty</p>
              <p className="text-sm">Use the toolbar below to add elements</p>
            </div>
          ) : (
            elements.map((element) =>
              ELEMENT_REGISTRY[element.type].renderElement(
                element,
                selectedElementId,
                (e: React.MouseEvent, elementId) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setSelectedElementId(elementId)
                },
              ),
            )
          )}
        </div>
      </div>
      <div
        className="flex justify-between border-[#c9e6ff] border-t"
        style={{ height: canvasHeight }}
      >
        <div
          className="w-8 border-[#c9e6ff] border-r"
          style={{ height: canvasHeight }}
        ></div>
        <div
          className="w-8 border-[#c9e6ff] border-l"
          style={{ height: canvasHeight }}
        ></div>
      </div>
    </div>
  )
}
