"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { ImageGallery } from "@/components/image-gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function EditPage() {
  const [activeTab, setActiveTab] = useState<string>("edit")
  const [prompt, setPrompt] = useState("")
  const [sourceImage, setSourceImage] = useState<File | undefined>(undefined)
  const [maskImage, setMaskImage] = useState<File | undefined>(undefined)
  const [model, setModel] = useState<string>("gpt-image-1")
  const [size, setSize] = useState<string>("1024x1024")
  const [n, setN] = useState<number>(1)
  const [images, setImages] = useState<Array<{ url: string; revised_prompt?: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sourceImage) {
      setError("Please upload an image")
      return
    }

    if (activeTab === "edit" && !prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const formData = new FormData()
      
      if (activeTab === "edit") {
        formData.append("prompt", prompt)
        formData.append("image", sourceImage)
        if (maskImage) {
          formData.append("mask", maskImage)
        }
        formData.append("model", model)
        formData.append("n", n.toString())
        formData.append("size", size)
        
        const response = await fetch("/api/edit-image", {
          method: "POST",
          body: formData,
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to edit image")
        }
        
        const data = await response.json()
        setImages(data.data)
      } else if (activeTab === "variation") {
        formData.append("image", sourceImage)
        formData.append("model", model)
        formData.append("n", n.toString())
        formData.append("size", size)
        
        const response = await fetch("/api/image-variation", {
          method: "POST",
          body: formData,
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create variation")
        }
        
        const data = await response.json()
        setImages(data.data)
      }
    } catch (err) {
      console.error("Error processing image:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Images</h1>
        
        <Tabs
          defaultValue="edit"
          className="w-full"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            setError(null)
            setImages([])
          }}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="edit">Edit Image</TabsTrigger>
            <TabsTrigger value="variation">Create Variation</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {activeTab === "edit" ? "Edit Image" : "Create Variation"}
                    </CardTitle>
                    <CardDescription>
                      {activeTab === "edit" 
                        ? "Upload an image and describe the edits you want to make" 
                        : "Upload an image to generate variations"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Source Image</Label>
                        <ImageUpload
                          value={sourceImage}
                          onChange={setSourceImage}
                          className="mt-2 aspect-square"
                        />
                      </div>
                      
                      {activeTab === "edit" && (
                        <>
                          <div className="mt-4">
                            <Label htmlFor="prompt">Edit Prompt</Label>
                            <Textarea
                              id="prompt"
                              placeholder="Describe the changes you want to make to the image..."
                              className="mt-2 min-h-[100px]"
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                            />
                          </div>
                          
                          <div className="mt-4">
                            <Label>Mask Image (Optional)</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                              Upload a mask to specify which parts of the image to edit. 
                              White areas will be edited, black areas will be preserved.
                            </p>
                            <ImageUpload
                              value={maskImage}
                              onChange={setMaskImage}
                              className="aspect-square"
                            />
                          </div>
                        </>
                      )}
                      
                      {error && (
                        <p className="text-destructive text-sm mt-2">{error}</p>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="mt-4 w-full"
                        disabled={isLoading || !sourceImage || (activeTab === "edit" && !prompt.trim())}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {activeTab === "edit" ? "Editing..." : "Generating Variations..."}
                          </>
                        ) : (
                          activeTab === "edit" ? "Edit Image" : "Create Variations"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>

              {images.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">
                    {activeTab === "edit" ? "Edited Images" : "Image Variations"}
                  </h2>
                  <ImageGallery images={images} />
                </div>
              )}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Image Options</CardTitle>
                  <CardDescription>
                    Customize your image settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        <SelectItem value="gpt-image-1">GPT Image</SelectItem>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  )
}