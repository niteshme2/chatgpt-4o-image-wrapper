import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ChatGPTImageAPI } from "@/lib/chatgpt-api";

export async function POST(request: NextRequest) {
  try {
    const { prompt, options, userId } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
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

    // Generate the image
    const result = await chatGPTAPI.generateImage(prompt, options);

    // If a userId is provided, store the result in Supabase
    if (userId && result.data && result.data.length > 0) {
      const supabase = createClient();
      
      // Store the image URL and prompt in Supabase
      const { error } = await supabase
        .from("images")
        .insert({
          user_id: userId,
          prompt,
          url: result.data[0].url,
          revised_prompt: result.data[0].revised_prompt,
          created_at: new Date(),
          type: "generated",
        });

      if (error) {
        console.error("Error storing image in Supabase:", error);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}