
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface CalendarEvent {
  id: string;
  content: string;
  time: string;
  type: 'general' | 'luck';
}

interface CalendarProps {
  onBack: () => void;
}

interface AIReport {
  summary: string;
  energyScore: number;
  bestHours: { time: string; activity: string; luck: string }[];
  strategicAdvice: string[];
  elementalBalance: { element: string; power: number }[];
}

const Calendar: React.FC<CalendarProps> = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEventContent, setNewEventContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // AI 报告相关状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [report, setReport] = useState<AIReport | null>(null);

  const steps = [
    "正在观测星宿排列...",
    "正在推算干支能量场...",
    "正在比对《通胜》古籍...",
    "正在结合您的行程进行推演...",
    "AI 命理模型正在生成最终建议..."
  ];

  // 格式化日期 key: YYYY-MM-DD
  const dateKey = useMemo(() => {
    return selectedDate.toISOString().split('T')[0];
  }, [selectedDate]);

  const storageKey = `huixiang_calendar_events_${dateKey}`;

  // 获取该日期的黄历数据
  const luckInfo = useMemo(() => {
    const seed = selectedDate.getDate() + selectedDate.getMonth() * 31;
    const items = ['嫁娶', '开市', '搬迁', '出行', '祈福', '安床', '祭祀', '动土', '交易', '求医'];
    const avoids = ['针灸', '掘井', '词讼', '修坟', '安葬', '经络', '破屋', '纳畜', '乘船'];
    
    const getLuck = (list: string[]) => {
      const count = (seed % 3) + 2;
      return list.slice(seed % list.length, (seed % list.length) + count).join('、');
    };

    return {
      auspicious: getLuck(items),
      inauspicious: getLuck(avoids),
      ganzhi: ['甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉'][seed % 10]
    };
  }, [selectedDate]);

  useEffect(() => {
    const savedEvents = localStorage.getItem(storageKey);
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        setEvents([]);
      }
    } else {
      setEvents([]);
    }
  }, [storageKey]);

  const saveToStorage = (updatedEvents: CalendarEvent[]) => {
    setEvents(updatedEvents);
    localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
  };

  const handleAddEvent = () => {
    if (!newEventContent.trim()) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      content: newEventContent,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      type: 'general'
    };
    saveToStorage([newEvent, ...events]);
    setNewEventContent('');
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    saveToStorage(events.filter(e => e.id !== id));
  };

  const generateAIReport = async () => {
    setIsGenerating(true);
    setGenerationStep(0);
    
    // 模拟进度
    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `作为一个精通东方命理与西方占星的 AI 择日大师，请分析以下日期并生成深度报告：
      日期：${dateKey} (${luckInfo.ganzhi}年)
      当日宜：${luckInfo.auspicious}
      当日忌：${luckInfo.inauspicious}
      用户预定计划：${events.map(e => `${e.time} - ${e.content}`).join('; ')}
      
      请生成一个结构化的 JSON 报告，包含：
      1. summary: 一段富有洞察力的总结。
      2. energyScore: 1-100 的今日能量评分。
      3. bestHours: 3个最佳时段（含时间、建议活动、开运理由）。
      4. strategicAdvice: 3条针对当日的行动策略。
      5. elementalBalance: 五行能量分布（金、木、水、火、土）。
      
      语言：中文。`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              energyScore: { type: Type.NUMBER },
              bestHours: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    luck: { type: Type.STRING }
                  }
                }
              },
              strategicAdvice: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              elementalBalance: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    element: { type: Type.STRING },
                    power: { type: Type.NUMBER }
                  }
                }
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text);
      setReport(result);
    } catch (error) {
      console.error("AI Report generation failed", error);
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  if (report) {
    return (
      <div className="min-h-screen bg-background text-white pb-32 px-5 pt-12 animate-fade-in-up">
        <header className="flex items-center justify-between mb-8">
          <button onClick={() => setReport(null)} className="size-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">AI Report</span>
            <h2 className="text-xl font-black">智算择日全息报告</h2>
          </div>
          <button className="size-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined">share</span>
          </button>
        </header>

        <main className="space-y-6">
          <section className="bg-surface/50 border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-mystic-gradient opacity-5 blur-3xl"></div>
             <div className="relative z-10 flex flex-col items-center">
                <div className="size-24 rounded-full border-4 border-primary/20 p-2 mb-4">
                  <div className="size-full rounded-full bg-mystic-gradient flex items-center justify-center text-4xl font-black">
                    {report.energyScore}
                  </div>
                </div>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-4">今日能量场强度</p>
                <p className="text-base text-white/80 leading-relaxed font-medium italic">“{report.summary}”</p>
             </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2 px-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              吉时精选
            </h3>
            <div className="grid gap-3">
              {report.bestHours.map((hour, i) => (
                <div key={i} className="bg-surface/30 border border-white/5 rounded-3xl p-5 flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                    {hour.time}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white mb-0.5">{hour.activity}</h4>
                    <p className="text-[10px] text-white/40 font-medium">{hour.luck}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface/40 border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-400">psychology</span>
              行动锦囊
            </h3>
            <div className="space-y-4">
              {report.strategicAdvice.map((advice, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-primary font-black">0{i+1}.</span>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">{advice}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface/40 border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-black mb-6">五行能量分布</h3>
            <div className="flex justify-between items-end h-32 px-4">
              {report.elementalBalance.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-full">
                  <div 
                    className="w-4 bg-mystic-gradient rounded-full transition-all duration-1000" 
                    style={{ height: `${item.power}%` }}
                  ></div>
                  <span className="text-[10px] font-black text-white/40">{item.element}</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        <div className="fixed bottom-10 left-5 right-5">
           <button onClick={() => setReport(null)} className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-white/60 font-black text-sm uppercase tracking-widest">返回日历</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-5 pb-32 bg-background relative overflow-hidden">
      {/* 加载动画层 */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-2xl flex flex-col items-center justify-center p-10 animate-fade-in-up">
          <div className="relative size-32 mb-10">
            <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-primary border-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl animate-pulse">auto_awesome</span>
            </div>
          </div>
          <div className="space-y-4 w-full max-w-xs text-center">
            <h3 className="text-white font-black text-lg tracking-widest h-8">{steps[generationStep]}</h3>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-mystic-gradient transition-all duration-500 shadow-[0_0_15px_#ec13ec]" 
                style={{ width: `${((generationStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">慧相 AI 计算引擎</p>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between py-8">
        <button onClick={onBack} className="size-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-white/60">arrow_back</span>
        </button>
        <h1 className="text-xl font-black tracking-tight">择日黄历</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="size-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 text-primary active:scale-90 transition-transform">
          <span className="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
        </button>
      </header>

      {/* 周选择器 */}
      <section className="flex justify-between items-center mb-8 px-1 overflow-x-auto no-scrollbar gap-4">
        {weekDates.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <button 
              key={i}
              onClick={() => setSelectedDate(new Date(date))}
              className={`flex flex-col items-center min-w-[50px] py-4 rounded-2xl transition-all border ${
                isSelected 
                ? 'bg-mystic-gradient border-transparent text-white shadow-lg shadow-primary/30 scale-110 z-10' 
                : 'bg-white/5 border-white/5 text-white/40'
              }`}
            >
              <span className="text-[10px] font-bold uppercase mb-1 opacity-60">
                {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]}
              </span>
              <span className="text-lg font-black">{date.getDate()}</span>
              {isToday && !isSelected && <div className="size-1 bg-primary rounded-full mt-1"></div>}
            </button>
          );
        })}
      </section>

      {/* 核心卡片 */}
      <section key={dateKey} className="relative overflow-hidden rounded-[3rem] bg-surface/80 backdrop-blur-3xl p-8 shadow-2xl border border-white/5 mb-8 animate-fade-in-up">
        <div className="absolute top-0 right-0 p-6">
          <span className="text-8xl font-black text-white/5 select-none">{luckInfo.ganzhi[1]}</span>
        </div>
        <div className="flex flex-col items-center text-center relative z-10">
          <span className="text-primary font-bold tracking-[0.4em] uppercase mb-4 text-[10px]">Auspicious Divine</span>
          <h2 className="text-7xl font-black mb-2 text-white tracking-tighter">{selectedDate.getDate()}</h2>
          <p className="text-white/40 text-sm font-bold mb-8 uppercase tracking-widest">
            {selectedDate.toLocaleDateString('zh-CN', { month: 'long' })} · {luckInfo.ganzhi}年
          </p>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-emerald-500/10 border border-emerald-500/10 rounded-[2rem] p-5 flex flex-col items-center group hover:bg-emerald-500/15 transition-colors">
              <div className="size-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-emerald-400 text-sm">check</span>
              </div>
              <span className="text-[10px] font-black text-emerald-400/60 tracking-widest uppercase mb-1">宜</span>
              <p className="text-xs font-bold text-white/80 leading-relaxed">{luckInfo.auspicious}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/10 rounded-[2rem] p-5 flex flex-col items-center group hover:bg-red-500/15 transition-colors">
              <div className="size-8 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-red-400 text-sm">close</span>
              </div>
              <span className="text-[10px] font-black text-red-400/60 tracking-widest uppercase mb-1">忌</span>
              <p className="text-xs font-bold text-white/80 leading-relaxed">{luckInfo.inauspicious}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 添加日程表单 */}
      {showAddForm && (
        <div className="mb-8 animate-fade-in-up">
          <div className="bg-glass-panel border border-primary/20 rounded-[2.5rem] p-6 shadow-2xl">
            <h4 className="text-sm font-bold mb-4 text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">auto_awesome_motion</span>
              为此日添上一份气运计划
            </h4>
            <div className="flex gap-3">
              <input 
                type="text" 
                autoFocus
                value={newEventContent}
                onChange={(e) => setNewEventContent(e.target.value)}
                placeholder="例如：亥时于东方冥想..."
                className="flex-1 bg-black/30 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-white/10 outline-none transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
              />
              <button 
                onClick={handleAddEvent}
                className="size-14 bg-mystic-gradient rounded-2xl text-white shadow-lg active:scale-90 transition-transform flex items-center justify-center"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 日程列表 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black text-white/90">我的日程</h3>
          {events.length > 0 && (
            <button onClick={() => saveToStorage([])} className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] hover:text-red-400 transition-colors">Clear Day</button>
          )}
        </div>

        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className="bg-surface/40 border border-white/5 rounded-[2rem] p-5 flex items-center justify-between group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                    <span className="material-symbols-outlined text-primary/40 text-[22px]">auto_stories</span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-bold leading-relaxed">{event.content}</p>
                    <span className="text-[10px] text-white/20 font-bold mt-1 block uppercase tracking-tighter">{event.time}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-white/10 hover:text-red-400"
                >
                  <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <span className="material-symbols-outlined text-6xl mb-4 font-light">history_edu</span>
            <p className="text-xs font-black uppercase tracking-widest">此日尚无计划</p>
          </div>
        )}
      </section>

      {/* 底部按钮 */}
      <div className="fixed bottom-32 left-0 right-0 px-5 pointer-events-none">
        <button 
          onClick={generateAIReport}
          className="w-full h-16 rounded-[2rem] bg-mystic-gradient shadow-2xl shadow-primary/40 text-white font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all pointer-events-auto"
        >
          <span className="material-symbols-outlined">magic_button</span>
          AI 智能生成择日报告
        </button>
      </div>
    </div>
  );
};

export default Calendar;
