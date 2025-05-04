"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageOptionsForm } from "@/components/image-options-form"
import { ImageGallery } from "@/components/image-gallery"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [options, setOptions] = useState({
    model: "gpt-4o",
    size: "1024x1024",
    quality: "standard",
    style: "vivid",
    n: 1,
  })
  const [images, setImages] = useState<Array<{ url: string; revised_prompt?: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          options,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate image")
      }

      const data = await response.json()
      setImages(data.data)
    } catch (err) {
      console.error("Error generating image:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Generate Images</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prompt</CardTitle>
                  <CardDescription>
                    Describe the image you want to generate in detail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="A highly detailed painting of a futuristic city with flying cars and neon lights..."
                    className="min-h-[150px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  
                  {error && (
                    <p className="text-destructive text-sm mt-2">{error}</p>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="mt-4 w-full"
                    disabled={isLoading || !prompt.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Image"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </form>

            {images.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Generated Images</h2>
                <ImageGallery images={images} />
              </div>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Image Options</CardTitle>
                <CardDescription>
                  Customize your image generation settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageOptionsForm onOptionsChange={setOptions} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}