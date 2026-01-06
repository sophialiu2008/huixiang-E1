import React, { useEffect } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip,
  YAxis
} from 'recharts';
import { AnalysisResult } from '../types.ts'; // 确保路径正确

interface ReportProps {
  data: AnalysisResult;
  onClose: () => void;
}

// 自定义图表悬停提示组件
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl animate-fade-in-up">
        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{label || payload[0].name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-white">{payload[0].value}</span>
          <span className="text-[10px] font-bold text-white/40">分</span>
        </div>
      </div>
    );
  }
  return null;
};

const Report: React.FC<ReportProps> = ({ data, onClose }) => {
  // 进入报告时自动滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col pb-44 min-h-screen bg-background text-white">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-12 pb-4 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={onClose} className="flex size-10 items-center justify-center rounded-full bg-white/5 border border-white/10 active:scale-90 transition-all">
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <h1 className="text-white text-lg font-black tracking-tight">面相深度报告</h1>
        <button className="flex size-10 items-center justify-center rounded-full bg-white/5 border border-white/10 active:scale-90 transition-all">
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
      </header>

      {/* 填充项，防止内容被 Header 遮挡 */}
      <div className="h-28"></div>

      <main className="px-5 flex flex-col gap-8 animate-fade-in-up">
        {/* 1. 全息透视视觉图 */}
        <section className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-white/5">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" alt="Face Map" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <p className="text-primary font-black text-[10px] tracking-[0.4em] uppercase mb-2">Biometric Analysis</p>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tighter">面部全息<br/>能量映射</h2>
          </div>
          <div className="absolute top-6 right-6 flex flex-col items-end gap-1">
             <div className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#ec13ec]"></div>
             <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Live Syncing</span>
          </div>
        </section>

        {/* 2. 综合评分与雷达图 */}
        <section className="rounded-[2.8rem] p-[1.5px] bg-mystic-gradient shadow-2xl shadow-primary/10">
          <div className="bg-[#1a0b1a] rounded-[2.7rem] p-8 flex flex-col items-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
            
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Overall Mystic Score</p>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-7xl font-black text-transparent bg-clip-text bg-mystic-gradient tracking-tighter">{data.score || 0}</span>
              <span className="text-xl text-white/40 font-black italic">PTS</span>
            </div>
            
            <p className="text-white/60 text-sm text-center leading-relaxed font-medium mb-8 px-2">
              {data.description}
            </p>

            {/* 核心修复：外层固定高度容器 */}
            <div className="w-full h-72">
              {data.radarData && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Radar 
                      name="分值" 
                      dataKey="A" 
                      stroke="#ec13ec" 
                      strokeWidth={2}
                      fill="#ec13ec" 
                      fillOpacity={0.2} 
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationBegin={300}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* 3. 典籍印证 */}
        {data.citations && data.citations.length > 0 && (
          <section className="relative rounded-[2.8rem] p-8 bg-surface/40 border border-white/5 overflow-hidden">
            <h3 className="text-secondary text-[10px] font-black tracking-[0.4em] flex items-center gap-2 mb-8 uppercase">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              Ancient Wisdom
            </h3>
            <div className="space-y-10">
              {data.citations.map((cite, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-secondary/40 via-secondary/5 to-transparent"></div>
                  <div className="flex flex-col gap-4">
                    <span className="text-[9px] w-fit font-black text-secondary/80 bg-secondary/10 px-2.5 py-1 rounded-lg border border-secondary/10 uppercase tracking-widest">
                      {cite.source}
                    </span>
                    <p className="text-xl font-black text-white leading-snug italic tracking-tight">“{cite.quote}”</p>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <p className="text-xs text-white/40 leading-relaxed font-medium">{cite.interpretation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. 三庭比例测量 */}
        {data.sanTing && (
          <section className="bg-surface/30 border border-white/5 rounded-[2.8rem] p-8">
             <h3 className="text-white text-lg font-black mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-mystic-gradient rounded-full"></div>
              三庭比例测量
            </h3>
            <div className="flex justify-between gap-6">
              {data.sanTing.map((ting, i) => (
                <div key={i} className="flex flex-col items-center gap-4 flex-1 group">
                  <span className="text-[10px] font-black text-white/20 group-hover:text-primary transition-colors">{ting.value.toFixed(2)}</span>
                  <div className="w-full bg-black/40 rounded-[1.5rem] relative overflow-hidden h-32 border border-white/5">
                    <div 
                      className="absolute bottom-0 w-full bg-mystic-gradient opacity-40 rounded-t-[1.5rem] transition-all duration-[1.5s] ease-out shadow-[0_0_20px_rgba(236,19,236,0.2)]" 
                      style={{ height: `${ting.percent}%`, transitionDelay: `${i * 200}ms` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] font-black text-white/60">{ting.percent}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{ting.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. 流年运势曲线 */}
        <section className="bg-surface/30 border border-white/5 rounded-[2.8rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white text-lg font-black">流年运势走向</h3>
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">Prediction</span>
          </div>
          {/* 核心修复：外层固定高度容器 */}
          <div className="w-full h-56">
            {data.fortuneTrend && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.fortuneTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLuck" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec13ec" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ec13ec" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="age" 
                    tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700}} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#ec13ec" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorLuck)" 
                    isAnimationActive={true}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* 6. AI 开运建议 */}
        <section className="bg-surface/30 border border-white/5 rounded-[2.8rem] p-8 mb-4">
          <h3 className="text-white text-lg font-black mb-6">AI 开运锦囊</h3>
          <div className="space-y-4">
            {data.advices.map((advice, i) => (
              <div key={i} className="flex gap-5 bg-white/5 p-5 rounded-[2rem] border border-white/5 active:scale-[0.98] transition-all group">
                <div className="shrink-0 size-14 rounded-2xl bg-[#1a0b1a] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-[28px]">{advice.icon}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-white font-black text-sm flex items-center gap-2 mb-1">
                    {advice.title}
                    <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{advice.tag}</span>
                  </h4>
                  <p className="text-white/30 text-[11px] leading-relaxed font-medium">{advice.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 免责声明 */}
        <section className="px-6 py-10 opacity-30 text-center">
          <p className="text-[10px] font-bold leading-relaxed">
            * 本报告由慧相 AI 命理引擎生成。分析结果仅供娱乐参考，不作为人生重大决策的唯一依据。
          </p>
        </section>
      </main>

      {/* 底部固定操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-10 z-[60]">
        <div className="absolute inset-0 bg-[#120812]/80 backdrop-blur-2xl border-t border-white/5 shadow-[0_-20px_40px_rgba(0,0,0,0.4)]"></div>
        <div className="relative flex gap-4 max-w-md mx-auto">
          <button className="flex-1 bg-white/5 h-16 rounded-[1.8rem] font-black text-xs text-white/60 uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">download</span>保存
          </button>
          <button className="flex-[2] bg-mystic-gradient h-16 rounded-[1.8rem] font-black text-base text-white shadow-2xl shadow-primary/30 active:scale-95 transition-all">
            生成完整命书
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
