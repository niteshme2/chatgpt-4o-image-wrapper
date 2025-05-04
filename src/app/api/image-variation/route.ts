import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ChatGPTImageAPI } from "@/lib/chatgpt-api";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const userId = formData.get("userId") as string | null;
    
    // Extract options
    const model = formData.get("model") as string;
    const n = formData.get("n") ? Number(formData.get("n")) : undefined;
    const size = formData.get("size") as string;
    
    const options = {
      model: model as "gpt-image-1" | "dall-e-2" | "dall-e-3" | undefined,
      n,
      size: size as "1024x1024" | "1792x1024" | "1024x1792" | undefined,
    };

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Initialize the ChatGPT API client
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const chatGPTAPI = new ChatGPTImageAPI(apiKey);

    // Create image variation
    const result = await chatGPTAPI.createImageVariation(imageFile, options);

    // If a userId is provided, store the result in Supabase
    if (userId && result.data && result.data.length > 0) {
      const supabase = createClient();
      
      // Store the image URL in Supabase
      const { error } = await supabase
        .from("images")
        .insert({
          user_id: userId,
          prompt: "Variation",
          url: result.data[0].url,
          created_at: new Date(),
          type: "variation",
        });

      if (error) {
        console.error("Error storing image in Supabase:", error);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating image variation:", error);
    return NextResponse.json(
      { error: "Failed to create image variation" },
      { status: 500 }
    );
  }
}