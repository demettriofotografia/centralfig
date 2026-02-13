export interface FinancialData {
  investedAmount: number;
  profit: number;
  profitPercentage: number;
  fees: number;
  availableForWithdrawal: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}