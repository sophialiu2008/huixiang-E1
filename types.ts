export enum AppTab {
  HOME = 'home',
  DISCOVER = 'discover',
  ANALYSIS = 'analysis',
  DIVINATION = 'divination',
  PROFILE = 'profile',
  CALENDAR = 'calendar',
  AI_CANVAS = 'ai_canvas'
}

export enum ScanType {
  FACE = 'face',
  PALM = 'palm',
  COMPATIBILITY = 'compatibility',
  BEAUTY = 'beauty'
}

// ... Post 和 Citation 保持不变 ...

export interface AnalysisResult {
  type: ScanType; // 建议在 App.tsx 赋值时确保此项不为空
  score: number;
  description: string;
  
  // 图表核心数据
  radarData: {
    subject: string;
    A: number;
    fullMark: number;
  }[];
  
  // 三庭比例：用于可视化条形图
  sanTing?: {
    label: string; // 上庭, 中庭, 下庭
    value: number;
    percent: number;
    color: string;
  }[];
  
  // 运势趋势：用于折线图 (LineChart)
  fortuneTrend?: {
    age: string; // 横轴：如 "20岁", "30岁"
    score: number; // 纵轴：分值
  }[];
  
  advices: {
    icon: string;
    title: string;
    tag: string;
    desc: string;
  }[];
  
  citations: Citation[];
}
