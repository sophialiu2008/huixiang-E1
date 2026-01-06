import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 修复说明：
 * 1. 统一初始化逻辑，确保模型版本为 v1。
 * 2. 优化错误弹窗提示，方便调试。
 */

const AiCanvas: React.FC = () => {
  const [resultText, setResultText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiAnalysis = async (imageData?: string) => {
    setIsAnalyzing(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
      
      // 【核心修复点】强制指定 v1 接口
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1" }
      );

      // 准备 Prompt
      const prompt = "请根据当前画布内容进行专业点评。";
      
      // 执行生成
      const result = await model.generateContent([prompt, ...(imageData ? [imageData] : [])]);
      const response = await result.response;
      setResultText(response.text());
      
    } catch (error: any) {
      console.error("Canvas AI Error:", error);
      // 弹出你图片中类似的错误提示框
      alert(`分析失败 [${error.status || 'Error'}]: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* 这里是你的画布组件逻辑，此处仅为结构示例 */}
      <div className="w-full h-64 bg-gray-100 rounded mb-4 border-2 border-dashed flex items-center justify-center">
        画布区域
      </div>

      <button
        onClick={() => handleAiAnalysis()}
        disabled={isAnalyzing}
        className={`px-6 py-2 rounded-full text-white ${isAnalyzing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isAnalyzing ? "AI 正在思考..." : "开始 AI 智能分析"}
      </button>

      {resultText && (
        <div className="mt-4 p-4 bg-white shadow rounded-lg w-full">
          <h3 className="font-bold border-b pb-2 mb-2">分析结果：</h3>
          <p className="whitespace-pre-wrap text-gray-700">{resultText}</p>
        </div>
      )}
    </div>
  );
};

export default AiCanvas;