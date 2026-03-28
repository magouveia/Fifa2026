import React, { useState, useEffect } from 'react';
import { Home, Trophy, CalendarDays, User, ChevronRight, Bell, Settings2, ShieldAlert, LogOut, Download } from 'lucide-react';
import GroupView from './components/GroupView';
import PlayoffsView from './components/PlayoffsView';
import MatchesView from './components/MatchesView';
import StandingsView from './components/StandingsView';
import BracketView from './components/BracketView';
import StatsView from './components/StatsView';
import { Match, Group, PlayoffPath } from './types';

// API Base URL - In production this would be the actual domain


export default function App() {
  const [activeTab, setActiveTab] = useState('playoffs');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [playoffs, setPlayoffs] = useState<PlayoffPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Show instructions if prompt is not available (e.g. iOS or already installed)
      setShowInstallInstructions(true);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/tournament/public`);
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
      await fetch(`/api/tournament/save`, {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginPassword !== registerConfirmPassword) {
      setLoginError('As passwords não coincidem');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
        setIsAdmin(data.isAdmin);
        setLoginEmail('');
        setLoginPassword('');
        setRegisterConfirmPassword('');
      } else {
        setLoginError(data.error || 'Erro ao criar conta');
      }
    } catch (error) {
      setLoginError('Erro de ligação ao servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
        setIsAdmin(data.isAdmin);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError(data.error || 'Erro ao iniciar sessão');
      }
    } catch (error) {
      setLoginError('Erro de ligação ao servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
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

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 selection:bg-emerald-500/30">
        <div className="bg-[#131B2F] w-full max-w-sm rounded-3xl border border-slate-800 shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-8">
            <img src="https://i.imgur.com/bWWzjGM.png" alt="Mundial 2026" className="w-20 h-20 object-contain drop-shadow-[0_0_12px_rgba(52,211,153,0.5)] mb-4" referrerPolicy="no-referrer" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Mundial <span className="text-emerald-400">2026</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 text-center">
              {isRegistering ? 'Crie a sua conta para aceder' : 'Inicie sessão para aceder à aplicação'}
            </p>
          </div>
          
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            {isRegistering && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Confirmar Password</label>
                <input 
                  type="password" 
                  value={registerConfirmPassword}
                  onChange={e => setRegisterConfirmPassword(e.target.value)}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required={isRegistering}
                  disabled={isLoading}
                />
              </div>
            )}

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-xs font-bold text-center">{loginError}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0B1120] rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0B1120] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isRegistering ? 'Criar Conta' : 'Entrar na Aplicação'
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setLoginError('');
                  setLoginPassword('');
                  setRegisterConfirmPassword('');
                }}
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {isRegistering ? 'Já tem conta? Iniciar sessão' : 'Não tem conta? Registe-se aqui'}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleInstallApp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1120] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors text-sm font-bold uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                Instalar Aplicação
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* App Bar / Header */}
      <header className="sticky top-0 z-50 bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="px-3 sm:px-5 py-3 sm:py-4 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img src="https://i.imgur.com/bWWzjGM.png" alt="Mundial 2026" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] flex-shrink-0" referrerPolicy="no-referrer" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
              Mundial <span className="text-emerald-400">2026</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstallApp}
              className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-xs font-bold uppercase tracking-wider"
              title="Instalar Aplicação"
            >
              <Download className="w-4 h-4 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline ml-1.5">Instalar App</span>
            </button>
            {isAdmin && (
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-xs font-bold uppercase tracking-wider"
                title="Sair de Admin"
              >
                <ShieldAlert className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-1.5">Admin</span>
                <LogOut className="hidden sm:inline w-3 h-3 ml-1" />
              </button>
            )}
          </div>
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

      {/* Install Instructions Modal */}
      {showInstallInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#131B2F] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Instalar Aplicação</h3>
            <p className="text-slate-300 text-sm mb-4">
              Para instalar a aplicação no seu dispositivo:
            </p>
            <ul className="text-sm text-slate-400 space-y-3 mb-6">
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">1.</span>
                <span>No Safari (iOS), toque no ícone de Partilhar (quadrado com seta para cima).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">2.</span>
                <span>No Chrome/Android, toque nos 3 pontos no canto superior direito.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">3.</span>
                <span>Selecione <strong>"Adicionar ao Ecrã Principal"</strong> ou <strong>"Instalar Aplicação"</strong>.</span>
              </li>
            </ul>
            <button
              onClick={() => setShowInstallInstructions(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              Entendido
            </button>
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
