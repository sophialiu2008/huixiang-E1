
import React, { useState } from 'react';
import { AppTab, AnalysisResult, ScanType } from './types';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Analysis from './pages/Analysis';
import Divination from './pages/Divination';
import Profile from './pages/Profile';
import Report from './pages/Report';
import Calendar from './pages/Calendar';
import AiCanvas from './pages/AiCanvas';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [showReport, setShowReport] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [currentScanType, setCurrentScanType] = useState<ScanType>(ScanType.FACE);
  const [initialAnalysisType, setInitialAnalysisType] = useState<string>('综合运势');

  const handleStartAnalysis = (type: ScanType = ScanType.FACE, analysisType: string = '综合运势') => {
    setCurrentScanType(type);
    setInitialAnalysisType(analysisType);
    setActiveTab(AppTab.ANALYSIS);
  };

  const handleAnalysisComplete = (data: AnalysisResult) => {
    setAnalysisData({ ...data, type: currentScanType });
    setShowReport(true);
  };

  const renderPage = () => {
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
    <div className="min-h-screen bg-background text-white selection:bg-primary/20 selection:text-white font-body overflow-x-hidden">
      {/* 背景氛围层 - 柔和渐变 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-25%] left-[-15%] w-[120%] aspect-square bg-primary/5 rounded-full blur-[140px] bg-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] aspect-square bg-orange-500/5 rounded-full blur-[120px] bg-glow" style={{ animationDelay: '-4s' }}></div>
      </div>

      <main className="relative z-10 max-w-md mx-auto">
        {renderPage()}
      </main>

      {!showReport && activeTab !== AppTab.CALENDAR && activeTab !== AppTab.AI_CANVAS && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default App;
