type ImageGenerationModel = "gpt-4o";
type ImageSize = "1024x1024" | "1792x1024" | "1024x1792";
type ImageQuality = "standard" | "hd";
type ImageStyle = "vivid" | "natural";

export interface ImageGenerationOptions {
  model?: ImageGenerationModel;
  n?: number;
  quality?: ImageQuality;
  size?: ImageSize;
  style?: ImageStyle;
  user?: string;
}

type ImageEditModel = "gpt-image-1";

export interface ImageEditOptions {
  model?: ImageEditModel;
  n?: number;
  size?: ImageSize;
  user?: string;
}

export interface ImageGenerationResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
  usage?: {
    total_tokens: number;
    input_tokens: number;
    output_tokens: number;
    input_tokens_details?: {
      text_tokens: number;
      image_tokens: number;
    }
  }
}

export class ChatGPTImageAPI {
  private apiKey: string;
  private baseUrl: string = "https://api.openai.com/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate an image based on a text prompt
   */
  async generateImage(
    prompt: string,
    options: ImageGenerationOptions = {}
  ): Promise<ImageGenerationResponse> {
    const endpoint = `${this.baseUrl}/images/generations`;
    const defaultOptions: ImageGenerationOptions = {
      model: "gpt-4o",
      n: 1,
      quality: "standard",
      size: "1024x1024",
      style: "vivid",
    };

    const requestOptions = { ...defaultOptions, ...options, prompt };
    
    console.log("📤 IMAGE GENERATION REQUEST:");
    console.log("- Endpoint:", endpoint);
    console.log("- Options:", JSON.stringify(requestOptions, null, 2));

    try {
      console.log("⏳ Sending request to OpenAI API...");
      const startTime = Date.now();
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestOptions),
      });
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Response received in ${duration}ms`);
      console.log("📥 Response status:", response.status);
      
      // Log just a few important headers instead of all
      console.log("📥 Response headers:", {
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
        server: response.headers.get("server")
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { raw: errorText };
        }
        console.error("❌ OpenAI API Error:", JSON.stringify(errorData, null, 2));
        throw new Error(
          `OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`
        );
      }

      const responseData = await response.json();
      console.log("✅ Successfully generated image");
      console.log("📥 RESPONSE DATA:", JSON.stringify(responseData, null, 2));
      
      // Ensure the response has the expected format
      if (!responseData.data || !Array.isArray(responseData.data)) {
        console.warn("⚠️ Response doesn't contain data array, creating default structure");
        return {
          created: Date.now(),
          data: []
        };
      }
      
      return responseData;
    } catch (error) {
      console.error("❌ Error generating image:", error);
      // Return a default response structure on error
      return {
        created: Date.now(),
        data: []
      };
    }
  }

  /**
   * Edit an image based on a text prompt and an image
   */
  async editImage(
    image: File,
    prompt: string,
    mask?: File,
    options: ImageEditOptions = {}
  ): Promise<ImageGenerationResponse> {
    const endpoint = `${this.baseUrl}/images/edits`;
    const defaultOptions: ImageEditOptions = {
      model: "gpt-image-1",
      n: 1,
      size: "1024x1024",
    };

    const requestOptions = { ...defaultOptions, ...options };
    const formData = new FormData();

    // Add the image, prompt, and options to form data
    formData.append("image", image);
    formData.append("prompt", prompt);
    
    if (mask) {
      formData.append("mask", mask);
    }
    
    Object.entries(requestOptions).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    console.log("📤 IMAGE EDIT REQUEST:");
    console.log("- Endpoint:", endpoint);
    console.log("- Image filename:", image.name);
    console.log("- Image size:", Math.round(image.size / 1024), "KB");
    console.log("- Image type:", image.type);
    console.log("- Prompt:", prompt);
    if (mask) {
      console.log("- Mask filename:", mask.name);
      console.log("- Mask size:", Math.round(mask.size / 1024), "KB");
    }
    console.log("- Options:", JSON.stringify(requestOptions, null, 2));
    
    // Log FormData keys (simplified)
    console.log("- FormData keys:", {
      image: !!formData.get("image"),
      prompt: !!formData.get("prompt"),
      mask: !!formData.get("mask"),
      model: formData.get("model"),
      n: formData.get("n"),
      size: formData.get("size")
    });

    try {
      console.log("⏳ Sending image edit request to OpenAI API...");
      const startTime = Date.now();
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Response received in ${duration}ms`);
      console.log("📥 Response status:", response.status);
      
      // Log just a few important headers instead of all
      console.log("📥 Response headers:", {
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
        server: response.headers.get("server")
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { raw: errorText };
        }
        console.error("❌ OpenAI API Error:", JSON.stringify(errorData, null, 2));
        throw new Error(
          `OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`
        );
      }

      const responseData = await response.json();
      console.log("✅ Successfully edited image");
      console.log("📥 RESPONSE DATA:", JSON.stringify(responseData, null, 2));
      
      // Ensure the response has the expected format
      if (!responseData.data || !Array.isArray(responseData.data)) {
        console.warn("⚠️ Response doesn't contain data array, creating default structure");
        return {
          created: Date.now(),
          data: []
        };
      }
      
      return responseData;
    } catch (error) {
      console.error("❌ Error editing image:", error);
      // Return a default response structure on error
      return {
        created: Date.now(),
        data: []
      };
    }
  }

  /**
   * Create a variation of an image
   */
  async createImageVariation(
    image: File,
    options: ImageEditOptions = {}
  ): Promise<ImageGenerationResponse> {
    const endpoint = `${this.baseUrl}/images/variations`;
    const defaultOptions: ImageEditOptions = {
      model: "gpt-image-1",
      n: 1,
      size: "1024x1024",
    };

    const requestOptions = { ...defaultOptions, ...options };
    const formData = new FormData();

    // Add the image and options to form data
    formData.append("image", image);
    
    Object.entries(requestOptions).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    console.log("📤 IMAGE VARIATION REQUEST:");
    console.log("- Endpoint:", endpoint);
    console.log("- Image filename:", image.name);
    console.log("- Image size:", Math.round(image.size / 1024), "KB");
    console.log("- Image type:", image.type);
    console.log("- Options:", JSON.stringify(requestOptions, null, 2));
    
    // Log FormData keys (simplified)
    console.log("- FormData keys:", {
      image: !!formData.get("image"),
      prompt: !!formData.get("prompt"),
      mask: !!formData.get("mask"),
      model: formData.get("model"),
      n: formData.get("n"),
      size: formData.get("size")
    });

    try {
      console.log("⏳ Sending image variation request to OpenAI API...");
      const startTime = Date.now();
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Response received in ${duration}ms`);
      console.log("📥 Response status:", response.status);
      
      // Log just a few important headers instead of all
      console.log("📥 Response headers:", {
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
        server: response.headers.get("server")
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { raw: errorText };
        }
        console.error("❌ OpenAI API Error:", JSON.stringify(errorData, null, 2));
        throw new Error(
          `OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`
        );
      }

      const responseData = await response.json();
      console.log("✅ Successfully created image variation");
      console.log("📥 RESPONSE DATA:", JSON.stringify(responseData, null, 2));
      
      // Ensure the response has the expected format
      if (!responseData.data || !Array.isArray(responseData.data)) {
        console.warn("⚠️ Response doesn't contain data array, creating default structure");
        return {
          created: Date.now(),
          data: []
        };
      }
      
      return responseData;
    } catch (error) {
      console.error("❌ Error creating image variation:", error);
      // Return a default response structure on error
      return {
        created: Date.now(),
        data: []
      };
    }
  }
}