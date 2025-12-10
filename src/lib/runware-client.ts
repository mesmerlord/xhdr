// Runware API client for image generation

interface RunwareGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  model?: string;
}

interface RunwareImageResult {
  imageURL: string;
  seed: number;
}

class RunwareClient {
  private apiKey: string;
  private baseUrl = "https://api.runware.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(options: RunwareGenerationOptions): Promise<RunwareImageResult> {
    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        positivePrompt: options.prompt,
        width: options.width || 1024,
        height: options.height || 1024,
        steps: options.steps || 25,
        seed: options.seed,
        model: options.model || "runware:100@1",
        numberResults: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Runware API error: ${error}`);
    }

    const data = await response.json();
    return {
      imageURL: data.data[0].imageURL,
      seed: data.data[0].seed,
    };
  }
}

export const runwareClient = new RunwareClient(process.env.RUNWARE_API_KEY || "");
