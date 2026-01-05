import { GoogleGenerativeAI } from "@google/generative-ai";

// 建议直接把 API Key 写死在这里测试（测试成功后再改回 process.env）
const genAI = new GoogleGenerativeAI("AIzaSyDepCgQUymGRuBzl6tO9wDj-R67bcgND84");

export const analyzeContent = async (text: string) => {
  try {
    // 显式指定使用 v1 版本，避开报错的 v1beta
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" }, 
      { apiVersion: 'v1' } 
    );

    const result = await model.generateContent(text);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini 升级版调用失败:", error);
    throw error;
  }
};