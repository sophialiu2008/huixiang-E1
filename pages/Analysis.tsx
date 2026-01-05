// Analysis.tsx 完整修复参考
import { GoogleGenerativeAI } from "@google/generative-ai";

// 初始化 API Key (确保你的 Vercel 环境变量里有这个 KEY)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export const analyzeContent = async (text: string) => {
  try {
    // 【修改重点】明确使用 gemini-1.5-flash 且不强制指定 v1beta
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const prompt = `你是一个专业的助手。请分析以下内容：${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini 分析失败:", error);
    throw error;
  }
};