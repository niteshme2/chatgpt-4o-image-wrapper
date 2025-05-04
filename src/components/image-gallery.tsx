"use client"

import React from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  className?: string
  images: Array<{
    url: string
    revised_prompt?: string
  }>
}

export function ImageGallery({
  className,
  images,
}: ImageGalleryProps) {
  const downloadImage = async (url: string, filename: string = "image.png") => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the object URL
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  if (!images.length) {
    return null
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
      {images.map((image, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="relative aspect-square w-full">
            <Image
              src={image.url}
              alt={`Generated image ${index + 1}`}
              fill
              className="object-cover"
            />
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-2 right-2 bg-background/50 backdrop-blur-sm"
              onClick={() => downloadImage(image.url, `image-${index + 1}.png`)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          {image.revised_prompt && (
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Revised prompt:</span> {image.revised_prompt}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}