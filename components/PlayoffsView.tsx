import React, { useState } from 'react';
import { Match, PlayoffPath, Group, Team } from '../types';
import { Trophy, ChevronRight } from 'lucide-react';

export default function PlayoffsView({ 
  isAdmin, 
  playoffs, 
  setPlayoffs, 
  groups, 
  setGroups 
}: { 
  isAdmin: boolean, 
  playoffs: PlayoffPath[], 
  setPlayoffs: React.Dispatch<React.SetStateAction<PlayoffPath[]>>,
  groups: Group[],
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>
}) {
  const handleScoreChange = (pathId: string, matchId: string, team: 'home' | 'away', value: string) => {
    const score = value ? parseInt(value, 10) : null;
    
    setPlayoffs(prevPaths => {
      const newPaths = [...prevPaths];
      const pathIndex = newPaths.findIndex(p => p.id === pathId);
      if (pathIndex === -1) return prevPaths;
      
      const path = { ...newPaths[pathIndex] };
      const matchIndex = path.matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prevPaths;

      const match = { ...path.matches[matchIndex] };
      if (team === 'home') match.homeScore = score;
      else match.awayScore = score;
      
      match.isFinished = match.homeScore !== null && match.awayScore !== null;
      path.matches[matchIndex] = match;

      // Determine winner
      let winner: Team | undefined;
      if (match.isFinished) {
        if (match.homeScore! > match.awayScore!) winner = match.homeTeam;
        else if (match.awayScore! > match.homeScore!) winner = match.awayTeam;
      }

      if (match.stage === 'PLAYOFF_SF') {
        const finalMatchIndex = path.matches.findIndex(m => m.stage === 'PLAYOFF_F');
        if (finalMatchIndex !== -1) {
          const finalMatch = { ...path.matches[finalMatchIndex] };
          const sfMatches = path.matches.filter(m => m.stage === 'PLAYOFF_SF');
          if (sfMatches[0].id === match.id) {
            if (path.id === 'path5' || path.id === 'path6') finalMatch.awayTeam = winner;
            else finalMatch.homeTeam = winner;
          } else {
            finalMatch.awayTeam = winner;
          }
          path.matches[finalMatchIndex] = finalMatch;
        }
      } else if (match.stage === 'PLAYOFF_F') {
        // Update groups
        setGroups(prevGroups => prevGroups.map(g => {
          if (g.name === path.winnerGoesToGroup) {
            const pathTeams = path.matches.flatMap(m => [m.homeTeam, m.awayTeam]).filter(Boolean) as Team[];
            const pathTeamIds = pathTeams.map(t => t.id);
            const otherTeams = g.teams.filter(t => !pathTeamIds.includes(t.id));
            if (winner) {
              return { ...g, teams: [...otherTeams, winner] };
            } else {
              return { ...g, teams: otherTeams };
            }
          }
          return g;
        }));
      }

      newPaths[pathIndex] = path;
      return newPaths;
    });
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-full shrink-0">
          <Trophy className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-emerald-400 text-sm">Apuramento Final</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Os vencedores das finais de cada caminho (Path) garantem as últimas 6 vagas e são automaticamente colocados nos respetivos grupos.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {playoffs.map((path) => (
          <div key={path.id} className="bg-[#131B2F] border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800/60 flex justify-between items-center">
              <h3 className="font-bold text-white tracking-wide">{path.name}</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                Vencedor vai para {path.winnerGoesToGroup}
              </span>
            </div>
            
            <div className="p-4 space-y-4">
              {path.matches.map((match, index) => (
                <div key={match.id} className="relative">
                  {/* Etiqueta da Fase */}
                  <div className="flex justify-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-[#0B1120] px-3 py-1 rounded-full border border-slate-800">
                      {match.stage === 'PLAYOFF_SF' ? `Meia-Final ${index + 1}` : 'Final do Playoff'}
                    </span>
                  </div>
                  
                  {/* Cartão do Jogo */}
                  <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 flex justify-between items-center group">
                    {/* Equipa Casa */}
                    <div className="flex flex-col items-center gap-2 w-[35%]">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                        {match.homeTeam ? (
                          <img src={match.homeTeam.flagUrl} alt={match.homeTeam.code} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-600">?</div>
                        )}
                      </div>
                      <span className={`font-bold text-sm text-center leading-tight ${match.homeTeam ? 'text-slate-200' : 'text-slate-500 italic'}`}>
                        {match.homeTeam?.name || match.homePlaceholder}
                      </span>
                    </div>

                    {/* Resultado */}
                    <div className="flex flex-col items-center justify-center w-[30%]">
                      {isAdmin ? (
                        <div className="flex items-center justify-center gap-1.5 bg-[#131B2F] px-2 py-1 rounded-lg border border-slate-700 shadow-inner min-w-[64px]">
                          <input 
                            type="number" 
                            className="w-6 h-6 bg-transparent text-center font-black text-white text-lg focus:outline-none focus:text-emerald-400 p-0 m-0 leading-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={match.homeScore ?? ''}
                            onChange={(e) => handleScoreChange(path.id, match.id, 'home', e.target.value)}
                            placeholder="-"
                          />
                          <span className="text-slate-500 text-[10px] font-black leading-none flex items-center h-6">VS</span>
                          <input 
                            type="number" 
                            className="w-6 h-6 bg-transparent text-center font-black text-white text-lg focus:outline-none focus:text-emerald-400 p-0 m-0 leading-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={match.awayScore ?? ''}
                            onChange={(e) => handleScoreChange(path.id, match.id, 'away', e.target.value)}
                            placeholder="-"
                          />
                        </div>
                      ) : match.isFinished ? (
                        <div className="flex items-center justify-center gap-1.5 bg-[#131B2F] px-2 py-1 rounded-lg border border-slate-700 shadow-inner min-w-[64px]">
                          <span className="font-black text-white text-lg leading-none flex items-center h-6">{match.homeScore}</span>
                          <span className="text-slate-500 text-[10px] font-black leading-none flex items-center h-6">VS</span>
                          <span className="font-black text-white text-lg leading-none flex items-center h-6">{match.awayScore}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black tracking-widest text-slate-600">VS</span>
                          <span className="text-[10px] text-slate-500 font-bold tracking-wider mt-1">{match.date.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Equipa Fora */}
                    <div className="flex flex-col items-center gap-2 w-[35%]">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                        {match.awayTeam ? (
                          <img src={match.awayTeam.flagUrl} alt={match.awayTeam.code} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-600">?</div>
                        )}
                      </div>
                      <span className={`font-bold text-sm text-center leading-tight ${match.awayTeam ? 'text-slate-200' : 'text-slate-500 italic'}`}>
                        {match.awayTeam?.name || match.awayPlaceholder}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
