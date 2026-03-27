import React from 'react';
import { Trophy } from 'lucide-react';
import { Match } from '../types';

export default function BracketView({ matches }: { matches: Match[] }) {
  const knockoutStages = [
    { id: 'R32', label: '16-avos de Final' },
    { id: 'R16', label: 'Oitavos de Final' },
    { id: 'QF', label: 'Quartos de Final' },
    { id: 'SF', label: 'Meias-Finais' },
    { id: '3RD', label: '3º e 4º Lugar' },
    { id: 'FINAL', label: 'Final' },
  ];

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-purple-500/20 rounded-full shrink-0">
          <Trophy className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-purple-400 text-sm">Fase a Eliminar</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Árvore do torneio desde os 16-avos de final até à grande final.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {knockoutStages.map(stage => {
          const stageMatches = matches.filter(m => m.stage === stage.id);
          if (stageMatches.length === 0) return null;

          return (
            <div key={stage.id} className="space-y-4">
              <h4 className="font-bold text-white border-b border-slate-800 pb-2">{stage.label}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stageMatches.map(match => (
                  <div key={match.id} className="bg-[#131B2F] border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex flex-col gap-2 w-[40%]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 shrink-0">
                          {match.homeTeam ? <img src={match.homeTeam.flagUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-600">?</div>}
                        </div>
                        <span className={`text-xs font-bold truncate ${match.homeTeam ? 'text-slate-200' : 'text-slate-500'}`}>{match.homeTeam?.name || match.homePlaceholder}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center w-[20%]">
                      {match.isFinished ? (
                        <div className="bg-[#0B1120] px-2 py-1 rounded border border-slate-700 text-xs font-black text-white">
                          {match.homeScore} - {match.awayScore}
                        </div>
                      ) : (
                        <span className="text-xs font-black text-slate-600">VS</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-[40%] items-end text-right">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 shrink-0">
                          {match.awayTeam ? <img src={match.awayTeam.flagUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-600">?</div>}
                        </div>
                        <span className={`text-xs font-bold truncate ${match.awayTeam ? 'text-slate-200' : 'text-slate-500'}`}>{match.awayTeam?.name || match.awayPlaceholder}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
