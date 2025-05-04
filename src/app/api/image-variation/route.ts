import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ChatGPTImageAPI } from "@/lib/chatgpt-api";

export async function POST(request: NextRequest) {
  console.log("🔄 [API] /api/image-variation: Request received");
  try {
    const formData = await request.formData();
    console.log("📝 [API] FormData received");
    
    const imageFile = formData.get("image") as File;
    const userId = formData.get("userId") as string | null;
    
    // Extract options
    const model = formData.get("model") as string;
    const n = formData.get("n") ? Number(formData.get("n")) : undefined;
    const size = formData.get("size") as string;
    
    console.log("📝 [API] Request data:", { 
      imageFile: imageFile ? {
        name: imageFile.name,
        size: Math.round(imageFile.size / 1024) + "KB",
        type: imageFile.type
      } : null,
      userId: userId ? "✓" : "✗",
      model,
      n,
      size
    });
    
    const options = {
      model: model as "gpt-image-1" | undefined,
      n,
      size: size as "1024x1024" | "1792x1024" | "1024x1792" | undefined,
    };

    if (!imageFile) {
      console.log("⚠️ [API] Error: Image is required");
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Initialize the ChatGPT API client
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log("⚠️ [API] Error: OpenAI API key is not configured");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    console.log("🔑 [API] API key available (starts with):", apiKey.substring(0, 12) + "...");
    const chatGPTAPI = new ChatGPTImageAPI(apiKey);

    console.log("🖼️ [API] Creating image variation");
    // Create image variation
    const result = await chatGPTAPI.createImageVariation(imageFile, options);
    // Log details about the response for debugging
    console.log("✅ [API] Image variation creation successful");
    console.log("📊 [API] Full response:", JSON.stringify(result, null, 2));
    
    // Safely check if data exists and is an array before mapping
    if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
      console.log("📊 [API] Response image details:", result.data.map((img, i) => ({
        index: i,
        url: img?.url || "no-url",
        urlLength: img?.url?.length || 0,
        urlStart: img?.url ? (img.url.substring(0, 50) + "...") : "no-url",
        hasRevisedPrompt: !!img?.revised_prompt
      })));
    } else {
      console.log("⚠️ [API] No image data in response or unexpected response format");
    }

    // If a userId is provided, store the result in Supabase
    if (userId && result?.data && Array.isArray(result.data) && result.data.length > 0 && result.data[0]?.url) {
      console.log("💾 [API] Storing image variation in Supabase");
      try {
        const supabase = createClient();
        
        // Store the image URL in Supabase
        const { error } = await supabase
          .from("images")
          .insert({
            user_id: userId,
            prompt: "Variation",
            url: result.data[0].url,
            revised_prompt: result.data[0]?.revised_prompt || null,
            created_at: new Date(),
            type: "variation",
          });

        if (error) {
          console.error("⚠️ [API] Error storing image in Supabase:", error);
        } else {
          console.log("✅ [API] Image variation stored in Supabase successfully");
        }
      } catch (storageError) {
        console.error("⚠️ [API] Exception while storing image in Supabase:", storageError);
      }
    } else {
      console.log("⚠️ [API] Skipping Supabase storage due to missing or invalid image data");
    }

    console.log("🏁 [API] Image variation request completed successfully");
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ [API] Error creating image variation:", error);
    return NextResponse.json(
      { error: "Failed to create image variation" },
      { status: 500 }
    );
  }
}