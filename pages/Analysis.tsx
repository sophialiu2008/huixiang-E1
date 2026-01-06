import { GoogleGenerativeAI } from "@google/genai";
import { ScanType, AnalysisResult } from "./types.ts";

// 建议在 Vercel 环境变量中配置此 Key
const API_KEY = "你的_REAL_GEMINI_API_KEY"; 
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * 修复说明：
 * 1. 模型名由 gemini-1.5-flash-latest 改为 gemini-1.5-flash (解决 404)。
 * 2. 强制要求 AI 返回标准 JSON，以便 Report 页面直接渲染图表。
 */
export const analyzeFaceImage = async (imageBase64: string, scanType: ScanType = ScanType.FACE): Promise<AnalysisResult | string> => {
  if (!imageBase64) return "未检测到图像数据";

  try {
    // 核心修复：去掉 -latest 后缀
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      你是一位精通面相学与现代数据分析的 AI 大师。
      请分析这张图片中的面部特征，并严格按以下 JSON 格式返回结果（不要包含多余文字）：
      {
        "score": 88,
        "description": "基于面部特征的简短综合评价...",
        "radarData": [
          {"subject": "财运", "A": 85, "fullMark": 100},
          {"subject": "事业", "A": 80, "fullMark": 100},
          {"subject": "感情", "A": 75, "fullMark": 100},
          {"subject": "健康", "A": 90, "fullMark": 100},
          {"subject": "人缘", "A": 85, "fullMark": 100}
        ],
        "sanTing": [
          {"label": "上庭", "value": 33, "percent": 33, "color": "#ec13ec"},
          {"label": "中庭", "value": 34, "percent": 34, "color": "#ff8c00"},
          {"label": "下庭", "value": 33, "percent": 33, "color": "#a855f7"}
        ],
        "fortuneTrend": [
          {"age": "20s", "score": 65},
          {"age": "30s", "score": 80},
          {"age": "40s", "score": 85},
          {"age": "50s", "score": 75},
          {"age": "60s+", "score": 90}
        ],
        "advices": [
          {"icon": "auto_awesome", "title": "开运指南", "tag": "推荐", "desc": "建议多保持微笑，提升人缘能量。"}
        ],
        "citations": [
          {"source": "相理衡真", "quote": "五岳朝归，一生衣食无忧。", "interpretation": "你的面部比例匀称，预示生活稳定。"}
        ]
      }
    `;

    const imageData = {
      inlineData: {
        data: imageBase64.includes('base64,') ? imageBase64.split(',')[1] : imageBase64,
        mimeType: "image/jpeg"
      }
    };

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    try {
      // 清除可能存在的 Markdown 代码块
      const cleanedJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedJson) as AnalysisResult;
    } catch (parseError) {
      console.error("JSON 解析失败:", text);
      return "分析结果格式异常，请重试";
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("404")) {
      return "服务更新中：模型接口未找到，请确认 API Key 权限。";
    }
    return `分析中断: ${error.message || "未知连接错误"}`;
  }
};
