import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

async function main() {
  // Initialize the SDK. It automatically picks up GEMINI_API_KEY from the environment.
  const ai = new GoogleGenAI({});
  
  console.log("Generating background image...");
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: 'A surreal dreamscape of a night garden, translucent and glowing wildflowers, thick mist, cinematic volumetric lighting, deep teal and earthy tones, hyper-detailed botanical collage style.',
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  fs.mkdirSync('public', { recursive: true });
  
  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      fs.writeFileSync('public/bg.png', Buffer.from(part.inlineData.data, 'base64'));
      console.log("Image successfully saved to public/bg.png");
      break;
    }
  }
}

main().catch(console.error);
