
import React, { useState, useMemo } from 'react';

interface Book {
  id: string;
  title: string;
  desc: string;
  img: string;
  category: string;
  isNew?: boolean;
  format?: 'PDF' | 'AUDIO' | 'VIDEO';
  progress?: number;
}

const allBooks: Book[] = [
  // 面相类
  { id: '1', title: '麻衣相法详解', desc: '相术之宗，深度解析五官、十二宫位。', img: 'https://picsum.photos/id/101/300/450', category: '面相类', format: 'PDF', progress: 45 },
  { id: '2', title: '柳庄相法', desc: '明代相术巅峰之作，侧重神气与骨格。', img: 'https://picsum.photos/id/102/300/450', category: '面相类', isNew: true },
  { id: '3', title: '面相与血型性格', desc: '现代生物统计学与面相的跨界研究。', img: 'https://picsum.photos/id/103/300/450', category: '面相类' },
  { id: '4', title: '神相全编', desc: '收录历代相术精华，最为详尽的工具书。', img: 'https://picsum.photos/id/104/300/450', category: '面相类', format: 'AUDIO' },
  
  // 手相类
  { id: '5', title: '手相密码', desc: '从三大主线看人生的转折点与际遇。', img: 'https://picsum.photos/id/105/300/450', category: '手相类', format: 'PDF', progress: 12 },
  { id: '6', title: '西洋手相学', desc: '结合占星学的西式手相分析方法。', img: 'https://picsum.photos/id/106/300/450', category: '手相类' },
  { id: '7', title: '指纹与遗传', desc: '从科学角度解读指纹中的天赋信息。', img: 'https://picsum.photos/id/107/300/450', category: '手相类', isNew: true },
  
  // 星象占卜
  { id: '8', title: '紫微斗数入门', desc: '东方星象学之首，精准推算命位吉凶。', img: 'https://picsum.photos/id/108/300/450', category: '星象占卜', format: 'VIDEO' },
  { id: '9', title: '星盘解析实战', desc: '十二星座与宫位、相位的综合演练。', img: 'https://picsum.photos/id/109/300/450', category: '星象占卜', progress: 88 },
  { id: '10', title: '易经占卜简述', desc: '大道至简，掌握六十四卦的哲学与应用。', img: 'https://picsum.photos/id/110/300/450', category: '星象占卜' },
  
  // 开运指南
  { id: '11', title: '居家风水调理', desc: '通过布局优化环境能量，改善家运。', img: 'https://picsum.photos/id/111/300/450', category: '开运指南', format: 'PDF' },
  { id: '12', title: '本命年避邪', desc: '传统文化中的本命年注意事项与化解。', img: 'https://picsum.photos/id/112/300/450', category: '开运指南', isNew: true },
];

const categories = ['全部典籍', '面相类', '手相类', '星象占卜', '开运指南'];

const Library: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('全部典籍');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    return allBooks.filter(book => {
      const matchCategory = activeCategory === '全部典籍' || book.category === activeCategory;
      const matchSearch = book.title.includes(searchQuery) || book.desc.includes(searchQuery);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-8 px-5 pb-40">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl -mx-5 px-5 py-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">慧相文库</h1>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-0.5">Ancient Wisdom Library</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="size-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 tap-feedback hover:bg-white/10">
              <span className="material-symbols-outlined text-white/60 text-[22px]">auto_stories</span>
            </button>
          </div>
        </div>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 text-[20px] group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜素古籍、占星或开运知识..." 
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-white/20 transition-all shadow-inner"
          />
        </div>
      </header>

      {/* Featured Lesson */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-white/90 flex items-center gap-2">
            <span className="size-2 bg-primary rounded-full animate-pulse"></span>
            新手必学
          </h2>
        </div>
        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-surface tap-feedback transition-all">
          <img 
            src="https://picsum.photos/id/670/800/450" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" 
            alt="Tutorial Thumbnail" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-[0_0_40px_rgba(236,19,236,0.5)] transform group-hover:scale-110 transition-transform border-4 border-white/20 backdrop-blur-md">
              <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-primary text-[10px] font-black text-white uppercase tracking-wider">必修课</span>
              <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">timer</span> 15:20
              </span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">AI 智能分析：从原理到精准实操</h3>
            <p className="text-xs text-white/50 mt-1">深度解析神经网络如何识别人类面部命理特征</p>
          </div>
          <div className="absolute bottom-0 left-0 h-1.5 bg-primary w-2/5 shadow-[0_0_15px_#ec13ec]"></div>
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all border tap-feedback ${activeCategory === cat ? 'bg-mystic-gradient text-white border-transparent shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Book Grid */}
      <section className="pb-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 px-1">
          {filteredBooks.length > 0 ? filteredBooks.map((book) => (
            <div key={book.id} className="group cursor-pointer tap-feedback transition-transform flex flex-col">
              <div className="relative w-full aspect-[3/4.2] mb-4 rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.3)] border border-white/5 bg-surface transition-all group-hover:-translate-y-2 group-hover:shadow-primary/20">
                <img src={book.img} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" alt={book.title} />
                
                {/* Format Tag */}
                {book.format && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-[8px] font-black bg-black/60 backdrop-blur-md border border-white/10 text-white/80 tracking-widest uppercase">
                    {book.format}
                  </div>
                )}

                {/* New Tag */}
                {book.isNew && (
                  <div className="absolute top-3 right-3 size-6 rounded-full bg-secondary flex items-center justify-center shadow-lg animate-bounce">
                    <span className="text-[8px] font-black text-white italic">N</span>
                  </div>
                )}

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Progress Bar for continuing reading */}
                {book.progress !== undefined && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                    <div className="h-full bg-primary shadow-[0_0_10px_#ec13ec]" style={{ width: `${book.progress}%` }}></div>
                  </div>
                )}
              </div>
              
              <div className="px-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">{book.category}</span>
                </div>
                <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">{book.title}</h3>
                <p className="text-[11px] text-white/30 line-clamp-2 mt-1.5 font-medium leading-relaxed">{book.desc}</p>
                
                {book.progress !== undefined && (
                  <div className="flex items-center gap-1.5 mt-3">
                     <span className="material-symbols-outlined text-[14px] text-primary/60">pending_actions</span>
                     <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">已读 {book.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="col-span-2 py-20 flex flex-col items-center justify-center opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">auto_stories</span>
              <p className="text-sm font-bold">未找到相关书籍</p>
              <button onClick={() => {setActiveCategory('全部典籍'); setSearchQuery('');}} className="mt-4 text-xs text-primary underline underline-offset-4 tap-feedback">重置筛选条件</button>
            </div>
          )}
        </div>
      </section>

      {/* Reading Quote of the Day */}
      <section className="mt-4">
        <div className="bg-glass-gradient border border-white/5 rounded-3xl p-8 relative overflow-hidden text-center italic hover-lift cursor-default transition-all">
          <div className="absolute top-0 left-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-4xl">format_quote</span>
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-4 relative z-10">
            “夫形者，神之宅也。神者，形之主也。形神兼备，方见乾坤之妙。”
          </p>
          <p className="text-primary font-bold text-[10px] tracking-widest uppercase">— 《麻衣相法》总论</p>
        </div>
      </section>
    </div>
  );
};

export default Library;
