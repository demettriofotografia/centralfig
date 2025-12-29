
export type Sentiment = 'negative' | 'neutral' | 'positive' | null;
export type HighlightStatus = 'red' | 'orange' | 'green' | null;

export interface DayEntry {
  id: number;
  dayLabel: string;
  sentiment: Sentiment;
  note: string;
  rating: number; // 0 to 10
  dailyValue: number; // Financial result for the day
  maxValue: number; // Max value reached during the day
  highlight: HighlightStatus; // Status color for the row
}

export interface AnalysisResult {
  summary: string;
  advice: string;
  trend: string;
}

export interface OperatorUser {
  id: string;
  login: string;
  password: string;
  createdAt: string;
}
