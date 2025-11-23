import { Home, DollarSign, BarChart3, Users, User, Zap, Gift, Video, MessageCircle } from 'lucide-react';
import { TabConfig, Task } from './types';

export const TABS: TabConfig[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'earn', label: 'Earn', icon: DollarSign },
  { id: 'trade', label: 'Trade', icon: BarChart3 },
  { id: 'referral', label: 'Refs', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Join Telegram Channel', reward: 500, icon: 'tg', status: 'pending' },
  { id: '2', title: 'Follow on X', reward: 500, icon: 'x', status: 'pending' },
  { id: '3', title: 'Watch Daily Video', reward: 1000, icon: 'yt', status: 'pending' },
];

export const CHART_DATA = [
  { time: '10:00', value: 1.2 },
  { time: '11:00', value: 1.5 },
  { time: '12:00', value: 1.3 },
  { time: '13:00', value: 1.8 },
  { time: '14:00', value: 2.1 },
  { time: '15:00', value: 1.9 },
  { time: '16:00', value: 2.4 },
];

export const MARKET_DATA = [
  { id: 'bitcoin', rank: 1, symbol: 'BTC', pair: 'USDT', price: 92437.6, change: 0.52, volume: '1.23B', name: 'Bitcoin', high: 93100, low: 91200 },
  { id: 'solana', rank: 2, symbol: 'SOL', pair: 'USDT', price: 143.33, change: 2.42, volume: '244.90M', name: 'Solana', high: 145.20, low: 139.50 },
  { id: 'ethereum', rank: 3, symbol: 'ETH', pair: 'USDT', price: 3041.71, change: -1.22, volume: '748.13M', name: 'Ethereum', high: 3100.00, low: 3020.50 },
  { id: 'ripple', rank: 4, symbol: 'XRP', pair: 'USDT', price: 2.1326, change: -2.63, volume: '180.62M', name: 'Ripple', high: 2.2000, low: 2.1000 },
  { id: 'the-open-network', rank: 5, symbol: 'TON', pair: 'USDT', price: 1.735, change: -2.47, volume: '9.10M', name: 'Toncoin', high: 1.800, low: 1.710 },
  { id: 'spx6900', rank: 6, symbol: 'SPX', pair: 'USDT', price: 0.5873, change: 10.42, volume: '10.72M', name: 'SPX6900', high: 0.6000, low: 0.5200 },
  { id: 'near', rank: 7, symbol: 'NEAR', pair: 'USDT', price: 2.375, change: 4.81, volume: '15.06M', name: 'NEAR Protocol', high: 2.450, low: 2.200 },
  { id: 'gaib', rank: 8, symbol: 'GAIB', pair: 'USDT', price: 0.17493, change: 483.10, volume: '5.51M', name: 'Gaib', high: 0.18000, low: 0.03000, isNew: true },
  { id: 'fetch-ai', rank: 9, symbol: 'FET', pair: 'USDT', price: 0.3150, change: 8.88, volume: '9.67M', name: 'Fetch.ai', high: 0.3300, low: 0.2900 },
];