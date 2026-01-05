import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const AiCanvas: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleAiAction = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
      
      // 【关键修改点】将 model 改为 "gemini-1.5-flash-latest"
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest" 
      });

      // 假设这是你的处理逻辑
      const result = await model.generateContent("描述这个画布的内容");
      const text = await result.response.text();
      console.log(text);
    } catch (error) {
      // 这会触发你图片中的那个弹窗报错
      alert("分析失败: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 你的画布组件逻辑 */}
      <button onClick={handleAiAction} disabled={loading}>
        {loading ? "分析中..." : "开始 AI 分析"}
      </button>
    </div>
  );
};

export default AiCanvas;