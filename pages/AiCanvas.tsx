// 在你的 handleAiAction 或类似函数中
const handleAiAction = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
    
    // 【核心修复】强制指定 v1 接口
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: 'v1' }
    );

    const result = await model.generateContent("分析画布内容");
    const text = await result.response.text();
    console.log(text);
  } catch (error) {
    // 如果这里还报 404，说明你的 SDK 版本太老了
    alert("分析失败，请检查网络或配置: " + error);
  }
};