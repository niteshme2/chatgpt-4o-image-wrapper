"use client"

import React, { useState } from "react"
import Image from "next/image"
import { AlertTriangle, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ImageItem {
  url?: string
  b64_json?: string
  revised_prompt?: string
}

interface ImageGalleryProps {
  className?: string
  images: Array<ImageItem>
}

export function ImageGallery({
  className,
  images,
}: ImageGalleryProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [imageSrcs, setImageSrcs] = useState<Record<number, string>>({})

  // Convert base64 to image src when component mounts
  React.useEffect(() => {
    const srcs: Record<number, string> = {}
    
    images.forEach((image, index) => {
      if (image.url) {
        srcs[index] = image.url
      } else if (image.b64_json) {
        srcs[index] = `data:image/png;base64,${image.b64_json}`
      }
    })
    
    setImageSrcs(srcs)
  }, [images])

  const downloadImage = async (src: string, filename: string = "image.png") => {
    try {
      console.log("Downloading image")
      
      // If it's a base64 data URI
      if (src.startsWith('data:')) {
        const base64Data = src.split(',')[1]
        if (!base64Data) {
          throw new Error("Invalid data URI")
        }
        
        const byteCharacters = atob(base64Data)
        const byteArrays = []
        
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024)
          
          const byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
          }
          
          const byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
        }
        
        const blob = new Blob(byteArrays, {type: 'image/png'})
        const downloadUrl = URL.createObjectURL(blob)
        
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up the object URL
        URL.revokeObjectURL(downloadUrl)
      } else {
        // If it's a remote URL
        const response = await fetch(src)
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
        }
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
      }
    } catch (error) {
      console.error("Error downloading image:", error)
      alert("Failed to download image. See console for details.")
    }
  }

  const handleImageError = (index: number) => {
    const src = imageSrcs[index]
    if (src) {
      console.error(`Failed to load image at index ${index} with src:`, src.substring(0, 100) + '...')
    } else {
      console.error(`Failed to load image at index ${index} - no image source available`)
    }
    setImageErrors(prev => ({ ...prev, [index]: true }))
  }

  const openImageInNewTab = (src: string) => {
    // For base64 images, we need to create a new HTML page with the image
    if (src.startsWith('data:')) {
      const newWindow = window.open('', '_blank')
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Image Preview</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0; }
                img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${src}" alt="Generated Image" />
            </body>
          </html>
        `)
        newWindow.document.close()
      }
    } else {
      window.open(src, '_blank', 'noopener,noreferrer')
    }
  }

  if (!images.length) {
    return null
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
      {images.map((image, index) => {
        const imageSrc = imageSrcs[index]
        const imageType = image.url ? 'URL' : (image.b64_json ? 'Base64' : 'Unknown')
        
        return (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-square w-full">
              {imageErrors[index] ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-muted p-4 text-center">
                  <AlertTriangle className="mb-2 h-8 w-8 text-destructive" />
                  <p className="mb-2 text-sm">Failed to load image</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {imageSrc && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openImageInNewTab(imageSrc)}
                      >
                        Open Image <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      onClick={() => {
                        // Try again
                        setImageErrors(prev => ({ ...prev, [index]: false }))
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Type: {imageType}
                  </p>
                </div>
              ) : (
                <>
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={`Generated image ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(index)}
                      unoptimized // Skip Next.js image optimization for all URLs
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <p className="text-sm text-muted-foreground">No image data available</p>
                    </div>
                  )}
                  {imageSrc && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-2 right-2 bg-background/50 backdrop-blur-sm"
                      onClick={() => downloadImage(imageSrc, `image-${index + 1}.png`)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
            <CardFooter className="p-3 flex flex-col items-start">
              <div className="text-xs text-muted-foreground w-full">
                <span className="font-medium">Type:</span> {imageType}
                {imageType === 'Base64' && (
                  <span className="ml-2 text-xs opacity-70">(data:image/png;base64,...)</span>
                )}
              </div>
              {image?.revised_prompt && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium">Revised prompt:</span> {image.revised_prompt}
                </p>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}