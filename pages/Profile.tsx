
import React from 'react';
import { AreaChart, Area, XAxis, ResponsiveContainer, ReferenceDot } from 'recharts';

const Profile: React.FC = () => {
  const trendData = [
    { age: '20岁', score: 30 },
    { age: '30岁', score: 65 },
    { age: '40岁', score: 45 },
    { age: '50岁', score: 55 },
    { age: '60岁', score: 75 },
    { age: '70岁', score: 60 }
  ];

  return (
    <div className="flex flex-col gap-6 px-5 pb-40 min-h-screen">
      <header className="flex items-center justify-between pt-8 pb-4">
        <h1 className="text-2xl font-black text-white">个人中心</h1>
        <button className="size-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 active:scale-95 transition-all"><span className="material-symbols-outlined text-white/60">settings</span></button>
      </header>

      {/* 个人资料卡片 - 仿图1/12 */}
      <section className="flex flex-col items-center gap-6 py-4">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-mystic-gradient blur-xl opacity-30 animate-pulse"></div>
          <div className="relative size-28 rounded-full p-1.5 bg-background border border-white/10 ring-4 ring-primary/20">
            <img 
              src="https://picsum.photos/id/64/300/300" 
              className="size-full rounded-full object-cover" 
              alt="Avatar"
            />
            <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-mystic-gradient flex items-center justify-center border-4 border-background shadow-lg">
              <span className="material-symbols-outlined text-white text-[16px]">edit</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-black text-white mb-2">张伟</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white/60">1995年8月14日 (午时)</span>
          </div>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
            火马 (Fire Horse) <span className="size-1 bg-white/10 rounded-full"></span> 狮子座
          </p>
        </div>
      </section>

      {/* 核心数据 - 仿图1 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '面相分析', value: '12' },
          { label: '活跃天数', value: '45' },
          { label: '积分', value: '880' }
        ].map(item => (
          <div key={item.label} className="bg-surface/50 border border-white/5 rounded-3xl p-5 flex flex-col items-center justify-center gap-1 shadow-inner">
            <span className="text-2xl font-black text-white tracking-tight">{item.value}</span>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>

      {/* 升级 Banner - 仿图1 */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-mystic-gradient p-6 shadow-2xl shadow-primary/20 group cursor-pointer active:scale-95 transition-all">
        <div className="absolute -right-4 -top-4 size-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">解锁 AI 面相深度报告</h3>
            <p className="mt-1 text-xs text-white/70 font-medium">获取详细的运势、性格与事业分析</p>
          </div>
          <button className="h-10 px-5 rounded-2xl bg-white text-primary text-[10px] font-black uppercase tracking-widest shadow-lg">立即升级</button>
        </div>
      </div>

      {/* 我的面相修路 - 仿图1 */}
      <section className="bg-surface/30 border border-white/5 rounded-[2.5rem] p-7 space-y-5">
        <div className="flex items-center justify-between">
           <h3 className="text-lg font-black text-white flex items-center gap-2">我的面相修路</h3>
           <span className="text-[10px] font-bold text-primary uppercase">LV.4 进阶</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-1 px-1">
             <span className="text-xs font-bold text-white/60">面相学识储备</span>
             <span className="text-xl font-black text-primary italic">65%</span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-mystic-gradient rounded-full w-[65%] shadow-[0_0_15px_rgba(236,19,236,0.3)]"></div>
          </div>
          <p className="text-[10px] text-white/20 font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">lightbulb</span> 下一级解锁：微表情识别课程
          </p>
        </div>
      </section>

      {/* 一生运势起伏 - 仿图12 */}
      <section className="bg-surface/30 border border-white/5 rounded-[2.5rem] p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">一生运势起伏</h3>
            <p className="text-[10px] text-white/30 font-bold mt-0.5 uppercase tracking-widest">基于四柱八字推算</p>
          </div>
          <div className="text-right">
             <span className="text-xl font-black text-orange-400 italic">上升期</span>
             <p className="text-[10px] text-green-400 font-bold mt-0.5">+15%</p>
          </div>
        </div>
        <div className="w-full h-48 mt-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <XAxis dataKey="age" tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 9}} axisLine={false} tickLine={false} />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#ec13ec" 
                strokeWidth={4}
                fill="url(#colorScore)"
                isAnimationActive={true}
              />
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec13ec" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec13ec" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <ReferenceDot x="40岁" y={40} r={5} fill="white" stroke="#ec13ec" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 最近记录 - 仿图1 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold">历史档案</h3>
          <button className="text-[10px] font-bold text-primary uppercase">查看全部</button>
        </div>
        <div className="space-y-3">
          <RecordItem icon="history_edu" title="2023 运势预测" date="1月12日" desc="综合评分 88分 · 事业运势强" color="purple" />
          <RecordItem icon="favorite" title="桃花运分析" date="1月10日" desc="重点关注：正缘出现时机" color="orange" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 mb-10">
        <button className="flex items-center gap-3 rounded-3xl bg-white/5 p-5 border border-white/5"><span className="material-symbols-outlined text-white/50">help_center</span><span className="text-xs font-bold">帮助中心</span></button>
        <button className="flex items-center gap-3 rounded-3xl bg-white/5 p-5 border border-white/5"><span className="material-symbols-outlined text-white/50">info</span><span className="text-xs font-bold">关于我们</span></button>
      </div>
    </div>
  );
};

const RecordItem: React.FC<{ icon: string; title: string; date: string; desc: string; color: string }> = ({ icon, title, date, desc, color }) => (
  <div className="group w-full flex items-center gap-5 rounded-[2rem] bg-surface/40 p-5 hover:bg-surface transition-all cursor-pointer border border-white/5">
    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/10`}>
      <span className="material-symbols-outlined text-[28px]">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <p className="truncate font-bold text-white text-sm">{title}</p>
        <span className="text-[9px] font-bold text-white/20 bg-white/5 px-2 py-0.5 rounded-full">{date}</span>
      </div>
      <p className="truncate text-[11px] text-white/40 font-medium">{desc}</p>
    </div>
    <span className="material-symbols-outlined text-white/10 group-hover:text-primary transition-colors">chevron_right</span>
  </div>
);

export default Profile;
