import React, { useState, useEffect } from 'react';
import { Home, Trophy, CalendarDays, User, ChevronRight, Bell, Settings2, ShieldAlert, LogOut } from 'lucide-react';
import GroupView from './components/GroupView';
import PlayoffsView from './components/PlayoffsView';
import MatchesView from './components/MatchesView';
import StandingsView from './components/StandingsView';
import BracketView from './components/BracketView';
import StatsView from './components/StatsView';
import { Match, Group, PlayoffPath } from './types';

// API Base URL - In production this would be the actual domain
const API_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [activeTab, setActiveTab] = useState('playoffs');
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [playoffs, setPlayoffs] = useState<PlayoffPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setIsAdmin(true);
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tournament/public`);
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups);
        setMatches(data.matches);
        setPlayoffs(data.playoffs);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (newGroups: Group[], newMatches: Match[], newPlayoffs: PlayoffPath[]) => {
    if (!isAdmin || !token) return;
    
    try {
      await fetch(`${API_URL}/api/tournament/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          groups: newGroups,
          matches: newMatches,
          playoffs: newPlayoffs
        })
      });
    } catch (error) {
      console.error('Erro ao guardar dados:', error);
    }
  };

  const handleSetGroups = (newGroups: Group[] | ((prev: Group[]) => Group[])) => {
    setGroups(prev => {
      const updated = typeof newGroups === 'function' ? newGroups(prev) : newGroups;
      saveData(updated, matches, playoffs);
      return updated;
    });
  };

  const handleSetMatches = (newMatches: Match[] | ((prev: Match[]) => Match[])) => {
    setMatches(prev => {
      const updated = typeof newMatches === 'function' ? newMatches(prev) : newMatches;
      saveData(groups, updated, playoffs);
      return updated;
    });
  };

  const handleSetPlayoffs = (newPlayoffs: PlayoffPath[] | ((prev: PlayoffPath[]) => PlayoffPath[])) => {
    setPlayoffs(prev => {
      const updated = typeof newPlayoffs === 'function' ? newPlayoffs(prev) : newPlayoffs;
      saveData(groups, matches, updated);
      return updated;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsAdmin(true);
        setShowLogin(false);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError(data.error || 'Erro ao iniciar sessão');
      }
    } catch (error) {
      setLoginError('Erro de ligação ao servidor');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  const TABS = [
    { id: 'playoffs', label: 'Playoffs' },
    { id: 'grupos', label: 'Grupos' },
    { id: 'jogos', label: 'Jogos' },
    { id: 'classificacoes', label: 'Classificações' },
    { id: 'finais', label: 'Finais' },
    { id: 'estatisticas', label: 'Estatísticas' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* App Bar / Header */}
      <header className="sticky top-0 z-50 bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://imgur.com/bWWzjGM.png" alt="Mundial 2026" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" referrerPolicy="no-referrer" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              Mundial <span className="text-emerald-400">2026</span>
            </h1>
          </div>
          {isAdmin ? (
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full transition-colors relative flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
            >
              <ShieldAlert className="w-4 h-4" />
              Admin
              <LogOut className="w-3 h-3 ml-1" />
            </button>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className="p-2 rounded-full transition-colors relative flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-800/50 text-slate-400 border border-transparent hover:bg-slate-800"
            >
              <Settings2 className="w-4 h-4" />
              Entrar
            </button>
          )}
        </div>

        {/* Top Scrollable Tabs */}
        <div className="w-full overflow-x-auto hide-scrollbar border-t border-slate-800/50">
          <div className="flex px-4 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-bold tracking-wide whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-emerald-400 text-emerald-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'playoffs' && <PlayoffsView isAdmin={isAdmin} playoffs={playoffs} setPlayoffs={handleSetPlayoffs} groups={groups} setGroups={handleSetGroups} />}
            {activeTab === 'grupos' && <GroupView isAdmin={isAdmin} groups={groups} setGroups={handleSetGroups} />}
            {activeTab === 'jogos' && <MatchesView isAdmin={isAdmin} matches={matches} setMatches={handleSetMatches} groups={groups} />}
            {activeTab === 'classificacoes' && <StandingsView matches={matches} groups={groups} />}
            {activeTab === 'finais' && <BracketView matches={matches} />}
            {activeTab === 'estatisticas' && <StatsView matches={matches} />}
          </>
        )}
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#131B2F] w-full max-w-sm rounded-3xl border border-slate-800 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Acesso Reservado</h3>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {loginError && (
                <p className="text-red-400 text-xs font-bold text-center">{loginError}</p>
              )}

              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0B1120] rounded-xl font-bold transition-colors"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- VIEWS ---

function HomeView() {
  return (
    <div className="p-5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Card - Próximo Jogo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-[#131B2F] border border-slate-700/50 p-6 shadow-2xl">
        {/* Efeitos de luz de fundo */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest uppercase border border-emerald-500/20">
              Jogo de Abertura
            </span>
            <span className="text-xs font-medium text-slate-400">Grupo A</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            {/* Equipa Casa */}
            <div className="flex flex-col items-center gap-3 w-1/3">
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                <img src="https://flagcdn.com/w160/mx.png" alt="México" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-sm text-white">MEX</span>
            </div>
            
            {/* Info Central */}
            <div className="flex flex-col items-center px-2 w-1/3">
              <span className="text-2xl font-black tracking-widest text-white/90">VS</span>
              <div className="flex flex-col items-center mt-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">11 Junho</span>
                <span className="text-xs text-white font-mono mt-0.5">20:00</span>
              </div>
            </div>

            {/* Equipa Fora */}
            <div className="flex flex-col items-center gap-3 w-1/3">
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                <img src="https://flagcdn.com/w160/za.png" alt="África do Sul" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-sm text-white">RSA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats / Info */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 px-1 tracking-tight">Acesso Rápido</h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickCard title="Classificações" subtitle="Tabelas dos Grupos" icon={<CalendarDays className="w-5 h-5 text-blue-400" />} />
          <QuickCard title="Estatísticas" subtitle="Melhores Marcadores" icon={<Trophy className="w-5 h-5 text-amber-400" />} />
        </div>
      </div>
      
      {/* Recent News Placeholder */}
      <div>
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-lg font-bold text-white tracking-tight">Últimas Notícias</h2>
          <button className="text-xs text-emerald-400 font-bold hover:text-emerald-300 flex items-center uppercase tracking-wider">
            Ver todas <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
        <div className="space-y-3">
          <NewsCard 
            title="Estádio Azteca prepara-se para o jogo de abertura" 
            time="Há 2 horas" 
            image="https://images.unsplash.com/photo-1518605368461-1ee7c68cd694?auto=format&fit=crop&q=80&w=200&h=200"
          />
          <NewsCard 
            title="As 48 seleções confirmam os seus plantéis finais" 
            time="Há 5 horas" 
            image="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=200&h=200"
          />
        </div>
      </div>
    </div>
  );
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-500 px-6 text-center">
      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
        <Trophy className="w-8 h-8 text-slate-500" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 text-sm leading-relaxed">
        Esta secção está a ser construída. Em breve poderá gerir e visualizar os dados aqui.
      </p>
    </div>
  );
}

// --- COMPONENTS ---

function QuickCard({ title, subtitle, icon }: { title: string, subtitle: string, icon: React.ReactNode }) {
  return (
    <button className="flex flex-col items-start p-4 rounded-2xl bg-[#131B2F] border border-slate-800/60 hover:bg-[#1A243D] hover:border-slate-700 transition-all text-left group shadow-lg shadow-black/20">
      <div className="p-2.5 rounded-xl bg-slate-800/80 mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="font-bold text-slate-200 text-sm">{title}</span>
      <span className="text-[11px] text-slate-500 mt-1 font-medium">{subtitle}</span>
    </button>
  );
}

function NewsCard({ title, time, image }: { title: string, time: string, image: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#131B2F] border border-slate-800/60 shadow-md">
      <div className="w-20 h-20 rounded-xl bg-slate-800 flex-shrink-0 overflow-hidden">
        <img src={image} alt="Notícia" className="w-full h-full object-cover opacity-80" />
      </div>
      <div className="flex-1 pr-2">
        <h3 className="text-sm font-bold text-slate-200 leading-snug line-clamp-2">{title}</h3>
        <p className="text-[11px] text-emerald-400 font-medium mt-2 uppercase tracking-wider">{time}</p>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 gap-1.5 transition-all duration-300 ${isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
    >
      <div className={`[&>svg]:w-6 [&>svg]:h-6 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
}
