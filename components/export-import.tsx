"use client"

import { useState, useRef } from "react"
import { Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useBuilder } from "../context/builder-context"
import { useToast } from "@/hooks/use-toast"

export function ExportImport() {
  const { exportData, importData, generateHTML, importFromHTML } = useBuilder()
  const { toast } = useToast()
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importValue, setImportValue] = useState("")
  const [importType, setImportType] = useState<"json" | "html">("json")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ui-builder-export.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Your UI design has been exported as JSON.",
    })
  }

  const handleExportHTML = () => {
    const html = generateHTML()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ui-builder-export.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "HTML Export Successful",
      description: "Your UI design has been exported as HTML.",
    })
  }

  const handleImport = () => {
    try {
      if (importType === "json") {
        importData(importValue)
      } else {
        importFromHTML(importValue)
      }
      setImportValue("")
      setIsImportOpen(false)
      toast({
        title: "Import Successful",
        description: `Your UI design has been imported from ${importType.toUpperCase()}.`,
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: `Failed to import ${importType.toUpperCase()}. Please check the format.`,
        variant: "destructive",
      })
    }
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      try {
        if (file.name.endsWith(".json")) {
          importData(content)
          toast({
            title: "Import Successful",
            description: "Your UI design has been imported from JSON file.",
          })
          setIsImportOpen(false)
        } else if (file.name.endsWith(".html")) {
          importFromHTML(content)
          toast({
            title: "Import Successful",
            description: "Your UI design has been imported from HTML file.",
          })
          setIsImportOpen(false)
        } else {
          toast({
            title: "Import Failed",
            description: "Please select a JSON or HTML file.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import file. Please check the format.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex gap-2">
      {/* Export Button with Dropdown */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export UI Design</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose your export format:
            </p>
            <div className="flex gap-2">
              <Button onClick={handleExport} className="flex-1">
                Export as JSON
              </Button>
              <Button
                onClick={handleExportHTML}
                variant="outline"
                className="flex-1"
              >
                Export as HTML
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Button */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import UI Design</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={importType === "json" ? "default" : "outline"}
                size="sm"
                onClick={() => setImportType("json")}
              >
                JSON
              </Button>
              <Button
                variant={importType === "html" ? "default" : "outline"}
                size="sm"
                onClick={() => setImportType("html")}
              >
                HTML
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Paste your {importType.toUpperCase()} content:
              </p>
              <Textarea
                value={importValue}
                onChange={(e) => setImportValue(e.target.value)}
                placeholder={`Paste your ${importType.toUpperCase()} content here...`}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Or import from file:
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.html"
                onChange={handleFileImport}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={!importValue.trim()}>
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
