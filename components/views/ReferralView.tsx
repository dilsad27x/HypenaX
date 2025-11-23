import React from 'react';
import { ToonButton, ToonCard } from '../ui/ToonComponents';
import { Users, Copy, Share2, Trophy } from 'lucide-react';

export const ReferralView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-hyp-cyan to-hyp-purple rounded-[2rem] p-8 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
           <h2 className="text-3xl font-black text-white mb-2">Invite Friends!</h2>
           <p className="text-white/90 font-bold mb-6">You and your friend will both receive 2,500 HYPENAX coins.</p>
           
           <div className="flex gap-3 justify-center">
             <ToonButton className="bg-white text-hyp-purple hover:bg-gray-100 shadow-[0_6px_0_rgba(0,0,0,0.2)]">
               <Share2 size={20} /> Invite
             </ToonButton>
             <button className="bg-white/20 p-3 rounded-2xl text-white hover:bg-white/30 transition-colors">
               <Copy size={24} />
             </button>
           </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-black text-white">Your Friends (3)</h3>
        <button className="text-hyp-purple font-bold text-sm">View All</button>
      </div>

      <div className="flex flex-col gap-3">
        {['Alex', 'Sarah', 'Mike'].map((name, i) => (
          <div key={i} className="bg-hyp-card rounded-2xl p-4 flex items-center justify-between border border-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                 {name[0]}
              </div>
              <span className="font-bold text-white">{name}</span>
            </div>
            <div className="text-green-400 font-bold text-sm">+2.5K</div>
          </div>
        ))}
      </div>

      <ToonCard className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50">
         <div className="flex items-center gap-4">
            <Trophy className="text-yellow-400 w-12 h-12" />
            <div>
               <h4 className="text-white font-black text-lg">Weekly Leaderboard</h4>
               <p className="text-slate-400 text-xs">Top 100 referrers win 100 TON</p>
            </div>
         </div>
      </ToonCard>
    </div>
  );
};