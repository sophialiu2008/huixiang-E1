
import React, { useState } from 'react';

interface TopicDetail {
  id: string;
  title: string;
  subTitle: string;
  icon: string;
  color: string;
  desc: string;
  stats: { 
    label: string; 
    value: string; 
    trend: string; 
    numericValue: number;
    details?: string; 
    advice?: string; 
    trendData?: number[]; 
  }[];
  tag: string;
}

interface DiscoverProps {
  onStartDeepAnalysis: (topic: string) => void;
}

const Discover: React.FC<DiscoverProps> = ({ onStartDeepAnalysis }) => {
  const [activeCategory, setActiveCategory] = useState('财帛宫');
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const topics: TopicDetail[] = [
    {
      id: 'wealth',
      title: '财帛宫',
      subTitle: 'Wealth & Assets',
      icon: 'payments',
      color: 'orange',
      desc: '分析鼻翼丰满度、准头色泽及地库宽厚，预测近期正财与偏财走势。',
      stats: [
        { 
          label: '守财能力', 
          value: '82%', 
          trend: 'Stable', 
          numericValue: 82, 
          details: '检测到鼻翼基底稳固且收摄有力，配合法令纹环抱，预示着极强的资产留存能力，近期能有效抵御非理性消费冲动。',
          advice: 'AI 财富建议：您的守财格局稳健。建议配置 45% 稳健债权，35% 指数底仓，20% 用于高潜赛道博弈。近期需警惕“熟人社交”带来的盲目投资风险，保持现金流弹性。',
          trendData: [60, 65, 80, 78, 82]
        },
        { 
          label: '偏财机遇', 
          value: 'High', 
          trend: 'Rising', 
          numericValue: 90, 
          details: '准头色泽明润，与印堂黄明之色交相辉映，预示未来7日内将有意外之喜。',
          advice: '建议：适合关注新兴赛道投资或副业变现。',
          trendData: [40, 55, 70, 85, 90]
        }
      ],
      tag: '财富密钥'
    },
    {
      id: 'romance',
      title: '桃花运',
      subTitle: 'Romance & Love',
      icon: 'favorite',
      color: 'pink',
      desc: '通过眼角夫妻宫、卧蚕饱满度及面部色气，解读您的正缘时机与情感粘度。',
      stats: [
        { label: '人缘指数', value: '94%', trend: 'Peak', numericValue: 94, details: '卧蚕红润饱满，近期社交魅力极高，宜多参与聚会。' },
        { label: '脱单概率', value: '68%', trend: 'Mid', numericValue: 68, details: '夫妻宫略有阴影，需注意沟通技巧，避免小误会。' }
      ],
      tag: '情缘洞察'
    },
    {
      id: 'life',
      title: '生命线',
      subTitle: 'Vitality & Health',
      icon: 'vital_signs',
      color: 'emerald',
      desc: '结合手相地纹深度、长度及面部人中轮廓，评估先天体质与后天精力值。',
      stats: [
        { label: '能量状态', value: '75%', trend: 'Healthy', numericValue: 75, details: '地纹深长，生命力旺盛，建议保持规律作息以维持高能。' },
        { label: '抗压等级', value: 'Strong', trend: 'Elite', numericValue: 85, details: '手掌肉厚如绵，心理韧性极强，适合应对高强度挑战。' }
      ],
      tag: '生命能量'
    },
    {
      id: 'career',
      title: '事业',
      subTitle: 'Career & Power',
      icon: 'work_history',
      color: 'blue',
      desc: '观测额头官禄宫宽平度、印堂明亮度，预测职业晋升与贵人相助时机。',
      stats: [
        { 
          label: '晋升空间', 
          value: '15%', 
          trend: 'Potential', 
          numericValue: 15,
          details: '官禄宫目前略显沉郁，建议深耕专业技能，待印堂明亮时再图跨越式晋升。'
        },
        { 
          label: '决策力', 
          value: '89%', 
          trend: 'Solid', 
          numericValue: 89,
          details: '眉骨坚挺，决策果断且具备远见。近期职场重大决策将有贵人从旁指点，胜算极大。'
        }
      ],
      tag: '职场宏图'
    }
  ];

  const currentTopic = topics.find(t => t.title === activeCategory) || topics[0];

  return (
    <div className="flex flex-col gap-8 px-6 pb-40 pt-10 min-h-screen bg-[#f4f7fa] text-slate-900">
      <header className="flex flex-col gap-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Knowledge Explore</p>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">智慧探索</h1>
      </header>

      {/* 搜索框 */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-400 text-[22px] group-focus-within:text-primary transition-colors">search</span>
        </div>
        <input 
          type="text" 
          placeholder="搜索面相、手相或运势秘籍..." 
          className="w-full h-16 bg-white/70 backdrop-blur-md border border-white rounded-[2rem] pl-14 pr-6 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-[0_15px_40px_-10px_rgba(148,163,184,0.15)] outline-none"
        />
      </div>

      {/* 切换标签 */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {topics.map((t) => (
          <button 
            key={t.id}
            onClick={() => {
              setActiveCategory(t.title);
              setHoveredStat(null);
            }}
            className={`px-7 py-3 rounded-[1.5rem] text-xs font-black shrink-0 transition-all border shadow-sm ${activeCategory === t.title ? 'bg-primary text-white border-transparent shadow-[0_10px_25px_-5px_rgba(236,19,236,0.3)] scale-105 z-10' : 'bg-white border-white text-slate-400 hover:bg-slate-50'}`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* 专题卡片 - Soft Neumorphism & Deep Shadows */}
      <section className={`relative overflow-hidden rounded-[3.5rem] bg-white border border-white shadow-[0_45px_100px_-20px_rgba(148,163,184,0.25)] hover:shadow-[0_55px_120px_-25px_rgba(236,19,236,0.15)] p-10 group transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]`}>
        <div className="absolute -top-12 -right-12 opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-0 pointer-events-none">
          <span className="material-symbols-outlined text-[300px]">{currentTopic.icon}</span>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-10">
            <div className={`size-20 rounded-[2rem] bg-${currentTopic.color}-400/10 flex items-center justify-center border border-${currentTopic.color}-400/20 shadow-[inset_0_4px_10px_rgba(255,255,255,0.8)]`}>
              <span className={`material-symbols-outlined text-${currentTopic.color}-500 text-[40px]`}>{currentTopic.icon}</span>
            </div>
            <div>
              <span className={`text-[11px] font-black text-${currentTopic.color}-500/80 uppercase tracking-[0.25em]`}>{currentTopic.tag}</span>
              <h2 className="text-3xl font-black text-slate-800 leading-none mt-1.5">{currentTopic.title} <span className="text-sm font-medium text-slate-300 ml-2 tracking-normal">{currentTopic.subTitle}</span></h2>
            </div>
          </div>

          <p className="text-slate-500 text-base leading-relaxed mb-12 font-medium max-w-[95%]">
            {currentTopic.desc}
          </p>

          {/* 可视化统计区域 */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {currentTopic.stats.map((s, i) => (
              <div 
                key={i} 
                className={`bg-[#fdfdff] rounded-[2.5rem] p-7 border border-white shadow-[inset_0_4px_10px_rgba(255,255,255,0.8),0_20px_45px_-15px_rgba(148,163,184,0.12)] flex flex-col items-center text-center transition-all duration-500 relative overflow-hidden cursor-help group/stat ${hoveredStat === i ? 'translate-y-[-6px] shadow-[0_30px_60px_-20px_rgba(148,163,184,0.22)]' : ''}`}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                {/* 悬停详情层 */}
                <div className={`absolute inset-0 bg-white/95 backdrop-blur-2xl p-7 flex flex-col justify-start items-center text-center transition-all duration-500 z-20 ${hoveredStat === i ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className={`size-10 rounded-xl bg-${currentTopic.color}-500/10 flex items-center justify-center`}>
                       <span className={`material-symbols-outlined text-${currentTopic.color}-500 text-lg`}>insights</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">维度深度剖析</span>
                  </div>
                  
                  {s.trendData && (
                    <div className="w-full h-12 flex items-end justify-center gap-2 mb-6 px-4">
                       {s.trendData.map((val, idx) => (
                         <div 
                           key={idx} 
                           className={`flex-1 rounded-t-lg bg-${currentTopic.color}-500/20 transition-all duration-700 ease-out`}
                           style={{ height: `${val}%`, transitionDelay: `${idx * 70}ms` }}
                         >
                           {idx === s.trendData.length - 1 && <div className={`w-full h-2 bg-${currentTopic.color}-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]`}></div>}
                         </div>
                       ))}
                    </div>
                  )}

                  <p className="text-[10px] font-bold text-slate-600 leading-relaxed mb-5">
                    {s.details}
                  </p>
                  
                  {s.advice && (
                    <div className={`mt-auto bg-${currentTopic.color}-50/90 rounded-[1.5rem] p-4 border border-${currentTopic.color}-100 w-full shadow-sm`}>
                       <p className={`text-[10px] font-bold text-${currentTopic.color}-600 leading-relaxed`}>{s.advice}</p>
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 block w-full text-left ml-1">{s.label}</span>
                
                <div className="relative w-full h-32 mb-8 flex items-center justify-center">
                  <div className="relative size-28 group/ring">
                    <svg className="size-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={301.6}
                        strokeDashoffset={301.6 - (301.6 * s.numericValue) / 100}
                        strokeLinecap="round"
                        className={`text-${currentTopic.color}-500 transition-all duration-[1.8s] ease-[cubic-bezier(0.34,1.56,0.64,1)] drop-shadow-[0_0_8px_rgba(0,0,0,0.05)]`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-800 tracking-tighter">{s.value}</span>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${s.trend === 'Rising' || s.trend === 'Peak' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                  <span className={`material-symbols-outlined text-[16px] font-bold`}>
                    {s.trend === 'Rising' ? 'trending_up' : s.trend === 'Stable' ? 'horizontal_rule' : 'trending_up'}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest`}>
                    {s.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onStartDeepAnalysis(currentTopic.title)}
            className={`w-full h-18 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 text-base font-black text-slate-800 shadow-[0_15px_40px_-10px_rgba(148,163,184,0.25)] hover:shadow-[0_25px_50px_-10px_rgba(236,19,236,0.2)] hover:translate-y-[-4px] active:translate-y-[1px] transition-all duration-300 group/btn overflow-hidden relative`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${currentTopic.color}-400/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000`}></div>
            开启{currentTopic.title}深度分析 
            <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1.5 transition-transform">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* 术语百科 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-3">
          <h3 className="text-2xl font-bold text-slate-800">术语百科</h3>
          <button className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">浏览全部</button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <TermCard title="垂珠" desc="象征晚年福气与财运的积累。" icon="face_retouching_natural" color="orange" />
          <TermCard title="印堂" desc="双眉之间，主近期心境与运势总览。" icon="flare" color="purple" />
          <TermCard title="地库" desc="腮骨下方，代表不动产与下属缘分。" icon="home_pin" color="blue" />
        </div>
      </section>

      {/* 底部Banner */}
      <section className="mt-8">
        <div onClick={() => onStartDeepAnalysis('综合运势')} className="bg-white border border-white rounded-[3.5rem] p-12 flex items-center gap-10 shadow-[0_25px_70px_-20px_rgba(148,163,184,0.18)] hover:shadow-[0_40px_90px_-25px_rgba(236,19,236,0.12)] overflow-hidden relative group cursor-pointer transition-all duration-700">
          <div className="flex-1 relative z-10">
            <span className="text-[11px] font-black text-primary uppercase tracking-[0.35em] mb-4 block">Personalized Insight</span>
            <h4 className="text-3xl font-black text-slate-800 mb-4 group-hover:text-primary transition-colors leading-tight tracking-tight">定制您的命理报告</h4>
            <p className="text-base text-slate-400 leading-relaxed font-medium">融合大数据分析与传统相学，为您揭示未知的生命轨迹。</p>
          </div>
          <div className="size-28 rounded-[2.5rem] bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 animate-floating group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-700 shadow-[inset_0_4px_10px_rgba(255,255,255,0.8)]">
            <span className="material-symbols-outlined text-primary text-[56px] drop-shadow-sm">psychology</span>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-12 -left-12 size-56 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
          <div className="absolute top-0 right-0 size-24 bg-orange-400/5 rounded-full blur-2xl"></div>
        </div>
      </section>

      <style>{`
        @keyframes wave {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -120; }
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-floating {
          animation: floating 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const TermCard: React.FC<{ title: string; desc: string; icon: string; color: string }> = ({ title, desc, icon, color }) => (
  <div className="bg-white rounded-[2.5rem] p-7 flex items-center gap-7 border border-white shadow-[0_12px_40px_-10px_rgba(148,163,184,0.1)] hover:shadow-[0_20px_55px_-15px_rgba(148,163,184,0.18)] hover:translate-x-3 transition-all duration-400 cursor-pointer group">
    <div className={`size-16 rounded-[1.25rem] bg-${color}-400/10 flex items-center justify-center border border-${color}-400/10 group-hover:scale-110 transition-transform shadow-inner`}>
      <span className={`material-symbols-outlined text-${color}-500 text-[30px]`}>{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h5 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">{title}</h5>
      <p className="text-[13px] text-slate-400 font-medium line-clamp-1">{desc}</p>
    </div>
    <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all">
       <span className="material-symbols-outlined text-xl">chevron_right</span>
    </div>
  </div>
);

export default Discover;
