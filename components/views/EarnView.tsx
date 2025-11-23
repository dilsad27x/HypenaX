import React, { useState } from 'react';
import { MOCK_TASKS } from '../../constants';
import { ToonButton, ToonCard } from '../ui/ToonComponents';
import { PlayCircle, MessageCircle, Twitter, CheckCircle2, Gift } from 'lucide-react';
import { AppState } from '../../types';

interface EarnViewProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const EarnView: React.FC<EarnViewProps> = ({ appState, setAppState }) => {
  const [claiming, setClaiming] = useState(false);

  const handleClaimReward = () => {
    if (appState.dailyRewardClaimed) return;
    
    setClaiming(true);
    
    // Simulate API/Animation delay
    setTimeout(() => {
      setAppState(prev => ({
        ...prev,
        balance: prev.balance + 1000, // Daily reward amount
        dailyRewardClaimed: true
      }));
      setClaiming(false);
    }, 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'tg': return <MessageCircle className="text-blue-400" />;
      case 'x': return <Twitter className="text-white" />;
      case 'yt': return <PlayCircle className="text-red-500" />;
      default: return <CheckCircle2 className="text-green-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center py-4">
        <h2 className="text-3xl font-black text-white mb-2">Earn Coins</h2>
        <p className="text-slate-400 font-semibold">Complete tasks to boost your balance</p>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_TASKS.map(task => (
          <ToonCard key={task.id} className="flex items-center justify-between p-4 group active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border-2 border-slate-600">
                {getIcon(task.icon)}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg">{task.title}</span>
                <span className="text-yellow-400 font-bold flex items-center gap-1 text-sm">
                  +{task.reward} COINS
                </span>
              </div>
            </div>
            
            <ToonButton variant="secondary" className="!py-2 !px-4 text-sm">
              Start
            </ToonButton>
          </ToonCard>
        ))}
      </div>

      <ToonCard title="Daily Rewards" className="mt-4 bg-gradient-to-br from-hyp-purple to-hyp-pink border-none">
         <div className="flex justify-between mt-2">
            {[1, 2, 3, 4, 5, 6].map((day) => (
               <div key={day} className={`flex flex-col items-center p-2 rounded-xl ${day === 1 ? 'bg-white/20 ring-2 ring-white' : 'bg-black/10'}`}>
                  <span className="text-xs font-bold text-white/80">Day {day}</span>
                  <div className={`w-6 h-6 rounded-full mt-1 shadow-sm flex items-center justify-center transition-all ${day === 1 && appState.dailyRewardClaimed ? 'bg-green-400 scale-110' : 'bg-yellow-400'}`}>
                    {day === 1 && appState.dailyRewardClaimed && <CheckCircle2 size={14} className="text-white" />}
                  </div>
               </div>
            ))}
         </div>
         
         <div className="mt-6">
            <ToonButton 
              fullWidth
              className={`${
                appState.dailyRewardClaimed 
                  ? 'bg-green-500 text-white shadow-[0_6px_0_rgb(21,128,61)]' 
                  : 'bg-white text-hyp-pink hover:bg-white/90 shadow-[0_6px_0_rgba(0,0,0,0.2)]'
              }`} 
              onClick={handleClaimReward}
              isLoading={claiming}
              disabled={appState.dailyRewardClaimed}
            >
               {appState.dailyRewardClaimed ? (
                 <span className="flex items-center gap-2">
                   <CheckCircle2 size={20} /> Claimed for Today
                 </span>
               ) : (
                 <span className="flex items-center gap-2">
                   <Gift size={20} /> Claim Daily Reward (+1000)
                 </span>
               )}
            </ToonButton>
         </div>
      </ToonCard>
    </div>
  );
};