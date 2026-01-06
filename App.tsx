import React, { useState } from 'react';
// 确保这些类型定义文件存在，建议加上 .ts 后缀
import { AppTab, AnalysisResult, ScanType } from './types.ts'; 
import Navigation from './components/Navigation.tsx';
import Home from './pages/Home.tsx';
import Discover from './pages/Discover.tsx';
import Analysis from './pages/Analysis.tsx';
import Divination from './pages/Divination.tsx';
import Profile from './pages/Profile.tsx';
import Report from './pages/Report.tsx';
import Calendar from './pages/Calendar.tsx';
import AiCanvas from './pages/AiCanvas.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [showReport, setShowReport] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [currentScanType, setCurrentScanType] = useState<ScanType>(ScanType.FACE);
  const [initialAnalysisType, setInitialAnalysisType] = useState<string>('综合运势');

  // 处理开始分析流程
  const handleStartAnalysis = (type: ScanType = ScanType.FACE, analysisType: string = '综合运势') => {
    setCurrentScanType(type);
    setInitialAnalysisType(analysisType);
    setActiveTab(AppTab.ANALYSIS);
  };

  // 处理分析完成
  const handleAnalysisComplete = (data: AnalysisResult) => {
    setAnalysisData({ ...data, type: currentScanType });
    setShowReport(true);
  };

  const renderPage = () => {
    // 优先显示报告页
    if (showReport && analysisData) {
      return <Report data={analysisData} onClose={() => setShowReport(false)} />;
    }

    switch (activeTab) {
      case AppTab.HOME:
        return (
          <Home 
            onStartAnalysis={handleStartAnalysis} 
            onOpenCalendar={() => setActiveTab(AppTab.CALENDAR)} 
            onOpenAiCanvas={() => setActiveTab(AppTab.AI_CANVAS)}
          />
        );
      case AppTab.DISCOVER:
        return <Discover onStartDeepAnalysis={(title) => handleStartAnalysis(ScanType.FACE, title)} />;
      case AppTab.ANALYSIS:
        return <Analysis type={currentScanType} initialType={initialAnalysisType} onScanComplete={handleAnalysisComplete} />;
      case AppTab.DIVINATION:
        return <Divination />;
      case AppTab.PROFILE:
        return <Profile />;
      case AppTab.CALENDAR:
        return <Calendar onBack={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.AI_CANVAS:
        return <AiCanvas onBack={() => setActiveTab(AppTab.HOME)} />;
      default:
        return (
          <Home 
            onStartAnalysis={handleStartAnalysis} 
            onOpenCalendar={() => setActiveTab(AppTab.CALENDAR)} 
            onOpenAiCanvas={() => setActiveTab(AppTab.AI_CANVAS)}
          />
        );
    }
  };

  return (
    // 添加 relative 确保 z-index 生效
    <div className="min-h-screen bg-background text-white selection:bg-primary/20 selection:text-white font-body overflow-x-hidden relative">
      
      {/* 背景氛围层 - 保持固定且在底层 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-25%] left-[-15%] w-[120%] aspect-square bg-primary/5 rounded-full blur-[140px] bg-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] aspect-square bg-orange-500/5 rounded-full blur-[120px] bg-glow" style={{ animationDelay: '-4s' }}></div>
      </div>

      {/* 1. 核心修复点：为 main 容器设置 flex-1 和最小高度，确保子组件（特别是图表）能撑开 */}
      <main className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col pb-24">
        {renderPage()}
      </main>

      {/* 导航栏：仅在特定页面显示 */}
      {!showReport && 
       activeTab !== AppTab.CALENDAR && 
       activeTab !== AppTab.AI_CANVAS && 
       activeTab !== AppTab.ANALYSIS && ( // 扫描分析时通常也不显示导航栏
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default App;
