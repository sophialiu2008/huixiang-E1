
import React, { useState, useEffect, useMemo } from 'react';

const Divination: React.FC = () => {
  const [activeTab, setActiveTab] = useState('紫微斗数');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  
  // 塔罗牌状态
  const [tarotSelected, setTarotSelected] = useState<number[]>([]);
  
  // 周易八卦状态
  const [ichingLines, setIchingLines] = useState<number[]>([]);
  const [isTossing, setIsTossing] = useState(false);

  // 姓名分析状态
  const [isCalculating, setIsCalculating] = useState(false);
  const [nameResult, setNameResult] = useState<any>(null);

  // 紫微斗数状态
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);

  const tabs = ['紫微斗数', '姓名分析', 'AI手相', '塔罗牌', '周易八卦'];

  const handleTarotPick = (index: number) => {
    if (tarotSelected.length < 3 && !tarotSelected.includes(index)) {
      setTarotSelected([...tarotSelected, index]);
    }
  };

  const ichingHexagramName = useMemo(() => {
    if (ichingLines.length < 6) return null;
    const binary = ichingLines.join('');
    // 简单映射示例
    const hexMap: { [key: string]: string } = {
      '111111': '乾为天', '000000': '坤为地', '100010': '水雷屯', '010001': '山水蒙',
      '111010': '水天需', '010111': '天水讼', '000010': '地水师', '010000': '水地比',
      '101111': '火风鼎', '001011': '火泽睽', '101010': '离为火', '010101': '坎为水'
    };
    return hexMap[binary] || '时运流转 · 变卦';
  }, [ichingLines]);

  const handleIchingToss = () => {
    if (ichingLines.length >= 6 || isTossing) return;
    setIsTossing(true);
    setTimeout(() => {
      const newLine = Math.random() > 0.5 ? 1 : 0; 
      setIchingLines([...ichingLines, newLine]);
      setIsTossing(false);
    }, 600);
  };

  const handleNameAnalysis = () => {
    setIsCalculating(true);
    setNameResult(null);
    setTimeout(() => {
      setIsCalculating(false);
      setNameResult({
        score: 88,
        elements: { heaven: '金', person: '水', earth: '木' },
        summary: '格局开阔，早年虽有微波，但中晚年运势极佳，宜守业为先。'
      });
    }, 2000);
  };

  const handleStartZiwei = () => {
    setIsChartLoading(true);
    setChartData(null);
    setTimeout(() => {
      setIsChartLoading(false);
      setChartData({
        mainStar: '紫微·贪狼',
        palace: '命宫',
        desc: '天生具备领导力，社交广泛，但需防范贪婪之心影响全局。'
      });
    }, 2500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case '紫微斗数':
        return (
          <div className="space-y-8 animate-fade-in-up">
            {chartData ? (
               <div className="space-y-6 animate-reveal">
                  <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 text-center">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">命宫主星</p>
                    <h3 className="text-3xl font-black text-slate-800">{chartData.mainStar}</h3>
                    <div className="mt-4 p-4 bg-white/50 rounded-2xl text-xs text-slate-500 leading-relaxed font-medium">
                      {chartData.desc}
                    </div>
                  </div>
                  <button onClick={() => setChartData(null)} className="w-full h-14 bg-slate-100 rounded-2xl text-xs font-black text-slate-400">重新测算</button>
               </div>
            ) : isChartLoading ? (
               <div className="py-16 flex flex-col items-center gap-6">
                  <div className="size-20 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  <p className="text-xs font-black text-primary animate-pulse tracking-widest">玄空星图排列中...</p>
               </div>
            ) : (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 opacity-60">生辰八字</label>
                  <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-white inner-shadow">
                    <button 
                      onClick={() => setCalendarType('solar')}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${calendarType === 'solar' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                    >公历</button>
                    <button 
                      onClick={() => setCalendarType('lunar')}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${calendarType === 'lunar' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                    >农历</button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Year', val: '1995' },
                    { label: 'Mon', val: '08' },
                    { label: 'Day', val: '14' },
                    { label: 'Time', val: '午时' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl h-20 flex flex-col items-center justify-center border border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <span className="text-[8px] text-slate-300 font-black mb-1 uppercase tracking-tighter">{item.label}</span>
                      <span className="text-sm font-black text-slate-800">{item.val}</span>
                    </div>
                  ))}
                </div>
                <button onClick={handleStartZiwei} className="w-full h-16 bg-primary rounded-3xl font-black text-white text-lg shadow-[0_12px_24px_rgba(236,19,236,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined">auto_awesome</span> 开启排盘
                </button>
              </>
            )}
          </div>
        );
      case '姓名分析':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">您的姓名</label>
              <div className="relative">
                <input type="text" placeholder="输入姓名（如：张小慧）" className="w-full h-16 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold inner-shadow focus:ring-4 focus:ring-primary/5 transition-all outline-none" />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300">edit</span>
              </div>
            </div>
            
            {isCalculating ? (
              <div className="py-10 flex flex-col items-center gap-4 animate-pulse">
                <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">正在匹配康熙字典笔画...</p>
              </div>
            ) : nameResult ? (
               <div className="animate-reveal space-y-6">
                  <div className="grid grid-cols-3 gap-2">
                     {Object.entries(nameResult.elements).map(([k, v]) => (
                        <div key={k} className="bg-white p-3 rounded-2xl border border-slate-100 text-center">
                           <span className="text-[8px] font-black text-slate-300 uppercase block mb-1">{k === 'heaven' ? '天格' : k === 'person' ? '人格' : '地格'}</span>
                           <span className="text-xl font-black text-indigo-500">{v as string}</span>
                        </div>
                     ))}
                  </div>
                  <div className="p-6 rounded-3xl bg-indigo-50/50 border border-white shadow-inner">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-indigo-400 uppercase">测算结论</span>
                        <span className="text-2xl font-black text-indigo-600 italic">{nameResult.score}分</span>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">{nameResult.summary}</p>
                  </div>
                  <button onClick={() => setNameResult(null)} className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-400">重新输入</button>
               </div>
            ) : (
              <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border border-white text-center shadow-inner relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                  <span className="material-symbols-outlined text-8xl">format_quote</span>
                </div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">五格剖象法说明</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">系统将通过三才五格理论，结合笔画阴阳属性，为您解析天格、人格、地格之间的生克关系。</p>
              </div>
            )}
            
            {!nameResult && !isCalculating && (
              <button 
                onClick={handleNameAnalysis}
                className="w-full h-16 bg-indigo-500 rounded-3xl font-black text-white text-lg shadow-[0_12px_24px_rgba(99,102,241,0.3)] active:scale-95 transition-all"
              >
                开启测算
              </button>
            )}
          </div>
        );
      case 'AI手相':
        return (
          <div className="space-y-6 animate-fade-in-up flex flex-col items-center">
            <div className="w-full aspect-[4/3] rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white hover:border-primary/30 transition-all group overflow-hidden relative">
              <div className="size-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-4xl">pan_tool</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">点击上传手掌照片</p>
                <p className="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">左手为主，右手为辅</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
                <div className="h-full bg-primary/20 w-0 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full">
              {['生命线', '智慧线', '感情线'].map(line => (
                <div key={line} className="bg-white py-4 rounded-2xl border border-white shadow-sm text-center group cursor-default">
                  <span className="text-[9px] font-black text-slate-400 group-hover:text-primary transition-colors uppercase tracking-widest">{line}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case '塔罗牌':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">已选 {tarotSelected.length}/3 张</span>
              <div className="flex justify-center -space-x-8 py-6 w-full max-w-[300px]">
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const isSelected = tarotSelected.includes(i);
                  return (
                    <div 
                      key={i} 
                      onClick={() => handleTarotPick(i)}
                      className={`w-24 h-36 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-800 border-2 border-white/20 shadow-xl flex items-center justify-center transform transition-all cursor-pointer ${isSelected ? '-translate-y-8 rotate-0 scale-105 z-30 ring-4 ring-primary shadow-primary/20' : 'hover:-translate-y-4 hover:rotate-2 hover:z-20'}`}
                    >
                      {isSelected ? (
                        <div className="flex flex-col items-center animate-reveal">
                           <span className="material-symbols-outlined text-white text-3xl">star</span>
                           <span className="text-[8px] font-black text-white mt-1 uppercase">Card {tarotSelected.indexOf(i) + 1}</span>
                        </div>
                      ) : (
                        <span className="material-symbols-outlined text-white/10 text-4xl">style</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {tarotSelected.length === 3 ? (
               <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-100 animate-fade-in-up">
                  <h4 className="text-sm font-black text-purple-600 mb-2">阵法：圣三角</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium italic">你抽到了“命运之轮”、“愚者”与“皇后”。这预示着一个新的周期即将开始，保持纯真与创造力是成功的关键。</p>
               </div>
            ) : (
              <p className="text-center text-xs text-slate-400 font-medium px-10 leading-relaxed">请闭上眼，静心默念您的问题，然后依次从上方的牌堆中挑选三张卡牌。</p>
            )}
            
            <button 
              disabled={tarotSelected.length < 3}
              onClick={() => setTarotSelected([])}
              className={`w-full h-14 rounded-2xl font-black text-sm shadow-lg transition-all ${tarotSelected.length === 3 ? 'bg-purple-600 text-white shadow-purple-500/20' : 'bg-slate-100 text-slate-300 shadow-none'}`}
            >
              {tarotSelected.length === 3 ? '重新选牌' : '请先选牌'}
            </button>
          </div>
        );
      case '周易八卦':
        return (
          <div className="space-y-10 animate-fade-in-up">
            <div className="flex flex-col items-center">
               <div 
                onClick={handleIchingToss}
                className={`size-44 rounded-full bg-white border-8 border-slate-50 shadow-2xl flex items-center justify-center relative group cursor-pointer active:scale-95 transition-all ${isTossing ? 'animate-pulse scale-95' : ''}`}
               >
                  <div className={`absolute inset-0 rounded-full border-2 border-primary/20 ${isTossing ? 'animate-ping' : ''}`}></div>
                  <div className="flex flex-col items-center gap-1">
                    <span className={`material-symbols-outlined text-7xl text-slate-800 transition-transform duration-500 ${isTossing ? 'rotate-180 scale-110' : ''}`}>yin_yang</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isTossing ? '摇卦中...' : '点击起卦'}</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col items-center gap-4">
               <div className="flex flex-col-reverse gap-3 w-40">
                  {[...Array(6)].map((_, i) => {
                    const line = ichingLines[i];
                    return (
                      <div key={i} className="h-4 flex items-center justify-center gap-2">
                        {line === undefined ? (
                          <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                        ) : line === 1 ? (
                          <div className="w-full h-3 bg-slate-800 rounded-sm shadow-sm"></div>
                        ) : (
                          <div className="w-full h-3 flex gap-2">
                            <div className="flex-1 bg-slate-800 rounded-sm shadow-sm"></div>
                            <div className="flex-1 bg-slate-800 rounded-sm shadow-sm"></div>
                          </div>
                        )}
                      </div>
                    )
                  })}
               </div>
               
               {ichingLines.length > 0 && (
                 <div className="text-center animate-reveal">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">
                      {ichingLines.length < 6 ? `进度 ${ichingLines.length}/6` : '起卦完成'}
                    </p>
                    {ichingLines.length === 6 && (
                      <h4 className="text-xl font-black text-slate-800">{ichingHexagramName}</h4>
                    )}
                 </div>
               )}
            </div>

            {ichingLines.length === 6 && (
               <div className="bg-orange-50/50 p-6 rounded-3xl border border-white animate-fade-in-up space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-orange-600 mb-1 italic">卦辞解析</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">当前时运如日中天，但需注意防范内部虚火，保持正向的心态方能持久。</p>
                  </div>
                  <button onClick={() => setIchingLines([])} className="w-full h-12 bg-white rounded-xl text-[10px] font-black text-slate-400 border border-slate-100 shadow-sm">重新起卦</button>
               </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 px-6 pb-40 pt-12 min-h-screen bg-background text-slate-900">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-full bg-white p-1 border border-white shadow-sm overflow-hidden">
            <img src="https://picsum.photos/id/64/100/100" className="size-full rounded-full object-cover" alt="avatar" />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Divine Energy</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800">早安，张小姐</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Luck Max</span>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-800 leading-tight">探索您的<br/><span className="text-primary italic">命理宇宙</span></h1>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
        {tabs.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full text-xs font-black shrink-0 transition-all border duration-300 ${
              activeTab === tab 
              ? 'bg-mystic-gradient border-transparent text-white shadow-xl shadow-primary/20 scale-105 z-10' 
              : 'bg-white border-white text-slate-400 shadow-sm hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="bg-white/80 backdrop-blur-2xl border border-white rounded-[3.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(148,163,184,0.12)] relative overflow-hidden min-h-[450px]">
        <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none rotate-12">
          <span className="material-symbols-outlined text-[180px]">flare</span>
        </div>
        
        <div className="relative z-10 h-full">
          {renderContent()}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="text-lg font-black text-slate-800">热门推荐</h3>
          <span className="material-symbols-outlined text-slate-300">chevron_right</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl p-5 flex items-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer group">
              <div className="size-12 rounded-2xl bg-orange-100/50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-800 block">财运解析</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Wealth Path</span>
              </div>
           </div>
           <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl p-5 flex items-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer group">
              <div className="size-12 rounded-2xl bg-pink-100/50 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">favorite</span>
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-800 block">姻缘合盘</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Love Match</span>
              </div>
           </div>
        </div>
      </section>

      <div className="mt-4 bg-slate-50 border border-white rounded-3xl py-4 flex items-center justify-center gap-2 opacity-50">
        <span className="material-symbols-outlined text-sm">verified_user</span>
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Privacy Shield Protected · End-to-end Encrypted</span>
      </div>
    </div>
  );
};

export default Divination;
