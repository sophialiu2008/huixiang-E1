
import React from 'react';
import { ScanType } from '../types';

interface HomeProps {
  onStartAnalysis: (type: ScanType) => void;
  onOpenCalendar: () => void;
  onOpenAiCanvas: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartAnalysis, onOpenCalendar, onOpenAiCanvas }) => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 · 星期${['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}`;

  return (
    <div className="flex flex-col gap-6 px-6 pb-40 pt-10">
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{dateStr}</p>
          <h1 className="text-3xl font-black text-white tracking-tight">慧眼识人</h1>
        </div>
        <button className="size-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center relative shadow-inner active:scale-95 transition-all">
          <span className="material-symbols-outlined text-white/40 text-[24px] notranslate">notifications</span>
          <span className="absolute top-3 right-3 size-2 bg-primary rounded-full ring-2 ring-background"></span>
        </button>
      </header>

      {/* 每日一卦 - 焦点卡片 */}
      <section className="relative overflow-hidden rounded-[2.8rem] bg-mystic-gradient p-[1.5px] shadow-2xl shadow-primary/10">
        <div className="bg-[#1a0b1a]/95 backdrop-blur-3xl rounded-[2.7rem] p-8 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 p-6 opacity-5 rotate-12">
              <span className="material-symbols-outlined text-[160px] notranslate">token</span>
           </div>
           <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/60 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px] text-primary notranslate">flare</span> 今日卦象
              </span>
           </div>
           <p className="text-primary font-black text-sm mb-2 tracking-widest">乾卦 · 初九</p>
           <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">潜龙勿用</h2>
           <div className="w-12 h-1.5 bg-primary/30 rounded-full mb-6"></div>
           <p className="text-white/50 leading-relaxed text-sm mb-8 font-medium">
             今日宜静思规划，不宜贸然行动。保持低调，积蓄力量，待时而动。
           </p>
           <div className="flex items-center justify-between pt-5 border-t border-white/5">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">AI Mystic Engine</span>
              <div className="flex gap-2">
                <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-white/40 active:scale-90 transition-all"><span className="material-symbols-outlined text-[18px] notranslate">share</span></button>
                <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-white/40 active:scale-90 transition-all"><span className="material-symbols-outlined text-[18px] notranslate">bookmark</span></button>
              </div>
           </div>
        </div>
      </section>

      {/* AI 灵境入口 */}
      <section>
        <button 
          onClick={onOpenAiCanvas}
          className="w-full relative overflow-hidden rounded-[2.5rem] bg-surface/40 p-5 flex items-center gap-5 border border-white/5 shadow-xl group active:scale-[0.98] transition-all"
        >
          <div className="size-16 rounded-[1.8rem] bg-mystic-gradient flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 transform group-hover:rotate-6 transition-transform">
            <span className="material-symbols-outlined text-white text-[32px] notranslate">auto_awesome</span>
          </div>
          <div className="text-left flex-1">
             <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-lg font-black text-white tracking-tight">AI 灵境</h3>
                <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">Pro</span>
             </div>
             <p className="text-xs text-white/30 font-medium">绘制您的开运奇象</p>
          </div>
          <span className="material-symbols-outlined text-white/10 group-hover:text-primary transition-colors notranslate">arrow_forward_ios</span>
        </button>
      </section>

      {/* 今日指数 */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface/30 border border-white/5 rounded-[2.2rem] p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 size-24 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          <div className="size-10 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-blue-400 notranslate">water_drop</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-white tracking-tighter">88</span>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">运势指数</span>
          </div>
        </div>
        <div className="bg-surface/30 border border-white/5 rounded-[2.2rem] p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 size-24 bg-pink-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          <div className="size-10 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-pink-400 notranslate">favorite</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-white tracking-tighter italic">92</span>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">桃花指数</span>
          </div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="mt-2">
        <h3 className="text-lg font-black text-white mb-5 px-1 tracking-tight">特色功能</h3>
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard onClick={() => onStartAnalysis(ScanType.PALM)} icon="pan_tool" title="AI 手相" desc="掌纹解析" color="purple" />
          <FeatureCard onClick={() => onStartAnalysis(ScanType.COMPATIBILITY)} icon="diversity_3" title="合盘测算" desc="契合大揭秘" color="pink" />
          <FeatureCard onClick={() => onStartAnalysis(ScanType.BEAUTY)} icon="face_retouching_natural" title="宝宝预测" desc="未来预览" color="orange" />
          <FeatureCard onClick={onOpenCalendar} icon="calendar_month" title="黄历吉日" desc="宜忌指南" color="emerald" />
        </div>
      </section>

      {/* 免责声明 */}
      <footer className="mt-8 mb-4 px-4 py-8 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3 text-white/20">
          <span className="material-symbols-outlined text-[16px] notranslate">gavel</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">免责声明 / Disclaimer</span>
        </div>
        <p className="text-[10px] text-white/10 leading-relaxed font-medium">
          本应用分析结果基于AI模型生成，仅供娱乐参考，不作为专业医疗、心理、财务或法律建议。命由天定，运由己造，请理性看待测算结果。
        </p>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string; color: string; onClick: () => void }> = ({ icon, title, desc, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-start p-6 rounded-[2.5rem] bg-surface/30 border border-white/5 transition-all text-left relative overflow-hidden group active:scale-[0.96]">
    <div className={`size-12 rounded-[1.2rem] bg-${color === 'purple' ? 'purple-500' : color === 'pink' ? 'pink-500' : color === 'orange' ? 'orange-500' : 'emerald-500'}/10 flex items-center justify-center mb-4 border border-white/5`}>
      <span className={`material-symbols-outlined text-[26px] notranslate text-${color === 'purple' ? 'purple-400' : color === 'pink' ? 'pink-400' : color === 'orange' ? 'orange-400' : 'emerald-400'}`}>{icon}</span>
    </div>
    <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
    <p className="text-[10px] text-white/20 font-medium">{desc}</p>
    <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
       <span className="material-symbols-outlined text-2xl notranslate">touch_app</span>
    </div>
  </button>
);

export default Home;
