import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 修复说明：
 * 1. 强制指定 apiVersion 为 'v1'。
 * 2. 使用 gemini-1.5-flash 稳定版模型。
 */

// 优先读取环境变量，如果没有则需确保在 Vercel 后台配置了该 KEY
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeContent = async (text: string) => {
  if (!text) return "请输入内容";

  try {
    // 【核心修复点】显式指定 v1 版本，避开报错的 v1beta 路径
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: "v1" }
    );

    const prompt = `你是一位专业的助手，请对以下内容进行深度分析并给出建议：\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // 捕获特定错误并返回友好提示
    if (error.message?.includes("404")) {
      return "错误：API 接口路径未找到，请检查 SDK 版本。";
    }
    return `分析失败: ${error.message || "未知错误"}`;
  }
};