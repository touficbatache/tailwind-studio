"use client"

import { useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BuilderProvider } from "./context/builder-context"
import { LayersSidebar } from "./components/layers-sidebar"
import { PropertiesSidebar } from "./components/properties-sidebar"
import { FloatingToolbar } from "./components/floating-toolbar"
import { Canvas } from "./components/canvas"
import { HtmlOutput } from "./components/html-output"
import { ExportImport } from "./components/export-import"
import { ClearDesign } from "./components/clear-design"

export default function UIBuilder() {
  // Runtime Tailwind compiles canvas classes in the browser; it touches `document`, so it can't load during SSR
  useEffect(() => {
    import("@tailwindcss/browser")
  }, [])

  return (
    <BuilderProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full">
          <LayersSidebar />

          <SidebarInset className="flex-1">
            <header className="absolute inset-x-0 z-1 flex h-16 shrink-0 items-center justify-between gap-4 bg-white border-zinc-200 border-b px-4">
              <h1 className="min-w-0 truncate text-xl font-semibold">
                Tailwind Studio - UI Builder
              </h1>
              <div className="flex shrink-0 gap-2">
                <ClearDesign />
                <HtmlOutput />
                <ExportImport />
              </div>
            </header>
            <Canvas />
          </SidebarInset>

          <PropertiesSidebar />
        </div>

        <FloatingToolbar />
      </SidebarProvider>
    </BuilderProvider>
  )
}
