import React, { useState, useRef } from 'react';
import { AppState } from '../../types';
import { ToonButton, ToonModal } from '../ui/ToonComponents';
import { 
  Wallet, Settings, Bell, Shield, ChevronRight, LogOut, 
  Palette, Volume2, Copy, QrCode, CheckCircle2, AlertCircle, 
  Zap, Trophy, X, Loader2
} from 'lucide-react';

interface ProfileViewProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

// --- Components ---

// Animated Toggle Switch
const ToggleSwitch = ({ checked, onChange, colorClass = 'bg-green-500' }: { checked: boolean, onChange: () => void, colorClass?: string }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onChange(); }}
        className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative ${checked ? colorClass : 'bg-slate-700'}`}
    >
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

// Advanced 3D Tilt Card with Glare
const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!ref.current) return;
        const node = ref.current;
        const rect = node.getBoundingClientRect();
        
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;

        node.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Update glare position
        setGlare({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
            opacity: 1
        });
    };

    const handleLeave = () => {
        if (!ref.current) return;
        ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    return (
        <div 
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            onTouchMove={handleMove}
            onTouchEnd={handleLeave}
            className={`transition-transform duration-200 ease-out will-change-transform relative overflow-hidden rounded-[2rem] ${className}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Dynamic Glare Overlay */}
            <div 
                className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay transition-opacity duration-200"
                style={{
                    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`,
                    opacity: glare.opacity
                }}
            />
            {children}
        </div>
    );
};

export const ProfileView: React.FC<ProfileViewProps> = ({ appState, setAppState }) => {
  // Modals State
  const [activeModal, setActiveModal] = useState<'deposit' | 'withdraw' | 'security' | 'theme' | null>(null);
  const [connecting, setConnecting] = useState(false);
  
  // Form States
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const levelProgress = (appState.xp % 10000) / 100; 

  const handleConnectWallet = () => {
    if (appState.isConnected) {
        setAppState(prev => ({ ...prev, isConnected: false, walletAddress: null }));
    } else {
        setConnecting(true);
        setTimeout(() => {
            setConnecting(false);
            setAppState(prev => ({ 
                ...prev, 
                isConnected: true, 
                walletAddress: 'UQAHhbenPmLJk4BdhEOSDV1YRu3HlsA1wgx3OLeIdj7I7W0p' 
            }));
        }, 1500);
    }
  };

  const handleProcess = (action: string) => {
    setProcessing(true);
    setTimeout(() => {
        setProcessing(false);
        setSuccessMsg(`${action} Successful!`);
        setTimeout(() => {
            setSuccessMsg(null);
            setActiveModal(null);
            setWithdrawAddress('');
            setWithdrawAmount('');
        }, 1500);
    }, 2000);
  };

  const toggleSetting = (key: 'soundEnabled' | 'notificationsEnabled') => {
    setAppState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const changeTheme = (theme: AppState['theme']) => {
    setAppState(prev => ({ ...prev, theme }));
    setActiveModal(null);
  };

  // Settings Configuration
  const settingsItems = [
    { 
      id: 'theme', 
      icon: Palette, 
      label: 'Theme', 
      color: 'text-hyp-pink', 
      type: 'select',
      value: appState.theme, 
      action: () => setActiveModal('theme') 
    },
    { 
      id: 'sound', 
      icon: Volume2, 
      label: 'Sound Effects', 
      color: 'text-hyp-cyan', 
      type: 'toggle',
      checked: appState.soundEnabled,
      action: () => toggleSetting('soundEnabled') 
    },
    { 
      id: 'notifications', 
      icon: Bell, 
      label: 'Notifications', 
      color: 'text-yellow-400', 
      type: 'toggle',
      checked: appState.notificationsEnabled,
      action: () => toggleSetting('notificationsEnabled') 
    },
    { 
      id: 'security', 
      icon: Shield, 
      label: 'Security', 
      color: 'text-green-400', 
      type: 'select',
      value: 'Pin Setup', 
      action: () => setActiveModal('security') 
    },
    { 
      id: 'language', 
      icon: Settings, 
      label: 'Language', 
      color: 'text-blue-400', 
      type: 'select',
      value: 'English', 
      action: () => {} 
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Avatar Section */}
      <div className="relative flex flex-col items-center pt-8 pb-2">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-hyp-purple/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
         
         <div className="relative w-28 h-28 mb-4 group cursor-pointer perspective-[1000px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-hyp-cyan to-hyp-purple animate-spin-slow blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-full h-full rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-2xl transform transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-12 hover:scale-105">
                 <img 
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${appState.walletAddress || 'User'}&backgroundColor=b6e3f4`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                 />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 border border-slate-700 shadow-lg z-10">
                <div className={`w-4 h-4 rounded-full ${appState.isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
            </div>
         </div>

         <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
             {appState.isConnected ? 'Crypto Whale' : 'Anonymous Miner'}
         </h2>
         
         <div className="mt-2 flex items-center gap-2 bg-slate-800/80 backdrop-blur px-4 py-1.5 rounded-full border border-slate-600 shadow-lg">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">Lvl {appState.level}</span>
            <div className="w-[1px] h-4 bg-slate-600 mx-1" />
            <span className="text-xs text-slate-400 font-mono">{appState.xp.toLocaleString()} XP</span>
         </div>

         <div className="w-2/3 max-w-xs mt-4 relative h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
            <div 
                className="h-full bg-gradient-to-r from-hyp-purple to-hyp-pink relative transition-all duration-1000"
                style={{ width: `${levelProgress}%` }}
            >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white drop-shadow-md">
                {levelProgress.toFixed(0)}% TO NEXT LEVEL
            </span>
         </div>
      </div>

      {/* 3D Wallet Card */}
      <div className="px-2">
        <TiltCard>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl relative group h-full">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                        <Wallet className="text-hyp-cyan" size={24} />
                    </div>
                    <div className="flex flex-col items-end">
                    <span className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-1">Total Balance</span>
                    <span className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
                        ${(appState.balance * 0.04 + appState.tonBalance * 6.5).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    </div>
                </div>

                <div className="flex gap-3 relative z-10">
                    <button 
                        onClick={handleConnectWallet}
                        disabled={connecting}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                            appState.isConnected 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20' 
                            : 'bg-hyp-purple text-white hover:bg-hyp-purple-dark'
                        }`}
                    >
                        {connecting ? <Loader2 className="animate-spin" size={18} /> : (appState.isConnected ? <X size={18} /> : <Zap size={18} />)}
                        {appState.isConnected ? 'Disconnect' : 'Connect Wallet'}
                    </button>
                    {appState.isConnected && (
                        <>
                            <button onClick={() => setActiveModal('deposit')} className="flex-1 bg-slate-700 text-white rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors shadow-lg active:scale-95 border border-slate-600">
                                Deposit
                            </button>
                            <button onClick={() => setActiveModal('withdraw')} className="flex-1 bg-slate-700 text-white rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors shadow-lg active:scale-95 border border-slate-600">
                                Withdraw
                            </button>
                        </>
                    )}
                </div>
                
                {appState.isConnected && (
                    <div className="mt-4 flex items-center justify-center gap-2 bg-black/20 py-2 rounded-lg border border-white/5 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-slate-300 truncate max-w-[200px]">
                            {appState.walletAddress?.slice(0, 6)}...{appState.walletAddress?.slice(-6)}
                        </span>
                        <Copy size={12} className="text-slate-500 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(appState.walletAddress || '')} />
                    </div>
                )}
            </div>
        </TiltCard>
      </div>

      {/* Settings Menu */}
      <div className="bg-hyp-card rounded-3xl overflow-hidden border-2 border-slate-600 shadow-xl mx-2">
         {settingsItems.map((item, i) => (
           <div 
             key={i} 
             onClick={item.type === 'select' ? item.action : undefined}
             className={`w-full flex items-center justify-between p-5 border-b border-slate-600/50 last:border-0 transition-all ${item.type === 'select' ? 'cursor-pointer hover:bg-slate-700/50 active:bg-slate-700' : ''}`}
           >
             <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-slate-800/50 ${item.color}`}>
                    <item.icon size={20} />
                </div>
                <span className="font-bold text-white text-left">{item.label}</span>
             </div>
             
             <div className="flex items-center gap-3">
                {item.type === 'toggle' ? (
                   <ToggleSwitch checked={!!item.checked} onChange={item.action} />
                ) : (
                   <>
                     {item.value && (
                         <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-800 text-slate-400">
                             {item.value}
                         </span>
                     )}
                     <ChevronRight className="text-slate-600" size={18} />
                   </>
                )}
             </div>
           </div>
         ))}
      </div>
      
      <ToonButton variant="secondary" className="mt-2 mx-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-none border border-red-500/50 active:bg-red-500/30">
         <LogOut size={18} /> Log Out Session
      </ToonButton>

      {/* --- MODALS --- */}

      {/* Deposit Modal */}
      <ToonModal isOpen={activeModal === 'deposit'} onClose={() => setActiveModal(null)} title="Deposit Assets">
         <div className="flex flex-col items-center gap-6 pt-2">
             <div className="bg-white p-4 rounded-2xl shadow-inner">
                 <QrCode size={150} className="text-slate-900" />
             </div>
             <div className="w-full">
                 <div className="text-slate-400 text-xs font-bold mb-2 text-center">SEND ONLY TON (TONCOIN)</div>
                 <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-2">
                     <span className="font-mono text-xs text-slate-300 truncate">{appState.walletAddress}</span>
                     <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-hyp-cyan">
                         <Copy size={16} />
                     </button>
                 </div>
             </div>
             <div className="flex gap-2 w-full">
                 <ToonButton variant="secondary" fullWidth onClick={() => setActiveModal(null)}>Close</ToonButton>
                 <ToonButton fullWidth onClick={() => handleProcess('Check Deposit')} isLoading={processing}>I Sent It</ToonButton>
             </div>
             {successMsg && <div className="text-green-400 font-bold text-sm animate-bounce">{successMsg}</div>}
         </div>
      </ToonModal>

      {/* Withdraw Modal */}
      <ToonModal isOpen={activeModal === 'withdraw'} onClose={() => setActiveModal(null)} title="Withdraw Funds">
         <div className="flex flex-col gap-4 pt-2">
             <div className="bg-yellow-500/10 border border-yellow-500/50 p-3 rounded-xl flex items-start gap-3">
                 <AlertCircle className="text-yellow-500 shrink-0" size={20} />
                 <p className="text-yellow-200 text-xs leading-relaxed">
                    Minimum withdrawal is 5.0 TON. Ensure you are using the correct network (The Open Network).
                 </p>
             </div>
             
             <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-400 ml-1">Destination Address</label>
                 <div className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 flex items-center gap-2 focus-within:border-hyp-purple transition-colors">
                     <Wallet size={16} className="text-slate-500" />
                     <input 
                        type="text" 
                        placeholder="Enter TON Address"
                        className="bg-transparent w-full text-sm text-white placeholder-slate-600 focus:outline-none"
                        value={withdrawAddress}
                        onChange={e => setWithdrawAddress(e.target.value)}
                     />
                 </div>
             </div>

             <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-400 ml-1">Amount (TON)</label>
                 <div className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 flex items-center gap-2 focus-within:border-hyp-purple transition-colors">
                     <span className="text-slate-500 font-bold text-sm">TON</span>
                     <input 
                        type="number" 
                        placeholder="0.00"
                        className="bg-transparent w-full text-sm text-white placeholder-slate-600 focus:outline-none"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                     />
                     <button className="text-[10px] bg-slate-800 px-2 py-1 rounded text-hyp-cyan font-bold">MAX</button>
                 </div>
             </div>

             <div className="flex gap-2 mt-2">
                 <ToonButton variant="secondary" fullWidth onClick={() => setActiveModal(null)}>Cancel</ToonButton>
                 <ToonButton 
                    variant="ton" 
                    fullWidth 
                    onClick={() => handleProcess('Withdrawal')} 
                    isLoading={processing}
                    disabled={!withdrawAddress || !withdrawAmount}
                >
                    Confirm
                </ToonButton>
             </div>
             {successMsg && <div className="text-green-400 font-bold text-sm text-center animate-pulse">{successMsg}</div>}
         </div>
      </ToonModal>

      {/* Theme Modal */}
      <ToonModal isOpen={activeModal === 'theme'} onClose={() => setActiveModal(null)} title="Select Theme">
          <div className="grid grid-cols-1 gap-3">
              {['Dark', 'Light', 'Neon'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => changeTheme(t as AppState['theme'])}
                    className={`p-4 rounded-xl border-2 font-bold flex items-center justify-between transition-all ${appState.theme === t ? 'border-hyp-purple bg-hyp-purple/20 text-white' : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                      <span>{t} Mode</span>
                      {appState.theme === t && <CheckCircle2 className="text-hyp-purple" />}
                  </button>
              ))}
          </div>
      </ToonModal>

      {/* Security Modal */}
      <ToonModal isOpen={activeModal === 'security'} onClose={() => setActiveModal(null)} title="Security Setup">
          <div className="flex flex-col items-center gap-6 py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                  <Shield size={32} />
              </div>
              <p className="text-center text-slate-400 text-sm px-4">
                  Set up a 4-digit PIN to secure your withdrawals and sensitive settings.
              </p>
              <div className="flex gap-4">
                  {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-14 border-b-2 border-slate-500 flex items-center justify-center text-2xl font-black text-white">
                          •
                      </div>
                  ))}
              </div>
              <ToonButton fullWidth onClick={() => handleProcess('PIN Setup')} isLoading={processing}>
                  Set PIN Code
              </ToonButton>
          </div>
      </ToonModal>

    </div>
  );
};