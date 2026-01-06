import { GoogleGenerativeAI } from "@google/genai"; // 修改为与 index.html 匹配的导入名
import { ScanType, AnalysisResult } from "./types.ts";

/**
 * 修复说明：
 * 1. 匹配 HTML 中的 importmap 名称。
 * 2. 使用稳定的 gemini-1.5-flash 模型。
 * 3. 增加结构化输出提示，确保返回数据可以直接驱动图表。
 */

// 注意：在纯前端环境下 process.env 可能无法直接访问，建议在 Vite/Webpack 中配置定义
const API_KEY = "AIzaSyC6IbNwxWKUmhAJ7vxh0K87Pejq0ATQpyY"; 
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * 核心分析函数
 * @param imageBase64 传入照片的 Base64 编码（面相分析需要视觉模型）
 * @param scanType 扫描类型：face/palm 等
 */
export const analyzeFaceImage = async (imageBase64: string, scanType: ScanType = ScanType.FACE): Promise<AnalysisResult | string> => {
  if (!imageBase64) return "请提供图片数据";

  try {
    // 1. 获取模型（使用 flash 速度快，适合实时分析）
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // 2. 构造符合业务逻辑的 Prompt
    const prompt = `
      你是一位精通中国传统相学与现代心理学的 AI 大师。
      请分析这张${scanType === 'face' ? '面相' : '手相'}图片，并严格按照以下 JSON 格式返回分析结果（不要输出任何多余的文字）：
      
      {
        "score": 85,
        "description": "详细的综合分析描述...",
        "radarData": [
          { "subject": "事业", "A": 80, "fullMark": 100 },
          { "subject": "感情", "A": 70, "fullMark": 100 },
          { "subject": "健康", "A": 90, "fullMark": 100 },
          { "subject": "财运", "A": 65, "fullMark": 100 },
          { "subject": "人缘", "A": 85, "fullMark": 100 }
        ],
        "sanTing": [
          { "label": "上庭", "value": 33, "percent": 33, "color": "#ec13ec" },
          { "label": "中庭", "value": 34, "percent": 34, "color": "#ff8c00" },
          { "label": "下庭", "value": 33, "percent": 33, "color": "#a855f7" }
        ],
        "fortuneTrend": [
          { "age": "20岁", "score": 60 },
          { "age": "30岁", "score": 75 },
          { "age": "40岁", "score": 85 },
          { "age": "50岁", "score": 80 },
          { "age": "60岁", "score": 90 }
        ],
        "advices": [
          { "icon": "trending_up", "title": "事业建议", "tag": "进取", "desc": "当前运势适合开拓新业务..." }
        ],
        "citations": [
          { "source": "《麻衣相法》", "quote": "额广平正，富贵之相", "interpretation": "你的额头饱满，预示早年运势亨通。" }
        ]
      }
    `;

    // 3. 准备图片内容
    const imageData = {
      inlineData: {
        data: imageBase64.split(',')[1] || imageBase64, // 去掉 base64 头部
        mimeType: "image/jpeg"
      }
    };

    // 4. 发送请求
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    // 5. 解析并返回
    try {
      // 清理 AI 可能返回的 Markdown 代码块标签
      const cleanedJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedJson) as AnalysisResult;
    } catch (e) {
      console.error("JSON 解析失败:", text);
      return "分析结果解析失败，请重试";
    }

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    // 错误分类处理
    if (error.message?.includes("404")) {
      return "分析失败：模型路径无效。请确保 API 名称为 'gemini-1.5-flash' 且 Key 已激活。";
    }
    if (error.message?.includes("API key not valid")) {
      return "分析失败：API Key 无效，请检查环境变量。";
    }
    
    return `分析失败: ${error.message || "网络连接异常"}`;
  }
};
