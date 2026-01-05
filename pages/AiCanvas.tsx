import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; // 修正引用路径

interface AiCanvasProps {
  onBack: () => void;
}

const styles = [
  { id: 'ink', name: '水墨山水', prompt: 'Chinese traditional ink wash painting style, misty mountains, zen atmosphere' },
  { id: 'gold', name: '金石篆刻', prompt: 'Gold leaf texture, ancient seal carving style, red and gold accents' },
  { id: 'cyber', name: '赛博玄学', prompt: 'Cyberpunk neon aesthetics, floating holographic bagua symbols, futuristic temple' },
  { id: 'mural', name: '敦煌壁画', prompt: 'Dunhuang mural art style, ancient Buddhist fresco, weathered stone texture' },
  { id: 'real', name: '纪实摄影', prompt: 'Cinematic photography, dramatic lighting, high detail, realistic mystical scene' },
];

const presets = [
  "聚宝盆：财源滚滚之象",
  "桃花林：正缘桃花盛开",
  "青龙出海：事业腾飞之兆",
  "麒麟送子：家庭祥瑞之气",
  "文昌塔：学业步步高升"
];

const metaphysicalDictionary = [
  "财帛宫丰盈", "印堂发亮", "紫气东来", "祥云缭绕", "五行平衡", 
  "天圆地方", "八卦阵图", "太极流转", "麒麟戏水", "凤凰涅槃",
  "卧蚕红润", "夫妻宫明净", "山根坚挺", "龙吐珠", "金蟾献宝",
  "瑞兽呈祥", "仙鹤长鸣", "步步高升", "锦绣前程", "万象更新",
  "灵光一现", "乾坤挪移", "斗转星移", "命定正缘", "开运奇术"
];

const AiCanvas: React.FC<AiCanvasProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadingPhrases = [
    "正在凝神聚气...",
    "观测星辰轨迹...",
    "调和阴阳笔触...",
    "绘制灵动神韵...",
    "正在唤醒祥瑞之兆..."
  ];

  useEffect(() => {
    if (!prompt.trim()) {
      setSuggestions(["聚宝盆", "紫气东来", "正缘桃花", "步步高升"]);
      return;
    }

    const words = prompt.split(/[，。,.\s]/);
    const lastWord = words[words.length - 1];

    if (lastWord.length >= 1) {
      const filtered = metaphysicalDictionary
        .filter(term => term.includes(lastWord) && term !== lastWord)
        .slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions(["祥云", "金蟾", "八卦", "灵光"]);
    }
  }, [prompt]);

  const handleSuggestionClick = (word: string) => {
    const words = prompt.split(/[，。,.\s]/);
    words[words.length - 1] = word;
    const newPrompt = words.join(' ') + ' ';
    setPrompt(newPrompt);
    textareaRef.current?.focus();
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedImageUrl(null);
    
    let phraseIdx = 0;
    const phraseInterval = setInterval(() => {
      setLoadingText(loadingPhrases[phraseIdx % loadingPhrases.length]);
      phraseIdx++;
    }, 2000);

    try {
      // 核心修复：从 Vite 环境变量读取 Key
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key 未配置，请在 Vercel 环境变量中设置 VITE_GEMINI_API_KEY");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      // 注意：请确保您使用的模型名称正确，Gemini 2.0 图像模型通常为 'imagen-3.0-generate-001' 或类似
      // 这里保持您原有逻辑但修正 SDK 调用方式
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

      const fullPrompt = `${selectedStyle.prompt}, ${prompt}, masterpiece, 8k resolution, highly detailed, professional art, mystical atmosphere, auspicious elements`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      
      // 注意：Gemini 原生 SDK 返回的是文本，若要生成图片通常需调用特定的 Imagen API
      // 如果您的环境支持 inlineData 图片返回，逻辑如下：
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts?.[0]?.inlineData) {
          const base64Data = candidate.content.parts[0].inlineData.data;
          setGeneratedImageUrl(`data:image/png;base64,${base64Data}`);
      } else {
          // 兜底提示：如果模型只返回了描述而没返回图片
          console.warn("AI 返回了内容但未包含图片数据");
          alert("显化失败：当前模型未返回图像数据，请检查模型配置。");
      }

    } catch (error: any) {
      console.error("Image generation failed:", error);
      alert(`分析失败: ${error.message || "灵感瞬间断开，请稍后再试。"}`);
    } finally {
      clearInterval(phraseInterval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32 px-5 pt-12 animate-fade-in-up">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="size-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
          <span className="material-symbols-outlined notranslate">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">AI Creator</span>
          <h2 className="text-xl font-black tracking-tight">AI 灵境</h2>
        </div>
        <div className="size-10"></div>
      </header>

      <main className="space-y-8 max-w-md mx-auto">
        <section className="bg-surface/50 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden transition-all duration-500 focus-within:ring-2 focus-within:ring-primary/20">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-6xl notranslate">brush</span>
           </div>
           
           <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
             <span className="material-symbols-outlined text-sm notranslate text-primary">edit_note</span>
             描述您的灵感
           </h3>
           
           <textarea 
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="例如：财源滚滚之象..."
            className="w-full bg-black/30 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-0 placeholder:text-white/10 min-h-[140px] outline-none transition-all resize-none shadow-inner disabled:opacity-50"
           />

           <div className={`mt-4 transition-opacity duration-300 ${isGenerating ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 px-1">智能灵感建议</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((word, idx) => (
                  <button 
                    key={word}
                    onClick={() => handleSuggestionClick(word)}
                    disabled={isGenerating}
                    className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold hover:bg-primary hover:text-white transition-all active:scale-90 flex items-center gap-1.5 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <span className="material-symbols-outlined text-[14px] notranslate">auto_fix_high</span>
                    {word}
                  </button>
                ))}
              </div>
           </div>

           <div className={`flex gap-2 overflow-x-auto no-scrollbar py-4 border-t border-white/5 mt-4 transition-opacity duration-300 ${isGenerating ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              {presets.map(p => (
                <button 
                  key={p} 
                  onClick={() => setPrompt(p)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-white/40 whitespace-nowrap hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
           </div>
        </section>

        <section className={`space-y-4 transition-opacity duration-300 ${isGenerating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-xs font-black text-white/40 uppercase tracking-widest px-2">选择画风</h3>
          <div className="grid grid-cols-2 gap-3">
             {styles.map(s => (
               <button 
                key={s.id}
                onClick={() => setSelectedStyle(s)}
                disabled={isGenerating}
                className={`p-5 rounded-[2rem] border transition-all text-left relative overflow-hidden group ${selectedStyle.id === s.id ? 'bg-primary/20 border-primary shadow-[0_10px_30px_rgba(236,19,236,0.15)]' : 'bg-surface/40 border-white/5 opacity-60 hover:opacity-100'}`}
               >
                 <span className={`text-xs font-black ${selectedStyle.id === s.id ? 'text-primary' : 'text-white/80'}`}>{s.name}</span>
                 <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-4xl notranslate">style</span>
                 </div>
               </button>
             ))}
          </div>
        </section>

        <section className={`space-y-4 transition-opacity duration-300 ${isGenerating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-xs font-black text-white/40 uppercase tracking-widest px-2">画布比例</h3>
          <div className="flex gap-4">
             {['1:1', '9:16', '16:9'].map(ratio => (
               <button 
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                disabled={isGenerating}
                className={`flex-1 h-14 rounded-2xl border transition-all flex items-center justify-center gap-2 ${aspectRatio === ratio ? 'bg-white/10 border-white/40 text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/20'}`}
               >
                 <div className={`border-2 border-current opacity-40 transition-all ${ratio === '1:1' ? 'size-4' : ratio === '9:16' ? 'w-3 h-5' : 'w-5 h-3'}`}></div>
                 <span className="text-[10px] font-black">{ratio}</span>
               </button>
             ))}
          </div>
        </section>

        {(isGenerating || generatedImageUrl) && (
          <section className="relative aspect-square w-full max-w-[400px] mx-auto rounded-[3.5rem] overflow-hidden bg-surface/50 border border-white/10 shadow-inner flex flex-col items-center justify-center animate-fade-in-up">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-6 p-10 text-center">
                 <div className="relative size-24">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-primary border-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="material-symbols-outlined text-primary text-4xl animate-pulse notranslate">auto_awesome</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-white font-black text-lg tracking-widest animate-pulse">{loadingText}</h4>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">正在调配灵气...</p>
                 </div>
              </div>
            ) : generatedImageUrl ? (
              <div className="relative size-full group">
                <img src={generatedImageUrl} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" alt="AI Generated" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button className="size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90">
                      <span className="material-symbols-outlined notranslate">download</span>
                   </button>
                   <button className="size-14 rounded-full bg-primary border border-white/20 flex items-center justify-center shadow-xl shadow-primary/40 active:scale-90 transition-all">
                      <span className="material-symbols-outlined notranslate">share</span>
                   </button>
                </div>
              </div>
            ) : null}
          </section>
        )}

        <div className="fixed bottom-10 left-5 right-5 z-20">
          <div className="max-w-md mx-auto">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`w-full h-18 bg-mystic-gradient rounded-[2.2rem] text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(236,19,236,0.4)] transition-all duration-300 
                ${isGenerating ? 'opacity-90 scale-[0.98]' : 'active:scale-95 hover:shadow-[0_25px_60px_rgba(236,19,236,0.5)]'} 
                disabled:grayscale disabled:cursor-not-allowed`}
            >
              <span className={`material-symbols-outlined notranslate ${isGenerating ? 'animate-spin' : ''}`}>
                {isGenerating ? 'progress_activity' : 'magic_button'}
              </span>
              {isGenerating ? '正在显化中...' : '一键显化奇象'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiCanvas;
