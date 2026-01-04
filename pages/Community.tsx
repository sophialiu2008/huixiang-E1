
import React, { useState } from 'react';
import { Post } from '../types';

interface Topic {
  id: string;
  title: string;
  desc: string;
  icon: string;
  participants: string;
  postsCount: number;
  trending?: boolean;
  color: string;
}

const Community: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'recommend' | 'topics'>('recommend');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: '玄学少女林林',
      avatar: 'https://picsum.photos/id/65/100/100',
      time: '2小时前',
      title: '财运亨通的面相特征解析 ✨',
      content: '这次的AI分析太准了！鼻翼丰满确实说明最近偏财运不错。大家可以看看自己的三庭比例，中庭长的人往往意志力更强。',
      image: 'https://picsum.photos/id/1027/600/400',
      likes: 1240,
      comments: 342,
      shares: 89,
      isLiked: false,
      isVerified: true
    },
    {
      id: '2',
      author: '修行者小王',
      avatar: 'https://picsum.photos/id/100/100/100',
      time: '5分钟前',
      title: '柳叶眉的感情运势问询',
      content: '刚生成的报告说我属于典型柳叶眉，重情重义但易受情伤，这种面相该如何开运呢？求大师指点！',
      image: 'https://picsum.photos/id/1011/600/400',
      likes: 24,
      comments: 12,
      shares: 2,
      isLiked: false
    }
  ]);

  const topics: Topic[] = [
    { id: 't1', title: '面相看财运', desc: '鼻翼丰满真的能招财吗？分享你的面相发现。', icon: 'payments', participants: '1.2w', postsCount: 3421, trending: true, color: 'orange' },
    { id: 't2', title: '手相桃花线', desc: '解读掌纹中的情感密码，寻找你的正缘。', icon: 'favorite', participants: '8.5k', postsCount: 1290, color: 'pink' },
    { id: 't3', title: '家居开运布局', desc: '如何通过摆件优化房间能量场？', icon: 'home_pin', participants: '5.2k', postsCount: 856, color: 'purple' },
    { id: 't4', title: '水逆自救指南', desc: '近期沟通受阻？来看看大家是怎么化解的。', icon: 'tide', participants: '15.8w', postsCount: 23110, trending: true, color: 'blue' },
    { id: 't5', title: '三庭五眼比例', desc: '科学面部美学与传统相学的碰撞。', icon: 'straighten', participants: '3.1k', postsCount: 432, color: 'emerald' },
    { id: 't6', title: '本命年避坑', desc: '红色内衣真的管用吗？来聊聊你的经验。', icon: 'shield_moon', participants: '9.2k', postsCount: 1102, color: 'red' },
  ];

  const toggleLike = (id: string) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    alert("发布动态功能即将上线，敬请期待！");
  };

  const renderRecommend = () => (
    <div className="flex flex-col gap-5 animate-fade-in-up">
      {posts.map(post => (
        <article key={post.id} className="flex flex-col rounded-3xl bg-surface border border-white/5 shadow-lg overflow-hidden transition-all active:scale-[0.98]">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src={post.avatar} className="size-10 rounded-full object-cover border border-white/10" alt={post.author} />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  {post.author}
                  {post.isVerified && <span className="material-symbols-outlined text-[14px] text-blue-400">verified</span>}
                </span>
                <span className="text-[10px] text-white/40">{post.time}</span>
              </div>
            </div>
            <button className="text-white/30"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          
          <div className="px-4 pb-4">
            <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-3">{post.content}</p>
            <div className="rounded-2xl overflow-hidden border border-white/5 mb-3">
               <img src={post.image} className="w-full aspect-video object-cover" alt="Post" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex gap-6">
                <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-primary' : 'text-white/40'}`}>
                  <span className={`material-symbols-outlined text-[22px] ${post.isLiked ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${post.isLiked ? 1 : 0}` }}>favorite</span>
                  <span className="text-xs font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-white/40"><span className="material-symbols-outlined text-[22px]">mode_comment</span><span className="text-xs font-medium">{post.comments}</span></button>
              </div>
              <button className="bg-white/5 text-white/60 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">查看分析</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  const renderTopics = () => (
    <div className="grid grid-cols-1 gap-4 animate-fade-in-up">
      {topics.map((topic, index) => (
        <button 
          key={topic.id} 
          className="group relative flex items-center gap-5 p-5 rounded-[2rem] bg-surface/50 border border-white/5 overflow-hidden transition-all hover:bg-surface active:scale-95 text-left"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* 背景光晕 */}
          <div className={`absolute -right-4 -top-4 size-24 bg-${topic.color}-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
          
          <div className={`size-16 rounded-2xl bg-${topic.color}-500/10 flex items-center justify-center shrink-0 border border-${topic.color}-500/20 shadow-inner group-hover:scale-110 transition-transform`}>
            <span className={`material-symbols-outlined text-[32px] text-${topic.color}-400`}>{topic.icon}</span>
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white truncate">#{topic.title}</h3>
              {topic.trending && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[8px] font-black text-red-400 uppercase tracking-widest animate-pulse">Hot</span>
              )}
            </div>
            <p className="text-xs text-white/40 line-clamp-1 mb-2 font-medium">{topic.desc}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-white/20">groups</span>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{topic.participants} 参与</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-white/20">edit_note</span>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{topic.postsCount} 动态</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/5 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
             <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">chevron_right</span>
          </div>
        </button>
      ))}
      
      <div className="mt-6 p-8 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center opacity-40">
        <span className="material-symbols-outlined text-5xl mb-3 font-light">add_circle</span>
        <p className="text-xs font-bold tracking-widest uppercase">申请创建新话题</p>
        <p className="text-[10px] mt-1">如果你有独特的玄学见解，欢迎发起讨论</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 px-4 pb-32 min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl -mx-4 px-4 py-4 flex flex-col gap-5 border-b border-white/5 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-pink-200">慧相社区</h1>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] mt-1">Mystic Social Space</p>
          </div>
          <div className="flex gap-3">
            <button className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all active:scale-95">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button 
              onClick={handleCreatePost}
              className="size-11 flex items-center justify-center rounded-2xl bg-mystic-gradient shadow-lg shadow-primary/20 text-white active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined">edit_square</span>
            </button>
          </div>
        </div>
        
        {/* 导航标签 */}
        <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveSubTab('recommend')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'recommend' ? 'bg-surface-lighter text-white shadow-xl border border-white/10' : 'text-white/30 hover:text-white/50'}`}
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            热门推荐
          </button>
          <button 
            onClick={() => setActiveSubTab('topics')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'topics' ? 'bg-surface-lighter text-white shadow-xl border border-white/10' : 'text-white/30 hover:text-white/50'}`}
          >
            <span className="material-symbols-outlined text-[18px]">topic</span>
            发现话题
          </button>
        </div>
      </header>

      {/* 动态内容区域 */}
      <main className="flex-1">
        {posts.length > 0 || activeSubTab === 'topics' ? (
          activeSubTab === 'recommend' ? renderRecommend() : renderTopics()
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 animate-fade-in-up">
            {/* 这里保留之前的空状态逻辑 */}
          </div>
        )}
      </main>
    </div>
  );
};

export default Community;
