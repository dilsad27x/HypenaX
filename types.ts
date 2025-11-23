import { LucideIcon } from 'lucide-react';

export type TabId = 'home' | 'earn' | 'trade' | 'referral' | 'profile';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

export type MiningType = 'HYPENAX' | 'TON';

export interface AppState {
  balance: number;
  tonBalance: number;
  profitPerHour: number;
  miningType: MiningType;
  isMining: boolean;
  miningStartTime: number | null;
  dailyRewardClaimed: boolean;
  // Profile additions
  walletAddress: string | null;
  isConnected: boolean;
  level: number;
  xp: number;
  theme: 'Dark' | 'Light' | 'Neon';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface TradeOrder {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  time: string;
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  icon: string;
  status: 'pending' | 'completed';
}