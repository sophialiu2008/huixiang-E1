import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"; // 修正引用和类型
import { AnalysisResult, ScanType } from '../types';

interface AnalysisProps {
  type: ScanType;
  initialType?: string;
  onScanComplete: (data: AnalysisResult) => void;
}

type ScanMode = 'camera' | 'photo';

const processingSteps = [
  "正在识别面部关键点...",
  "正在分析三庭五眼比例...",
  "正在检索《麻衣相法》典籍...",
  "正在生成流年运势预测...",
  "正在计算命理综合评分..."
];

const Analysis: React.FC<AnalysisProps> = ({ type, initialType = '综合运势', onScanComplete }) => {
  const [mode, setMode] = useState<ScanMode>('camera');
  const [scanning, setScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeAnalysisType, setActiveAnalysisType] = useState(initialType);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveAnalysisType(initialType);
  }, [initialType]);

  useEffect(() => {
    if (mode === 'camera' && !selectedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, selectedImage]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      setError("无法访问摄像头");
      setMode('photo');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const runAIAnalysis = async (base64Image: string) => {
    try {
      // 核心修复：使用 Vite 环境变量前缀 VITE_
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY is not defined in environment variables");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest", // 修正为稳定的模型名称
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              score: { type: SchemaType.NUMBER },
              description: { type: SchemaType.STRING },
              radarData: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    subject: { type: SchemaType.STRING },
                    A: { type: SchemaType.NUMBER },
                    fullMark: { type: SchemaType.NUMBER }
                  }
                }
              },
              sanTing: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    label: { type: SchemaType.STRING },
                    value: { type: SchemaType.NUMBER },
                    percent: { type: SchemaType.NUMBER },
                    color: { type: SchemaType.STRING }
                  }
                }
              },
              advices: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    icon: { type: SchemaType.STRING },
                    title: { type: SchemaType.STRING },
                    tag: { type: SchemaType.STRING },
                    desc: { type: SchemaType.STRING }
                  }
                }
              },
              citations: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    source: { type: SchemaType.STRING },
                    quote: { type: SchemaType.STRING },
                    interpretation: { type: SchemaType.STRING }
                  }
                }
              },
              fortuneTrend: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    age: { type: SchemaType.STRING },
                    score: { type: SchemaType.NUMBER }
                  }
                }
              }
            }
          }
        }
      });
      
      const prompt = `作为一个专业的东方传统面相分析大师，请深度分析这张人脸。本次分析的主题是：${activeAnalysisType}。
      返回 JSON 格式报告，包含综合评分(score)、核心总结(description)、五维雷达图数据(radarData)、三庭比例(sanTing)、开运建议(advices)、典籍引用(citations)以及运势曲线(fortuneTrend)。返回语言必须为中文。`;

      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" } }
      ]);

      const textResult = result.response.text(); // 修正 text 获取方式
      const parsedData = JSON.parse(textResult);
      onScanComplete({ ...parsedData, type });

    } catch (err: any) {
      console.error("AI Analysis failed:", err);
      setIsProcessing(false);
      setScanning(false);
      alert(`分析失败: ${err.message || "请稍后重试"}`);
    }
  };

  const startScan = async () => {
    const canScan = (mode === 'camera' && stream) || (mode === 'photo' && selectedImage);
    if (!canScan || scanning || isProcessing) return;
    
    setScanning(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setScanning(false);
        setIsProcessing(true);
        
        let stepCount = 0;
        const stepInterval = setInterval(() => {
          stepCount++;
          if (stepCount < processingSteps.length) {
            setCurrentStep(stepCount);
          } else {
            clearInterval(stepInterval);
          }
        }, 1200);

        let imageData = selectedImage;
        if (mode === 'camera' && videoRef.current && canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, -canvas.width, 0);
            imageData = canvas.toDataURL('image/jpeg');
          }
        }
        
        if (imageData) {
          runAIAnalysis(imageData);
        }
      }
    }, 40);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <canvas ref={canvasRef} className="hidden" />
      <header className="flex items-center p-8 justify-between z-20">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">AI Physiognomy</p>
          <h2 className="text-white text-3xl font-black">面相智能分析</h2>
        </div>
        <div className="flex gap-4">
          <button className="size-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 tap-feedback"><span className="material-symbols-outlined text-[20px]">history</span></button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-6 relative">
        <div className="relative w-full aspect-square max-w-[360px] rounded-[3rem] overflow-hidden p-[3px] bg-gradient-to-br from-purple-500 via-primary to-orange-400 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <div className="relative w-full h-full bg-[#0d070d] rounded-[2.8rem] overflow-hidden flex items-center justify-center">
            {mode === 'camera' ? (
              <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-700 ${isProcessing ? 'opacity-30' : 'opacity-100'}`} />
            ) : selectedImage ? (
              <img src={selectedImage} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isProcessing ? 'opacity-30' : 'opacity-100'}`} alt="Selected" />
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-4 cursor-pointer text-center p-8">
                 <span className="material-symbols-outlined text-6xl text-white/10">add_a_photo</span>
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">点击选择图片</p>
              </div>
            )}
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
               <div className="size-full border-[1.5px] border-white/10 rounded-[2.8rem] absolute"></div>
               
               <div className={`w-64 h-80 border-2 border-dashed border-white/20 rounded-[4rem] relative transition-transform duration-700 ${isProcessing ? 'scale-110 opacity-10' : 'scale-100'}`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 flex items-center justify-center">
                     <span className="material-symbols-outlined text-white/40 text-4xl font-light">add</span>
                  </div>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl"></div>
               </div>

               {scanning && (
                  <div className="absolute left-0 w-full h-[3px] bg-primary shadow-[0_0_30px_#ec13ec] animate-scan z-20"></div>
               )}
            </div>

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50 p-8 animate-fade-in-up">
                 <div className="relative size-24 mb-8">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-4 border-b-secondary border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="material-symbols-outlined text-primary text-3xl animate-pulse">psychology</span>
                    </div>
                 </div>
                 
                 <div className="space-y-4 w-full text-center">
                    <h3 className="text-white font-black text-lg tracking-widest animate-pulse">{processingSteps[currentStep]}</h3>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                       <div 
                         className="h-full bg-mystic-gradient rounded-full shadow-[0_0_15px_#ec13ec] transition-all duration-500" 
                         style={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
                       ></div>
                    </div>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">正在使用 Gemini 引擎计算</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {scanning && (
          <div className="w-full max-w-[300px] mt-8 flex flex-col gap-2 items-center">
            <div className="flex justify-between w-full px-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Scanning</span>
              <span className="text-[10px] font-black text-white/60">{progress}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all duration-75" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {!isProcessing && (
          <div className="flex gap-3 mt-8 overflow-x-auto no-scrollbar w-full px-4">
             {['综合运势', '姻缘匹配', '事业前程', '健康运势', '财帛宫'].map((item) => (
               <button 
                 key={item}
                 onClick={() => setActiveAnalysisType(item)}
                 className={`px-6 py-3 rounded-full text-xs font-black shrink-0 transition-all flex items-center gap-2 border ${activeAnalysisType === item ? 'bg-mystic-gradient border-transparent text-white shadow-xl shadow-primary/20' : 'bg-white/5 border-white/10 text-white/40'}`}
               >
                 {item === '综合运势' && <span className="material-symbols-outlined text-[18px]">auto_awesome</span>}
                 {item === '姻缘匹配' && <span className="material-symbols-outlined text-[18px]">favorite</span>}
                 {item}
               </button>
             ))}
          </div>
        )}

        {!isProcessing && (
          <div className="mt-auto mb-32 flex items-center justify-around w-full max-w-sm px-6">
             <div className="flex flex-col items-center gap-2 group cursor-pointer tap-feedback" onClick={() => fileInputRef.current?.click()}>
                <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shadow-inner">
                   <span className="material-symbols-outlined text-[28px]">photo_library</span>
                </div>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">相册</span>
             </div>

             <button 
              onClick={startScan}
              disabled={scanning || (!stream && !selectedImage)}
              className="size-24 rounded-full bg-white p-1.5 shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-90 transition-all relative disabled:opacity-50"
             >
                <div className="size-full rounded-full border-4 border-black/5 flex items-center justify-center relative overflow-hidden">
                   <div className="size-full bg-gradient-to-br from-primary via-primary to-orange-400 rounded-full animate-pulse opacity-20 absolute"></div>
                   <div className="size-16 rounded-full border-2 border-primary flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-primary text-[40px] font-light">camera</span>
                   </div>
                </div>
             </button>

             <div className="flex flex-col items-center gap-2 group cursor-pointer tap-feedback" onClick={() => { setSelectedImage(null); startCamera(); }}>
                <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shadow-inner">
                   <span className="material-symbols-outlined text-[28px]">refresh</span>
                </div>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">重置</span>
             </div>
          </div>
        )}
        
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if(file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              setSelectedImage(ev.target?.result as string);
              setMode('photo');
            };
            reader.readAsDataURL(file);
          }
        }} />
      </div>
    </div>
  );
};

export default Analysis;
