import { GoogleGenerativeAI } from "@google/generative-ai";

// 假设你的环境变量名是这个，如果不是请替换
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export const analyzeContent = async (inputData: string) => {
  try {
    // 【关键修改点】将 model 改为 "gemini-1.5-flash-latest"
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest" 
    });

    const prompt = `请对以下内容进行详细分析：${inputData}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("分析失败:", error);
    throw error;
  }
};