
export enum AppTab {
  HOME = 'home',
  DISCOVER = 'discover', // 知识库/文库
  ANALYSIS = 'analysis',
  DIVINATION = 'divination', // 占卜/命盘
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

export interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isVerified?: boolean;
}

export interface Citation {
  source: string;
  quote: string;
  interpretation: string;
}

export interface AnalysisResult {
  type: ScanType;
  score: number;
  description: string;
  radarData: {
    subject: string;
    A: number;
    fullMark: number;
  }[];
  sanTing?: {
    label: string;
    value: number;
    percent: number;
    color: string;
  }[];
  fortuneTrend?: {
    age: string;
    score: number;
  }[];
  advices: {
    icon: string;
    title: string;
    tag: string;
    desc: string;
  }[];
  citations: Citation[];
}
