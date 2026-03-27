import React, { useState } from 'react';
import { Match, MatchEvent, Group } from '../types';
import { Trophy, Clock, Edit3, PlusCircle, X, Check, ChevronDown } from 'lucide-react';

const STAGES = [
  { id: 'Group', label: 'Fase de Grupos' },
  { id: 'R32', label: '16-avos' },
  { id: 'R16', label: 'Oitavos' },
  { id: 'QF', label: 'Quartos' },
  { id: 'SF', label: 'Meias-Finais' },
  { id: '3RD', label: '3º e 4º Lugar' },
  { id: 'FINAL', label: 'Final' },
];

export default function MatchesView({ isAdmin, matches, setMatches, groups }: { isAdmin: boolean, matches: Match[], setMatches: React.Dispatch<React.SetStateAction<Match[]>>, groups: Group[] }) {
  const [activeStage, setActiveStage] = useState('Group');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [eventModal, setEventModal] = useState<{ matchId: string, teamId: string, type: 'goal' | 'yellow' | 'red' } | null>(null);
  const [eventPlayer, setEventPlayer] = useState('');
  const [eventMinute, setEventMinute] = useState('');
  const [isOwnGoal, setIsOwnGoal] = useState(false);

  const filteredMatches = matches.filter(m => m.stage === activeStage);

  const getTeamPlayers = (teamId: string) => {
    for (const group of groups) {
      const team = group.teams.find(t => t.id === teamId);
      if (team && team.players) return team.players;
    }
    return [];
  };

  const handleSaveEvent = () => {
    if (!eventModal || !eventPlayer || !eventMinute) return;
    
    const minute = parseInt(eventMinute, 10);
    if (isNaN(minute)) return;

    const newEvent: MatchEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: eventModal.type,
      player: eventPlayer,
      minute,
      teamId: eventModal.teamId,
      isOwnGoal: isOwnGoal
    };
    
    setMatches(prev => prev.map(m => {
      if (m.id === eventModal.matchId) {
        let homeScore = m.homeScore || 0;
        let awayScore = m.awayScore || 0;
        
        if (eventModal.type === 'goal') {
          if (isOwnGoal) {
            // Own goal counts for the OTHER team
            if (m.homeTeam?.id === eventModal.teamId) awayScore++;
            if (m.awayTeam?.id === eventModal.teamId) homeScore++;
          } else {
            if (m.homeTeam?.id === eventModal.teamId) homeScore++;
            if (m.awayTeam?.id === eventModal.teamId) awayScore++;
          }
        }
        
        return {
          ...m,
          homeScore,
          awayScore,
          isFinished: true,
          events: [...m.events, newEvent].sort((a, b) => a.minute - b.minute)
        };
      }
      return m;
    }));

    setEventModal(null);
    setEventPlayer('');
    setEventMinute('');
    setIsOwnGoal(false);
  };

  const handleDeleteEvent = (matchId: string, eventId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        const eventToDelete = m.events.find(e => e.id === eventId);
        if (!eventToDelete) return m;

        let homeScore = m.homeScore || 0;
        let awayScore = m.awayScore || 0;

        if (eventToDelete.type === 'goal') {
          if (eventToDelete.isOwnGoal) {
            if (m.homeTeam?.id === eventToDelete.teamId) awayScore = Math.max(0, awayScore - 1);
            if (m.awayTeam?.id === eventToDelete.teamId) homeScore = Math.max(0, homeScore - 1);
          } else {
            if (m.homeTeam?.id === eventToDelete.teamId) homeScore = Math.max(0, homeScore - 1);
            if (m.awayTeam?.id === eventToDelete.teamId) awayScore = Math.max(0, awayScore - 1);
          }
        }

        return {
          ...m,
          homeScore,
          awayScore,
          events: m.events.filter(e => e.id !== eventId)
        };
      }
      return m;
    }));
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Sub-Tabs for Stages */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {STAGES.map(stage => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(stage.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all border ${
              activeStage === stage.id
                ? 'bg-emerald-500 text-[#0B1120] border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
            }`}
          >
            {stage.label}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            Nenhum jogo agendado para esta fase ainda.
          </div>
        ) : (
          filteredMatches.map(match => (
            <div key={match.id} className="bg-[#131B2F] border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg group">
              {/* Header do Jogo */}
              <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-800/60 flex justify-between items-center">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Jogo {match.matchNumber}
                </span>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {match.date} • {match.time}
                </div>
              </div>

              {/* Corpo do Jogo */}
              <div 
                className={`p-4 ${activeStage === 'Group' ? 'cursor-pointer hover:bg-slate-800/30 transition-colors' : ''}`}
                onClick={() => activeStage === 'Group' && setExpandedMatchId(prev => prev === match.id ? null : match.id)}
              >
                <div className="flex justify-between items-center">
                  {/* Equipa Casa */}
                  <div className="flex flex-col items-center gap-2 w-[35%]">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                      {match.homeTeam ? (
                        <img src={match.homeTeam.flagUrl} alt={match.homeTeam.code} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-600">?</div>
                      )}
                    </div>
                    <span className="font-bold text-sm text-slate-200 text-center leading-tight">
                      {match.homeTeam?.name || match.homePlaceholder}
                    </span>
                  </div>

                  {/* Resultado */}
                  <div className="flex flex-col items-center justify-center w-[30%]" onClick={e => e.stopPropagation()}>
                    {isAdmin ? (
                      <div className="flex items-center justify-center gap-1.5 bg-[#0B1120] px-2 py-1 rounded-lg border border-slate-700 shadow-inner min-w-[64px]">
                        <input 
                          type="number" 
                          className="w-6 h-6 bg-transparent text-center font-black text-white text-lg focus:outline-none focus:text-emerald-400 p-0 m-0 leading-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={match.homeScore ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMatches(prev => prev.map(m => m.id === match.id ? { ...m, homeScore: val ? parseInt(val) : null, isFinished: val !== '' && m.awayScore !== null } : m));
                          }}
                          placeholder="-"
                        />
                        <span className="text-slate-500 text-[10px] font-black leading-none flex items-center h-6">VS</span>
                        <input 
                          type="number" 
                          className="w-6 h-6 bg-transparent text-center font-black text-white text-lg focus:outline-none focus:text-emerald-400 p-0 m-0 leading-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={match.awayScore ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMatches(prev => prev.map(m => m.id === match.id ? { ...m, awayScore: val ? parseInt(val) : null, isFinished: m.homeScore !== null && val !== '' } : m));
                          }}
                          placeholder="-"
                        />
                      </div>
                    ) : match.isFinished ? (
                      <div className="flex items-center justify-center gap-1.5 bg-[#0B1120] px-2 py-1 rounded-lg border border-slate-700 shadow-inner min-w-[64px]">
                        <span className="font-black text-white text-lg leading-none flex items-center h-6">{match.homeScore}</span>
                        <span className="text-slate-500 text-[10px] font-black leading-none flex items-center h-6">VS</span>
                        <span className="font-black text-white text-lg leading-none flex items-center h-6">{match.awayScore}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-black tracking-widest text-slate-600">VS</span>
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
                    <span className="font-bold text-sm text-slate-200 text-center leading-tight">
                      {match.awayTeam?.name || match.awayPlaceholder}
                    </span>
                  </div>
                </div>

                {/* Chevron icon to indicate expandability */}
                {activeStage === 'Group' && (
                  <div className="flex justify-center mt-3">
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedMatchId === match.id ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </div>

              {/* Expandable Content */}
              {activeStage === 'Group' && (
                <div className={`overflow-hidden transition-all duration-300 ${expandedMatchId === match.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4">
                    {/* Eventos (Golos, Cartões) */}
                {match.events.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/50 space-y-2">
                    {match.events.map(event => (
                      <div key={event.id} className="flex items-center justify-between text-xs group/event">
                        {/* Evento Casa */}
                        <div className="w-[45%] text-right flex items-center justify-end gap-2">
                          {event.teamId === match.homeTeam?.id && (
                            <>
                              {isAdmin && (
                                <button onClick={() => handleDeleteEvent(match.id, event.id)} className="opacity-0 group-hover/event:opacity-100 text-red-500 hover:text-red-400 transition-opacity">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                              <span className="text-slate-300 font-medium">{event.player} {event.isOwnGoal && '(AG)'}</span>
                              <span className="text-emerald-400 font-bold">{event.minute}'</span>
                              {event.type === 'goal' && <Trophy className="w-3 h-3 text-emerald-400" />}
                              {event.type === 'yellow' && <div className="w-2 h-3 bg-yellow-400 rounded-sm"></div>}
                              {event.type === 'red' && <div className="w-2 h-3 bg-red-500 rounded-sm"></div>}
                            </>
                          )}
                        </div>
                        
                        <div className="w-[10%] flex justify-center text-slate-600 text-[10px]">⚽</div>
                        
                        {/* Evento Fora */}
                        <div className="w-[45%] text-left flex items-center justify-start gap-2">
                          {event.teamId === match.awayTeam?.id && (
                            <>
                              {event.type === 'goal' && <Trophy className="w-3 h-3 text-emerald-400" />}
                              {event.type === 'yellow' && <div className="w-2 h-3 bg-yellow-400 rounded-sm"></div>}
                              {event.type === 'red' && <div className="w-2 h-3 bg-red-500 rounded-sm"></div>}
                              <span className="text-emerald-400 font-bold">{event.minute}'</span>
                              <span className="text-slate-300 font-medium">{event.player} {event.isOwnGoal && '(AG)'}</span>
                              {isAdmin && (
                                <button onClick={() => handleDeleteEvent(match.id, event.id)} className="opacity-0 group-hover/event:opacity-100 text-red-500 hover:text-red-400 transition-opacity">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botões de Admin (Adicionar Eventos) */}
                {isAdmin && match.homeTeam && match.awayTeam && (
                  <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-col gap-2">
                    <div className="flex justify-between gap-2">
                      <button 
                        onClick={() => setEventModal({ matchId: match.id, teamId: match.homeTeam!.id, type: 'goal' })}
                        className="flex-1 py-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-xs font-bold text-emerald-400 border border-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3 h-3" /> Golo Casa
                      </button>
                      <button 
                        onClick={() => setEventModal({ matchId: match.id, teamId: match.awayTeam!.id, type: 'goal' })}
                        className="flex-1 py-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-xs font-bold text-emerald-400 border border-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3 h-3" /> Golo Fora
                      </button>
                    </div>
                    <div className="flex justify-between gap-2">
                      <button 
                        onClick={() => setEventModal({ matchId: match.id, teamId: match.homeTeam!.id, type: 'yellow' })}
                        className="flex-1 py-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-xs font-bold text-yellow-400 border border-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3 h-3" /> Amarelo Casa
                      </button>
                      <button 
                        onClick={() => setEventModal({ matchId: match.id, teamId: match.awayTeam!.id, type: 'yellow' })}
                        className="flex-1 py-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-xs font-bold text-yellow-400 border border-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3 h-3" /> Amarelo Fora
                      </button>
                    </div>
                    <div className="flex justify-between gap-2">
                      <button 
                        onClick={() => setEventModal({ matchId: match.id, teamId: match.homeTeam!.id, type: 'red' })}
                        className="flex-1 py-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-xs font-bold text-red-500 border border-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3 h-3" /> Vermelho Casa
                      </button>
                      <button 
                        onClick={() => setEventModal({ matchId: match.id, teamId: match.awayTeam!.id, type: 'red' })}
                        className="flex-1 py-1.5 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-xs font-bold text-red-500 border border-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3 h-3" /> Vermelho Fora
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        ))
      )}
    </div>

      {/* Event Modal */}
      {eventModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#131B2F] w-full max-w-sm rounded-3xl border border-slate-800 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Adicionar {eventModal.type === 'goal' ? 'Golo' : eventModal.type === 'yellow' ? 'Cartão Amarelo' : 'Cartão Vermelho'}
              </h3>
              <button onClick={() => setEventModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Jogador</label>
                <select 
                  value={eventPlayer}
                  onChange={e => setEventPlayer(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Selecione um jogador...</option>
                  {getTeamPlayers(eventModal.teamId).map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                  ))}
                  {getTeamPlayers(eventModal.teamId).length === 0 && (
                    <option value="Jogador Desconhecido">Jogador Desconhecido (Adicione jogadores no grupo)</option>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Minuto</label>
                <input 
                  type="number" 
                  placeholder="Ex: 45"
                  value={eventMinute}
                  onChange={e => setEventMinute(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {eventModal.type === 'goal' && (
                <label className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 cursor-pointer">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isOwnGoal ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                    {isOwnGoal && <Check className="w-3 h-3 text-[#0B1120]" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={isOwnGoal} onChange={e => setIsOwnGoal(e.target.checked)} />
                  <span className="text-sm font-medium text-slate-300">Auto-golo (AG)</span>
                </label>
              )}

              <button 
                onClick={handleSaveEvent}
                disabled={!eventPlayer || !eventMinute}
                className="w-full py-3 mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-[#0B1120] rounded-xl font-bold transition-colors"
              >
                Guardar Evento
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
