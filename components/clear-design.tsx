"use client"

import { useEffect, useState } from "react"
import { Copy, Trash2 } from "lucide-react"
import Prism from "prismjs"
import "prismjs/themes/prism.css"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { useBuilder } from "@/context/builder-context"

export function ClearDesign() {
  const { elements, deleteAllElements } = useBuilder()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={elements.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Clear design
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Clear design?
          </DialogTitle>
        </DialogHeader>
        <p>This action will clear all your work.</p>
        <p>Are you sure you want to proceed?</p>
        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                deleteAllElements()
              }}
            >
              Yes, clear
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
