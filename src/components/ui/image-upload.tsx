"use client"

import React, { useState } from "react"
import Image from "next/image"
import { UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  className?: string
  value?: File
  onChange: (file?: File) => void
  disabled?: boolean
  accept?: string
}

export function ImageUpload({
  className,
  value,
  onChange,
  disabled,
  accept = "image/*",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      onChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    onChange(undefined)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    
    if (disabled) return
    
    const file = e.dataTransfer.files?.[0]
    
    if (file && file.type.startsWith("image/")) {
      onChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors",
        disabled && "cursor-not-allowed opacity-60",
        preview ? "border-muted bg-background" : "border-muted-foreground/25 bg-muted/10 hover:bg-muted/20",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      
      {preview ? (
        <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-md">
          <Image
            src={preview}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2"
            onClick={(e) => {
              e.stopPropagation()
              handleRemove()
            }}
            disabled={disabled}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <div className="text-xs font-medium text-muted-foreground">
            <p>Drag & drop an image here or click to select</p>
            <p className="mt-1">(Max file size: 4MB)</p>
          </div>
        </div>
      )}
    </div>
  )
}