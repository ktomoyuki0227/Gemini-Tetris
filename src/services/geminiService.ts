import { GoogleGenAI, Type } from "@google/genai";
import { Theme } from '../types';
import { DEFAULT_THEME } from '../constants';

// Vercel/Vite環境では import.meta.env.VITE_API_KEY を使用する
const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTheme = async (prompt: string): Promise<Theme> => {
  if (!apiKey) {
    console.warn("API Key is missing.");
    return DEFAULT_THEME;
  }
  try {
    const modelId = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Create a Tetris color theme based on this description: "${prompt}". 
      Ensure colors have good contrast against the board background. 
      The background should be a valid CSS background property (e.g., hex, rgba, or linear-gradient).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            background: { type: Type.STRING, description: "Main page background, e.g. 'linear-gradient(...)' or hex" },
            boardBackground: { type: Type.STRING, description: "The grid background color, usually dark" },
            gridColor: { type: Type.STRING, description: "Color of grid lines" },
            textColor: { type: Type.STRING, description: "Primary text color" },
            accentColor: { type: Type.STRING, description: "UI accent color" },
            pieceColors: {
              type: Type.OBJECT,
              properties: {
                I: { type: Type.STRING },
                J: { type: Type.STRING },
                L: { type: Type.STRING },
                O: { type: Type.STRING },
                S: { type: Type.STRING },
                T: { type: Type.STRING },
                Z: { type: Type.STRING },
              },
              required: ["I", "J", "L", "O", "S", "T", "Z"],
            },
          },
          required: ["name", "background", "boardBackground", "gridColor", "textColor", "accentColor", "pieceColors"],
        },
      },
    });

    if (response.text) {
      const theme = JSON.parse(response.text) as Theme;
      return theme;
    }
    return DEFAULT_THEME;
  } catch (error) {
    console.error("Failed to generate theme:", error);
    return DEFAULT_THEME;
  }
};

export const generateBackgroundImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
  if (!apiKey) {
     console.warn("API Key is missing.");
     return null;
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate background image:", error);
    return null;
  }
};