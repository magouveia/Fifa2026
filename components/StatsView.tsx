import React, { useMemo } from 'react';
import { Trophy, Users, AlertTriangle } from 'lucide-react';
import { Match, MatchEvent } from '../types';

export default function StatsView({ matches }: { matches: Match[] }) {
  const { totalGoals, totalOwnGoals, totalYellows, totalReds, topScorers, topDiscipline } = useMemo(() => {
    let goals = 0;
    let ownGoals = 0;
    let yellows = 0;
    let reds = 0;
    const scorers: Record<string, number> = {};
    const discipline: Record<string, { yellow: number, red: number, points: number }> = {};

    matches.forEach(match => {
      match.events.forEach(event => {
        if (event.type === 'goal') {
          if (event.isOwnGoal) {
            ownGoals++;
          } else {
            goals++;
            scorers[event.player] = (scorers[event.player] || 0) + 1;
          }
        } else if (event.type === 'yellow') {
          yellows++;
          if (!discipline[event.player]) discipline[event.player] = { yellow: 0, red: 0, points: 0 };
          discipline[event.player].yellow++;
          discipline[event.player].points -= 1;
        } else if (event.type === 'red') {
          reds++;
          if (!discipline[event.player]) discipline[event.player] = { yellow: 0, red: 0, points: 0 };
          discipline[event.player].red++;
          discipline[event.player].points -= 4; // Assuming straight red for simplicity here, though logic in standings is more complex
        }
      });
    });

    const sortedScorers = Object.entries(scorers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const sortedDiscipline = Object.entries(discipline)
      .sort((a, b) => a[1].points - b[1].points) // Sort by lowest points (most negative)
      .slice(0, 10);

    return { totalGoals: goals, totalOwnGoals: ownGoals, totalYellows: yellows, totalReds: reds, topScorers: sortedScorers, topDiscipline: sortedDiscipline };
  }, [matches]);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-bold text-amber-400 text-sm">Estatísticas Globais</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Resumo de golos, cartões e outras métricas importantes para o desempate.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#131B2F] border border-slate-800/60 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-md">
          <Trophy className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-lg font-black text-white">{totalGoals}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Golos</span>
        </div>
        <div className="bg-[#131B2F] border border-slate-800/60 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-md">
          <AlertTriangle className="w-4 h-4 text-orange-400 mb-1" />
          <span className="text-lg font-black text-white">{totalOwnGoals}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Auto-Golos</span>
        </div>
        <div className="bg-[#131B2F] border border-slate-800/60 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-md">
          <div className="w-2.5 h-3.5 bg-yellow-400 rounded-sm shadow-sm mb-1"></div>
          <span className="text-lg font-black text-white">{totalYellows}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Amarelos</span>
        </div>
        <div className="bg-[#131B2F] border border-slate-800/60 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-md">
          <div className="w-2.5 h-3.5 bg-red-500 rounded-sm shadow-sm mb-1"></div>
          <span className="text-lg font-black text-white">{totalReds}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Vermelhos</span>
        </div>
      </div>

      <div className="bg-[#131B2F] border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800/60 flex justify-between items-center">
          <h3 className="font-bold text-white tracking-wide">Melhores Marcadores</h3>
        </div>
        <div className="divide-y divide-slate-800/50">
          {topScorers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              Sem dados suficientes.
            </div>
          ) : (
            topScorers.map(([player, goals], index) => (
              <div key={player} className="flex items-center justify-between p-4 bg-[#131B2F] hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-bold w-4">{index + 1}º</span>
                  <span className="font-bold text-slate-200">{player}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-400 text-lg">{goals}</span>
                  <Trophy className="w-4 h-4 text-emerald-500/50" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-[#131B2F] border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800/60 flex justify-between items-center">
          <h3 className="font-bold text-white tracking-wide">Pontos de Disciplina (Piores)</h3>
        </div>
        <div className="divide-y divide-slate-800/50">
          {topDiscipline.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              Sem dados suficientes.
            </div>
          ) : (
            topDiscipline.map(([player, stats], index) => (
              <div key={player} className="flex items-center justify-between p-4 bg-[#131B2F] hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-bold w-4">{index + 1}º</span>
                  <span className="font-bold text-slate-200">{player}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: stats.yellow }).map((_, i) => (
                      <div key={`y-${i}`} className="w-2 h-3 bg-yellow-400 rounded-sm"></div>
                    ))}
                    {Array.from({ length: stats.red }).map((_, i) => (
                      <div key={`r-${i}`} className="w-2 h-3 bg-red-500 rounded-sm"></div>
                    ))}
                  </div>
                  <span className="font-black text-red-400 text-lg w-8 text-right">{stats.points}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
