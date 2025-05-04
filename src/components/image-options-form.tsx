"use client"

import React from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ImageOptionsFormProps {
  className?: string
  onOptionsChange: (options: {
    model: string
    size: string
    quality: string 
    style: string
    n: number
  }) => void
}

export function ImageOptionsForm({
  className,
  onOptionsChange,
}: ImageOptionsFormProps) {
  const [model, setModel] = React.useState<string>("dall-e-3")
  const [size, setSize] = React.useState<string>("1024x1024")
  const [quality, setQuality] = React.useState<string>("standard")
  const [style, setStyle] = React.useState<string>("vivid")
  const [n, setN] = React.useState<number>(1)

  React.useEffect(() => {
    onOptionsChange({
      model,
      size,
      quality,
      style,
      n,
    })
  }, [model, size, quality, style, n, onOptionsChange])

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select
          value={model}
          onValueChange={(value) => setModel(value)}
        >
          <SelectTrigger id="model">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
            <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Select
          value={size}
          onValueChange={(value) => setSize(value)}
        >
          <SelectTrigger id="size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
            <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
            <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quality">Quality</Label>
        <Select
          value={quality}
          onValueChange={(value) => setQuality(value)}
        >
          <SelectTrigger id="quality">
            <SelectValue placeholder="Select quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="hd">HD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="style">Style</Label>
        <Select
          value={style}
          onValueChange={(value) => setStyle(value)}
        >
          <SelectTrigger id="style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vivid">Vivid</SelectItem>
            <SelectItem value="natural">Natural</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="n">Number of images</Label>
        <Select
          value={n.toString()}
          onValueChange={(value) => setN(parseInt(value))}
        >
          <SelectTrigger id="n">
            <SelectValue placeholder="Select number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}