import React, { useState, useEffect } from 'react';
import { HomeView } from './components/views/HomeView';
import { EarnView } from './components/views/EarnView';
import { TradeView } from './components/views/TradeView';
import { ReferralView } from './components/views/ReferralView';
import { ProfileView } from './components/views/ProfileView';
import { Layout } from './components/Layout';
import { TabId, AppState } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [appState, setAppState] = useState<AppState>({
    balance: 1250.00,
    tonBalance: 0.0,
    profitPerHour: 450,
    miningType: 'HYPENAX',
    isMining: false,
    miningStartTime: null,
    dailyRewardClaimed: false,
    // Defaults
    walletAddress: null,
    isConnected: false,
    level: 12,
    xp: 7500,
    theme: 'Dark',
    soundEnabled: true,
    notificationsEnabled: true,
  });

  // Global Mining Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (appState.isMining) {
      interval = setInterval(() => {
        setAppState(prev => {
          const rate = prev.miningType === 'TON' ? 0.00007 : (prev.profitPerHour / 3600);
          const key = prev.miningType === 'TON' ? 'tonBalance' : 'balance';
          return {
            ...prev,
            [key]: prev[key] + rate
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [appState.isMining, appState.miningType]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView appState={appState} setAppState={setAppState} />;
      case 'earn':
        return <EarnView appState={appState} setAppState={setAppState} />;
      case 'trade':
        return <TradeView appState={appState} />;
      case 'referral':
        return <ReferralView />;
      case 'profile':
        return <ProfileView appState={appState} setAppState={setAppState} />;
      default:
        return <HomeView appState={appState} setAppState={setAppState} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      balance={appState.balance}
      profitPerHour={appState.profitPerHour}
    >
      {renderContent()}
    </Layout>
  );
}