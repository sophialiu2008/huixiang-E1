// AiCanvas.tsx 完整修复参考
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

// 假设这是你点击按钮触发 AI 的函数
const handleCanvasAnalysis = async (imageData?: string) => {
  try {
    // 【修改重点】确保模型名称正确
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // 如果是分析画布图片，逻辑通常如下
    const prompt = "请描述这张图片中的内容";
    
    // 如果有图片数据，则传入，否则只传文字
    const result = await model.generateContent([prompt, ...(imageData ? [imageData] : [])]);
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    // 对应你图片中的报错弹窗
    alert("AI Analysis failed: " + error);
  }
};