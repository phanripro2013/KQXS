
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the GoogleGenAI client using the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets a lottery prediction from the Gemini AI model.
 * Incorporates chat history and formats it for the model.
 */
export const getLotteryPrediction = async (userPrompt: string, history: ChatMessage[]) => {
  // Map history to the format required by the GenAI SDK.
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
  
  // Add the current user prompt to the contents array.
  contents.push({ role: 'user', parts: [{ text: userPrompt }] });

  // Call generateContent directly on the models object.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: `Bạn là một chuyên gia soi cầu xổ số kiến thiết 3 miền Việt Nam. 
      Bạn cung cấp các nhận định thông minh, phân tích xác suất dựa trên các con số. 
      Lưu ý: Luôn nhắc nhở người dùng xổ số là trò chơi may rủi, không nên quá sa đà. 
      Hãy trả lời bằng tiếng Việt thân thiện, chuyên nghiệp. 
      Khi được hỏi về dự đoán, hãy gợi ý "Bạch thủ lô", "Song thủ lô", "Xiên 2", "Xiên 3".`,
      temperature: 0.8,
    },
  });

  // Extract the text output directly from the response object's text property.
  return response.text;
};
