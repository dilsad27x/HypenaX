import React from 'react';
import { TabId } from '../types';
import { TABS } from '../constants';
import { Gift, Coins } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  balance: number;
  profitPerHour: number;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  balance,
  profitPerHour
}) => {

  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden relative">
      {/* Custom Animations Styles */}
      <style>{`
        @keyframes float-3d {
          0%, 100% { transform: translateY(0) rotateX(0); }
          50% { transform: translateY(-6px) rotateX(10deg); }
        }
        @keyframes float-coin-3d {
          0%, 100% { transform: translateY(0) rotateX(0) scale(1); }
          50% { transform: translateY(-4px) rotateX(15deg) scale(1.02); }
        }
        @keyframes spin-3d {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>

      {/* Top Background Glow */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-hyp-purple/20 to-transparent pointer-events-none z-0" />

      {/* Header */}
      <header className="px-4 pt-4 pb-2 z-10 flex justify-between items-center h-24 perspective-[1000px]">
        
        {/* Left Side: Airdrop (Home Only) */}
        <div className="w-24 flex justify-start perspective-[800px]">
          {activeTab === 'home' && (
            <button className="relative group">
              <div 
                className="relative w-12 h-12 bg-hyp-card rounded-2xl border-2 border-slate-600 text-yellow-400 shadow-toon flex items-center justify-center"
                style={{ animation: 'spin-3d 5s linear infinite', transformStyle: 'preserve-3d' }}
              >
                <Gift size={24} className="animate-bounce" />
                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-800 animate-ping" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-800 flex items-center justify-center text-[8px] font-bold text-white">
                  1
                </div>
              </div>
            </button>
          )}
        </div>
        
        {/* Center: Balance (Transparent with 3D Motion) */}
        <div className="flex flex-col items-center flex-1 z-20">
          <div 
            className="relative flex flex-col items-center px-2 py-1"
            style={{ animation: 'float-coin-3d 6s ease-in-out infinite', transformStyle: 'preserve-3d' }}
          >
             <div className="text-[10px] text-slate-300 font-bold tracking-widest uppercase mb-0.5 text-shadow-sm">Balance</div>
             <div className="text-3xl font-black text-white flex items-center gap-2 drop-shadow-xl">
               <Coins className="text-yellow-400 fill-yellow-400 animate-pulse filter drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" size={26} />
               {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
             </div>
          </div>
        </div>

        {/* Right Side: Profit (Home Only) */}
        <div className="w-24 flex justify-end perspective-[800px]">
          {activeTab === 'home' && (
            <div 
              className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-green-500/30 rounded-2xl p-2 shadow-lg backdrop-blur-md"
              style={{ animation: 'float-3d 4s ease-in-out infinite', transformStyle: 'preserve-3d' }}
            >
              <div className="flex flex-col items-end">
                <div className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-0.5">Profit/Hr</div>
                <div className="text-sm font-black text-white flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  +{profitPerHour}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-2 z-10 relative no-scrollbar">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-6 left-4 right-4 h-20 bg-hyp-card/95 backdrop-blur-md rounded-3xl border-2 border-slate-600 shadow-2xl flex items-center justify-around px-2 z-50">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          // Dynamic Active Color for Tabs
          let activeColorClass = 'text-white';
          let activeBgClass = 'bg-hyp-purple';
          
          if (isActive) {
            if (tab.id === 'earn') { activeBgClass = 'bg-green-500'; }
            else if (tab.id === 'trade') { activeBgClass = 'bg-[#0098EA]'; }
            else if (tab.id === 'referral') { activeBgClass = 'bg-yellow-500'; }
            else if (tab.id === 'profile') { activeBgClass = 'bg-hyp-pink'; }
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? `${activeBgClass} ${activeColorClass} -translate-y-4 shadow-lg scale-110` 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 3 : 2} />
              <span className={`text-[10px] font-bold mt-1 ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity absolute -bottom-5 text-white whitespace-nowrap`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};