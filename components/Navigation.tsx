
import React, { useState } from 'react';
import { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [loadingTabId, setLoadingTabId] = useState<AppTab | null>(null);

  const tabs = [
    { id: AppTab.HOME, icon: 'home', label: '首页' },
    { id: AppTab.DISCOVER, icon: 'explore', label: '知识库' },
    { id: AppTab.ANALYSIS, icon: 'crop_free', label: '分析', isCenter: true },
    { id: AppTab.DIVINATION, icon: 'auto_awesome', label: '占卜' },
    { id: AppTab.PROFILE, icon: 'person', label: '我的' },
  ];

  const handleTabClick = (tabId: AppTab) => {
    if (activeTab === tabId) return;
    
    setLoadingTabId(tabId);
    
    // 快速反馈，提升流畅感
    setTimeout(() => {
      onTabChange(tabId);
      setTimeout(() => setLoadingTabId(null), 100);
    }, 200);
  };

  return (
    <nav className="fixed bottom-6 left-5 right-5 z-50 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        {/* 底部导航药丸 */}
        <div className="relative flex items-center justify-around h-18 px-2 rounded-[2.2rem] bg-black/60 backdrop-blur-3xl border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
          
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isLoading = loadingTabId === tab.id;
            
            if (tab.isCenter) {
              return (
                <div key={tab.id} className="relative -top-7">
                  <button 
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex h-16 w-16 items-center justify-center rounded-full bg-mystic-gradient text-white shadow-[0_12px_30px_rgba(236,19,236,0.5)] border-[5px] border-[#120812] transition-all duration-300 active:scale-90 ${isLoading ? 'animate-pulse opacity-80' : ''}`}
                  >
                    <span className="material-symbols-outlined text-[32px] notranslate">
                      {isLoading ? 'progress_activity' : tab.icon}
                    </span>
                  </button>
                  {isActive && !isLoading && (
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#ec13ec]"></div>
                  )}
                </div>
              );
            }

            return (
              <button 
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex flex-col items-center justify-center min-w-[60px] h-full transition-all duration-300 active:scale-95 ${isActive ? 'text-primary' : 'text-white/20'}`}
              >
                <div className="relative h-6 flex items-center justify-center">
                  <span 
                    className={`material-symbols-outlined text-[24px] notranslate transition-all ${isLoading ? 'animate-pulse' : ''}`}
                    style={{ 
                      fontVariationSettings: `'FILL' ${isActive ? 1 : 0}, 'wght' ${isActive ? 500 : 400}`
                    }}
                  >
                    {tab.icon}
                  </span>
                </div>
                
                <span className={`text-[9px] mt-1 font-bold tracking-tight transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {tab.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#ec13ec]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
