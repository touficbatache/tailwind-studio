"use client"

import { useEffect, useState } from "react"
import { Copy, Code } from "lucide-react"
import Prism from "prismjs"
import "prismjs/themes/prism.css"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useBuilder } from "@/context/builder-context"

export function HtmlOutput() {
  const { generateHTML } = useBuilder()
  const [copied, setCopied] = useState(false)

  const htmlOutput = generateHTML()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(htmlOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Code className="h-4 w-4" />
          View HTML
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Generated HTML
          </DialogTitle>
        </DialogHeader>
        {htmlOutput === "" ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-lg">No elements to generate HTML</p>
            <p className="text-sm">Add elements to your canvas first</p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg overflow-auto text-sm">
            <div className="flex justify-end p-2 border-b">
              {htmlOutput !== "" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2 text-gray-500"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
            <pre className="py-3 px-5">
              <code
                className="language-html"
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    htmlOutput,
                    Prism.languages.html,
                    "html",
                  ),
                }}
              ></code>
            </pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
