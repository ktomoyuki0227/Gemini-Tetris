import { GoogleGenAI, Type } from "@google/genai";
import { Theme } from '../types';
import { DEFAULT_THEME } from '../constants';

const apiKey = import.meta.env.VITE_API_KEY;

// Initialize only if API key is present
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

export const generateTheme = async (prompt: string): Promise<Theme> => {
  if (!apiKey) {
    console.warn("No API key found. Returning default theme.");
    return DEFAULT_THEME;
  }
  try {
    const modelId = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: 'user',
        parts: [{
          text: `Create a Tetris color theme based on this description: "${prompt}". 
          Ensure colors have good contrast against the board background. 
          The background should be a valid CSS background property (e.g., hex, rgba, or linear-gradient).`
        }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            background: { type: Type.STRING, description: "Main page background" },
            boardBackground: { type: Type.STRING, description: "Grid background" },
            gridColor: { type: Type.STRING, description: "Grid lines color" },
            textColor: { type: Type.STRING, description: "Text color" },
            accentColor: { type: Type.STRING, description: "Accent color" },
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
    console.warn("No API key found.");
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

    // In 0.1.0 we access parts slightly differently or check inlineData
    // Note: The structure of response depends on the specific 0.1.0 types.
    // Assuming standard candidate structure.
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