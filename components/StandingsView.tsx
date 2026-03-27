import React, { useMemo } from 'react';
import { Match, MatchEvent, GroupStanding, Group } from '../types';
import { Trophy } from 'lucide-react';

const calculateFairPlay = (events: MatchEvent[], teamId: string) => {
  const teamEvents = events.filter(e => e.teamId === teamId && e.type !== 'goal');
  const playerPenalties: Record<string, number> = {};
  
  teamEvents.forEach(e => {
    if (!playerPenalties[e.player]) playerPenalties[e.player] = 0;
    
    if (e.type === 'yellow') {
      if (playerPenalties[e.player] === 0) playerPenalties[e.player] = -1;
      else if (playerPenalties[e.player] === -1) playerPenalties[e.player] = -3; // Second yellow
      else if (playerPenalties[e.player] === -4) playerPenalties[e.player] = -5; // Yellow + direct red
    } else if (e.type === 'red') {
      if (playerPenalties[e.player] === 0) playerPenalties[e.player] = -4;
      else if (playerPenalties[e.player] === -1) playerPenalties[e.player] = -5; // Yellow + direct red
    } else if (e.type === 'yellow-red') {
      playerPenalties[e.player] = -3;
    }
  });

  return Object.values(playerPenalties).reduce((sum, penalty) => sum + penalty, 0);
};

const getMiniLeagueStats = (teamId: string, matches: Match[]) => {
  let points = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  matches.forEach(m => {
    if (m.homeTeam?.id === teamId) {
      goalsFor += m.homeScore || 0;
      goalsAgainst += m.awayScore || 0;
      if (m.homeScore! > m.awayScore!) points += 3;
      else if (m.homeScore === m.awayScore) points += 1;
    } else if (m.awayTeam?.id === teamId) {
      goalsFor += m.awayScore || 0;
      goalsAgainst += m.homeScore || 0;
      if (m.awayScore! > m.homeScore!) points += 3;
      else if (m.awayScore === m.homeScore) points += 1;
    }
  });

  return { points, goalDifference: goalsFor - goalsAgainst, goalsFor };
};

const sortTeams = (teams: GroupStanding[], allMatches: Match[]): GroupStanding[] => {
  return [...teams].sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    
    // Tie-breaker for teams with same points
    const tiedTeams = teams.filter(t => t.points === a.points);
    
    if (tiedTeams.length > 1) {
      const miniLeagueMatches = allMatches.filter(m => 
        m.stage === 'Group' && m.isFinished &&
        m.homeTeam && m.awayTeam &&
        tiedTeams.some(t => t.team.id === m.homeTeam!.id) &&
        tiedTeams.some(t => t.team.id === m.awayTeam!.id)
      );
      
      const aStats = getMiniLeagueStats(a.team.id, miniLeagueMatches);
      const bStats = getMiniLeagueStats(b.team.id, miniLeagueMatches);
      
      if (aStats.points !== bStats.points) return bStats.points - aStats.points;
      if (aStats.goalDifference !== bStats.goalDifference) return bStats.goalDifference - aStats.goalDifference;
      if (aStats.goalsFor !== bStats.goalsFor) return bStats.goalsFor - aStats.goalsFor;
    }
    
    // Overall stats
    if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
    if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor;
    if (a.fairPlayPoints !== b.fairPlayPoints) return b.fairPlayPoints - a.fairPlayPoints; // Higher is better (less negative)
    
    // FIFA Ranking (lower number is better, e.g., 1 is best)
    const aRank = a.team.fifaRanking || 999;
    const bRank = b.team.fifaRanking || 999;
    return aRank - bRank;
  });
};

export default function StandingsView({ matches, groups }: { matches: Match[], groups: Group[] }) {
  const { groupStandings, thirdPlacedTeams } = useMemo(() => {
    const standings: Record<string, GroupStanding[]> = {};
    const allThirdPlaced: GroupStanding[] = [];

    groups.forEach(group => {
      const groupTeams: Record<string, GroupStanding> = {};
      
      group.teams.forEach(team => {
        groupTeams[team.id] = {
          team, played: 0, won: 0, drawn: 0, lost: 0,
          goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
          points: 0, fairPlayPoints: 0
        };
      });

      const groupMatches = matches.filter(m => 
        m.stage === 'Group' && m.isFinished && 
        m.homeTeam && m.awayTeam &&
        groupTeams[m.homeTeam.id] && groupTeams[m.awayTeam.id]
      );

      groupMatches.forEach(m => {
        const home = groupTeams[m.homeTeam!.id];
        const away = groupTeams[m.awayTeam!.id];
        const hScore = m.homeScore || 0;
        const aScore = m.awayScore || 0;

        home.played++; away.played++;
        home.goalsFor += hScore; away.goalsFor += aScore;
        home.goalsAgainst += aScore; away.goalsAgainst += hScore;
        home.goalDifference = home.goalsFor - home.goalsAgainst;
        away.goalDifference = away.goalsFor - away.goalsAgainst;

        if (hScore > aScore) {
          home.won++; home.points += 3;
          away.lost++;
        } else if (hScore < aScore) {
          away.won++; away.points += 3;
          home.lost++;
        } else {
          home.drawn++; home.points += 1;
          away.drawn++; away.points += 1;
        }

        home.fairPlayPoints += calculateFairPlay(m.events, home.team.id);
        away.fairPlayPoints += calculateFairPlay(m.events, away.team.id);
      });

      const sortedGroup = sortTeams(Object.values(groupTeams), groupMatches);
      standings[group.name] = sortedGroup;
      
      if (sortedGroup.length >= 3) {
        allThirdPlaced.push(sortedGroup[2]);
      }
    });

    const sortedThirdPlaced = sortTeams(allThirdPlaced, matches).slice(0, 8);

    return { groupStandings: standings, thirdPlacedTeams: sortedThirdPlaced };
  }, [matches]);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-blue-500/20 rounded-full shrink-0">
          <Trophy className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-blue-400 text-sm">Classificações em Tempo Real</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            As tabelas são atualizadas automaticamente com base nos resultados dos jogos. Os 2 primeiros de cada grupo e os 8 melhores 3ºs classificados avançam.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.name} className="bg-[#131B2F] border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800/60 flex justify-between items-center">
              <h3 className="font-bold text-white tracking-wide">{group.name}</h3>
            </div>
            
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase bg-slate-800/30 text-slate-400 border-b border-slate-800/50">
                  <tr>
                    <th className="px-3 py-2 font-bold w-8 text-center">#</th>
                    <th className="px-2 py-2 font-bold">Equipa</th>
                    <th className="px-2 py-2 font-bold text-center w-8">P</th>
                    <th className="px-2 py-2 font-bold text-center w-8">J</th>
                    <th className="px-2 py-2 font-bold text-center w-8">V</th>
                    <th className="px-2 py-2 font-bold text-center w-8">E</th>
                    <th className="px-2 py-2 font-bold text-center w-8">D</th>
                    <th className="px-2 py-2 font-bold text-center w-8">GM</th>
                    <th className="px-2 py-2 font-bold text-center w-8">GS</th>
                    <th className="px-2 py-2 font-bold text-center w-8">DG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {groupStandings[group.name]?.map((standing, index) => (
                    <tr key={standing.team.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                          index < 2 ? 'bg-emerald-500/20 text-emerald-400' : 
                          index === 2 ? 'bg-amber-500/20 text-amber-400' : 
                          'text-slate-500'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                            <img src={standing.team.flagUrl} alt={standing.team.code} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-bold text-slate-200 truncate max-w-[100px]">{standing.team.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-center font-black text-white">{standing.points}</td>
                      <td className="px-2 py-2.5 text-center text-slate-400">{standing.played}</td>
                      <td className="px-2 py-2.5 text-center text-slate-400">{standing.won}</td>
                      <td className="px-2 py-2.5 text-center text-slate-400">{standing.drawn}</td>
                      <td className="px-2 py-2.5 text-center text-slate-400">{standing.lost}</td>
                      <td className="px-2 py-2.5 text-center text-slate-400">{standing.goalsFor}</td>
                      <td className="px-2 py-2.5 text-center text-slate-400">{standing.goalsAgainst}</td>
                      <td className="px-2 py-2.5 text-center text-slate-400">{standing.goalDifference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Ranking dos 8 melhores 3ºs */}
        <div className="bg-[#131B2F] border border-amber-500/30 rounded-2xl overflow-hidden shadow-lg mt-8">
          <div className="bg-amber-500/10 px-4 py-3 border-b border-amber-500/20 flex justify-between items-center">
            <h3 className="font-bold text-amber-400 tracking-wide">Ranking dos 3ºs Classificados</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-1 rounded-full">
              Top 8 Avançam
            </span>
          </div>
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase bg-slate-800/30 text-slate-400 border-b border-slate-800/50">
                <tr>
                  <th className="px-3 py-2 font-bold w-8 text-center">#</th>
                  <th className="px-2 py-2 font-bold">Equipa</th>
                  <th className="px-2 py-2 font-bold text-center w-8">P</th>
                  <th className="px-2 py-2 font-bold text-center w-8">J</th>
                  <th className="px-2 py-2 font-bold text-center w-8">V</th>
                  <th className="px-2 py-2 font-bold text-center w-8">E</th>
                  <th className="px-2 py-2 font-bold text-center w-8">D</th>
                  <th className="px-2 py-2 font-bold text-center w-8">GM</th>
                  <th className="px-2 py-2 font-bold text-center w-8">GS</th>
                  <th className="px-2 py-2 font-bold text-center w-8">DG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {thirdPlacedTeams.map((standing, index) => (
                  <tr key={standing.team.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                        index < 8 ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                          <img src={standing.team.flagUrl} alt={standing.team.code} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-slate-200 truncate max-w-[100px]">{standing.team.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center font-black text-white">{standing.points}</td>
                    <td className="px-2 py-2.5 text-center text-slate-400">{standing.played}</td>
                    <td className="px-2 py-2.5 text-center text-slate-400">{standing.won}</td>
                    <td className="px-2 py-2.5 text-center text-slate-400">{standing.drawn}</td>
                    <td className="px-2 py-2.5 text-center text-slate-400">{standing.lost}</td>
                    <td className="px-2 py-2.5 text-center text-slate-400">{standing.goalsFor}</td>
                    <td className="px-2 py-2.5 text-center text-slate-400">{standing.goalsAgainst}</td>
                    <td className="px-2 py-2.5 text-center text-slate-400">{standing.goalDifference}</td>
                  </tr>
                ))}
                {thirdPlacedTeams.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-slate-400 text-sm">
                      A tabela dos melhores 3ºs classificados será gerada automaticamente com base nos resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
