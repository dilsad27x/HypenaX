import React, { useState } from 'react';
import { AppState, MiningType } from '../../types';
import { ToonButton, ToonCard, ToonModal } from '../ui/ToonComponents';
import { Zap, Lock, Activity, Hammer, Rocket, Copy, Check } from 'lucide-react';

interface HomeViewProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const HomeView: React.FC<HomeViewProps> = ({ appState, setAppState }) => {
  const [showTonConfirm, setShowTonConfirm] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [animatingStart, setAnimatingStart] = useState(false);
  const [copied, setCopied] = useState(false);

  const walletAddress = "UQAHhbenPmLJk4BdhEOSDV1YRu3HlsA1wgx3OLeIdj7I7W0p";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMining = () => {
    if (appState.miningType === 'TON' && !appState.isMining) {
      // Logic handled via modal
      setShowTonConfirm(true);
      return;
    }
    
    if (!appState.isMining) {
        // Start Animation
        setAnimatingStart(true);
        setTimeout(() => {
            setAnimatingStart(false);
            setAppState(prev => ({ ...prev, isMining: true }));
        }, 800); // Animation duration
    } else {
        setAppState(prev => ({ ...prev, isMining: false }));
    }
  };

  const switchType = (type: MiningType) => {
    if (appState.miningType === type) return;
    // If switching, stop mining first to avoid confusion or leaks
    setAppState(prev => ({ ...prev, miningType: type, isMining: false }));
  };

  const confirmTonPurchase = () => {
    setPurchaseLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPurchaseLoading(false);
      setShowTonConfirm(false);
      // Trigger start animation
      setAnimatingStart(true);
      setTimeout(() => {
          setAnimatingStart(false);
          setAppState(prev => ({ ...prev, isMining: true, miningType: 'TON' }));
      }, 800);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Mode Selector */}
      <div className="bg-hyp-card p-1 rounded-2xl flex shadow-inner border border-slate-600">
        <button
          onClick={() => switchType('HYPENAX')}
          className={`flex-1 py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 ${
            appState.miningType === 'HYPENAX' 
              ? 'bg-hyp-purple text-white shadow-md scale-105 z-10' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap size={18} fill={appState.miningType === 'HYPENAX' ? "currentColor" : "none"} />
          HYPENAX
        </button>
        <button
          onClick={() => switchType('TON')}
          className={`flex-1 py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 ${
            appState.miningType === 'TON' 
              ? 'bg-[#0098EA] text-white shadow-md scale-105 z-10' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <img src="https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=025" alt="TON" className="w-5 h-5" />
          TON
        </button>
      </div>

      {/* Main Mining Visual */}
      <div className="relative flex justify-center py-8">
        {/* Background Pulse Animation when mining */}
        {appState.isMining && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className={`w-48 h-48 rounded-full animate-ping ${appState.miningType === 'TON' ? 'bg-[#0098EA]/20' : 'bg-hyp-purple/20'}`} />
             <div className={`w-64 h-64 rounded-full animate-ping delay-100 ${appState.miningType === 'TON' ? 'bg-[#0098EA]/10' : 'bg-hyp-purple/10'}`} />
          </div>
        )}

        <div className={`relative z-10 w-64 h-64 transition-transform duration-500 ${animatingStart ? 'scale-110 rotate-3' : 'scale-100'}`}>
           {/* Character/Icon Representation */}
           <div className={`w-full h-full rounded-full border-8 shadow-[0_0_50px_rgba(139,92,246,0.3)] flex items-center justify-center bg-gradient-to-br transition-colors duration-500 ${
             appState.miningType === 'HYPENAX' 
                ? 'from-hyp-purple to-hyp-purple-dark border-hyp-purple-dark' 
                : 'from-hyp-cyan to-hyp-cyan-dark border-hyp-cyan-dark'
           }`}>
              <div className={`text-center transition-all duration-500 ${animatingStart ? 'scale-125' : 'scale-100'}`}>
                 {appState.miningType === 'HYPENAX' ? (
                   <div className="relative">
                       <Hammer 
                         size={80} 
                         className={`text-white/90 origin-bottom-right transition-all duration-300 ${appState.isMining ? 'animate-[bounce_1s_infinite]' : ''} ${animatingStart ? '-rotate-45' : 'rotate-0'}`} 
                       />
                       {appState.isMining && (
                           <div className="absolute -top-4 -right-4">
                               <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                           </div>
                       )}
                   </div>
                 ) : (
                   <div className="relative">
                       <Rocket 
                         size={80} 
                         className={`text-white/90 transition-all duration-500 ${appState.isMining ? 'animate-[pulse_1.5s_infinite]' : ''} ${animatingStart ? '-translate-y-10' : 'translate-y-0'}`} 
                       />
                       {(appState.isMining || animatingStart) && (
                           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-4 h-12 bg-gradient-to-t from-transparent to-orange-500 opacity-80 blur-sm" />
                       )}
                   </div>
                 )}
                 <div className="mt-4 text-2xl font-black text-white tracking-widest">
                   {animatingStart ? 'STARTING...' : (appState.isMining ? 'MINING' : 'IDLE')}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <ToonCard className="flex flex-col items-center justify-center py-4 transition-colors hover:bg-slate-700/50">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Session Mined</div>
          <div className={`text-xl font-black transition-all ${appState.isMining ? 'scale-110 text-green-400' : 'text-white'}`}>
             {(appState.miningType === 'TON' ? appState.tonBalance : appState.balance * 0.05).toFixed(4)}
          </div>
        </ToonCard>
        <ToonCard className="flex flex-col items-center justify-center py-4 transition-colors hover:bg-slate-700/50">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Current Rate</div>
          <div className="text-xl font-black text-white flex items-center gap-1">
            {appState.miningType === 'TON' ? (
              <span className="text-[#0098EA]">0.00007/s</span>
            ) : (
              <span className="text-hyp-purple">Auto</span>
            )}
          </div>
        </ToonCard>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <ToonButton 
          fullWidth 
          variant={appState.isMining ? 'danger' : (appState.miningType === 'TON' ? 'ton' : 'primary')}
          onClick={toggleMining}
          className="text-lg py-4 overflow-hidden relative"
          disabled={animatingStart}
        >
          {/* Button Shimmer Effect */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="w-12 h-full bg-white/20 skew-x-12 absolute top-0 -left-12 animate-[shimmer_2s_infinite]" />
          </div>
          
          <span className="relative z-10">
              {animatingStart 
                ? 'INITIALIZING...' 
                : (appState.isMining 
                    ? 'STOP MINING' 
                    : (appState.miningType === 'TON' ? 'ACTIVATE MINER (0.7 TON)' : 'START MINING')
                  )
              }
          </span>
        </ToonButton>
      </div>

      {/* TON Confirmation Modal */}
      <ToonModal 
        isOpen={showTonConfirm} 
        onClose={() => setShowTonConfirm(false)}
        title="Start TON Mining"
      >
        <div className="flex flex-col gap-4">
          <div className="bg-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0098EA] flex items-center justify-center text-white font-bold text-xl shrink-0">
              T
            </div>
            <div>
              <div className="text-white font-bold">High Speed Miner</div>
              <div className="text-[#0098EA] text-sm font-bold">Rate: 0.00007 TON/sec</div>
            </div>
          </div>
          
          <div className="text-slate-300 text-sm text-center">
            Send <span className="text-white font-bold text-lg">0.7 TON</span> to start:
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-2 relative overflow-hidden">
             <div className="text-xs text-slate-400 break-all font-mono select-all">
               {walletAddress}
             </div>
             <button onClick={handleCopy} className="p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition-colors shrink-0 border border-slate-600 active:scale-95">
               {copied ? <Check size={16} className="text-green-400"/> : <Copy size={16} />}
             </button>
          </div>

          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-[pulse_2s_infinite]" style={{width: '100%'}} />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <ToonButton variant="secondary" onClick={() => setShowTonConfirm(false)}>
              Cancel
            </ToonButton>
            <ToonButton variant="ton" onClick={confirmTonPurchase} isLoading={purchaseLoading}>
              I Sent Payment
            </ToonButton>
          </div>
        </div>
      </ToonModal>
      
      {/* Add global keyframes for shimmer if not exists */}
      <style>{`
        @keyframes shimmer {
            0% { transform: translateX(0) skewX(-12deg); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(400px) skewX(-12deg); opacity: 0; }
        }
      `}</style>

    </div>
  );
};