import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ProductAlternative {
  name: string;
  price: string;
  description: string;
  reason: string;
  link: string;
  platform: string;
}

export async function findAlternatives(productName: string): Promise<ProductAlternative[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find 3-5 cheaper or better value alternatives for the product: "${productName}". 
    For each alternative, provide:
    - name
    - price (approximate)
    - description
    - reason why it's a good alternative
    - platform (e.g. Amazon, Walmart, etc.)
    - a placeholder affiliate link (e.g. https://example.com/affiliate/...)`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.STRING },
            description: { type: Type.STRING },
            reason: { type: Type.STRING },
            platform: { type: Type.STRING },
            link: { type: Type.STRING },
          },
          required: ["name", "price", "description", "reason", "platform", "link"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
