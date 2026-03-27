export type Position = 'GK' | 'DF' | 'MF' | 'FW';

export interface Player {
  id: string;
  name: string;
  age: number;
  club: string;
  position: Position;
  photoUrl: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  flagUrl: string;
  fifaRanking?: number;
  players?: Player[];
}

export interface GroupStanding {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  fairPlayPoints: number;
}

export interface Group {
  name: string;
  teams: Team[];
}

export type EventType = 'goal' | 'yellow' | 'red' | 'yellow-red';

export interface MatchEvent {
  id: string;
  type: EventType;
  player: string;
  minute: number;
  teamId: string; // Para saber se foi a equipa da casa ou fora
  isOwnGoal?: boolean;
}

export interface Match {
  id: string;
  matchNumber?: number;
  stage: string; // 'Group', 'R32', 'R16', 'QF', 'SF', '3RD', 'FINAL', 'PLAYOFF_SF', 'PLAYOFF_F'
  date: string;
  time?: string;
  homeTeam: Team | null;
  awayTeam: Team | null;
  homePlaceholder?: string;
  awayPlaceholder?: string;
  homeScore?: number;
  awayScore?: number;
  events: MatchEvent[];
  isFinished: boolean;
}

export interface PlayoffPath {
  id: string;
  name: string;
  winnerGoesToGroup: string;
  matches: Match[];
}
