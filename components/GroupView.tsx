import React, { useState } from 'react';
import { Team, Player, Group, Position } from '../types';
import { X, Users, Plus, Edit2, Trash2 } from 'lucide-react';

export default function GroupView({ isAdmin, groups, setGroups }: { isAdmin: boolean, groups: Group[], setGroups: React.Dispatch<React.SetStateAction<Group[]>> }) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [playerForm, setPlayerForm] = useState<Partial<Player>>({});

  const handleSavePlayer = () => {
    if (!selectedTeam || !playerForm.name || !playerForm.position) return;

    setGroups(prev => prev.map(g => ({
      ...g,
      teams: g.teams.map(t => {
        if (t.id === selectedTeam.id) {
          const currentPlayers = t.players || [];
          let newPlayers;
          
          if (editingPlayer) {
            newPlayers = currentPlayers.map(p => p.id === editingPlayer.id ? { ...p, ...playerForm } as Player : p);
          } else {
            const newPlayer: Player = {
              id: Math.random().toString(36).substr(2, 9),
              name: playerForm.name,
              age: playerForm.age || 0,
              club: playerForm.club || '',
              position: playerForm.position as Position,
              photoUrl: playerForm.photoUrl || `https://i.pravatar.cc/150?u=${Math.random()}`
            };
            newPlayers = [...currentPlayers, newPlayer];
          }
          
          const updatedTeam = { ...t, players: newPlayers };
          setSelectedTeam(updatedTeam); // Update local state for modal
          return updatedTeam;
        }
        return t;
      })
    })));

    setEditingPlayer(null);
    setIsAddingPlayer(false);
    setPlayerForm({});
  };

  const handleDeletePlayer = (playerId: string) => {
    if (!selectedTeam || !confirm('Tem a certeza que quer apagar este jogador?')) return;

    setGroups(prev => prev.map(g => ({
      ...g,
      teams: g.teams.map(t => {
        if (t.id === selectedTeam.id) {
          const newPlayers = (t.players || []).filter(p => p.id !== playerId);
          const updatedTeam = { ...t, players: newPlayers };
          setSelectedTeam(updatedTeam);
          return updatedTeam;
        }
        return t;
      })
    })));
  };

  const openEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setPlayerForm(player);
    setIsAddingPlayer(true);
  };

  const openAddPlayer = () => {
    setEditingPlayer(null);
    setPlayerForm({ position: 'MF' });
    setIsAddingPlayer(true);
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div key={group.name} className="bg-[#131B2F] border border-slate-800/60 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800/60">
              <h3 className="font-bold text-emerald-400 tracking-wide">{group.name}</h3>
            </div>
            <div className="divide-y divide-slate-800/50">
              {group.teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                      <img src={team.flagUrl} alt={team.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{team.name}</span>
                  </div>
                  <Users className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Roster Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#0B1120] w-full sm:max-w-md h-[85vh] sm:h-[80vh] sm:rounded-3xl rounded-t-3xl border border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-[#131B2F] rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                  <img src={selectedTeam.flagUrl} alt={selectedTeam.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg leading-tight">{selectedTeam.name}</h2>
                  <p className="text-xs text-emerald-400 font-medium tracking-wide uppercase">Plantel de 26</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTeam(null)}
                className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Roster List) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">
              {isAdmin && (
                <button 
                  onClick={openAddPlayer}
                  className="w-full py-3 mb-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <Plus className="w-5 h-5" /> Adicionar Jogador
                </button>
              )}
              
              {isAddingPlayer && isAdmin ? (
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-4 mb-4">
                  <h3 className="font-bold text-emerald-400">{editingPlayer ? 'Editar Jogador' : 'Novo Jogador'}</h3>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Nome" 
                      value={playerForm.name || ''} 
                      onChange={e => setPlayerForm({...playerForm, name: e.target.value})}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex gap-3">
                      <input 
                        type="number" 
                        placeholder="Idade" 
                        value={playerForm.age || ''} 
                        onChange={e => setPlayerForm({...playerForm, age: parseInt(e.target.value) || 0})}
                        className="w-1/3 bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                      <select 
                        value={playerForm.position || 'MF'} 
                        onChange={e => setPlayerForm({...playerForm, position: e.target.value as Position})}
                        className="w-2/3 bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="GK">Guarda-Redes (GK)</option>
                        <option value="DF">Defesa (DF)</option>
                        <option value="MF">Médio (MF)</option>
                        <option value="FW">Avançado (FW)</option>
                      </select>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Clube Atual" 
                      value={playerForm.club || ''} 
                      onChange={e => setPlayerForm({...playerForm, club: e.target.value})}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                    <input 
                      type="text" 
                      placeholder="URL da Foto (opcional)" 
                      value={playerForm.photoUrl || ''} 
                      onChange={e => setPlayerForm({...playerForm, photoUrl: e.target.value})}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setIsAddingPlayer(false)}
                      className="flex-1 py-2 rounded-lg bg-slate-700 text-white text-sm font-bold hover:bg-slate-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSavePlayer}
                      className="flex-1 py-2 rounded-lg bg-emerald-500 text-[#0B1120] text-sm font-bold hover:bg-emerald-400 transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : null}

              {(!selectedTeam.players || selectedTeam.players.length === 0) && !isAddingPlayer && (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Nenhum jogador convocado ainda.
                </div>
              )}

              {selectedTeam.players?.map((player) => (
                <div key={player.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#131B2F] border border-slate-800/50 group/player">
                  <div className="relative shrink-0">
                    <img src={player.photoUrl} alt={player.name} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-emerald-400">{player.position}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-200 truncate">{player.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{player.club}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-slate-700">{player.age}</span>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Anos</p>
                  </div>
                  {isAdmin && (
                    <div className="hidden group-hover/player:flex items-center gap-1 ml-2 shrink-0">
                      <button onClick={() => openEditPlayer(player)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeletePlayer(player.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
