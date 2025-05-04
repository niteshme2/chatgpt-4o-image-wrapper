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
    url: string;
    revised_prompt?: string;
  }>;
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

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestOptions),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
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

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error editing image:", error);
      throw error;
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

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating image variation:", error);
      throw error;
    }
  }
}