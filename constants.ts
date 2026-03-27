import { Group, Match, PlayoffPath, Team } from './types';

const getFlag = (code: string) => `https://flagcdn.com/w160/${code}.png`;

export const TEAMS: Record<string, Team> = {
  // Pote 1 / Anfitriões
  USA: { id: 'usa', name: 'Estados Unidos', code: 'us', flagUrl: getFlag('us') },
  CAN: { id: 'can', name: 'Canadá', code: 'ca', flagUrl: getFlag('ca') },
  MEX: { id: 'mex', name: 'México', code: 'mx', flagUrl: getFlag('mx') },
  ARG: { id: 'arg', name: 'Argentina', code: 'ar', flagUrl: getFlag('ar') },
  FRA: { id: 'fra', name: 'França', code: 'fr', flagUrl: getFlag('fr') },
  BRA: { id: 'bra', name: 'Brasil', code: 'br', flagUrl: getFlag('br') },
  ENG: { id: 'eng', name: 'Inglaterra', code: 'gb-eng', flagUrl: getFlag('gb-eng') },
  ESP: { id: 'esp', name: 'Espanha', code: 'es', flagUrl: getFlag('es') },
  POR: { id: 'por', name: 'Portugal', code: 'pt', flagUrl: getFlag('pt') },
  GER: { id: 'ger', name: 'Alemanha', code: 'de', flagUrl: getFlag('de') },
  NED: { id: 'ned', name: 'Países Baixos', code: 'nl', flagUrl: getFlag('nl') },
  BEL: { id: 'bel', name: 'Bélgica', code: 'be', flagUrl: getFlag('be') },

  // Outras equipas (Amostra para os grupos)
  RSA: { id: 'rsa', name: 'África do Sul', code: 'za', flagUrl: getFlag('za') },
  KOR: { id: 'kor', name: 'Coreia do Sul', code: 'kr', flagUrl: getFlag('kr') },
  QAT: { id: 'qat', name: 'Qatar', code: 'qa', flagUrl: getFlag('qa') },
  SUI: { id: 'sui', name: 'Suíça', code: 'ch', flagUrl: getFlag('ch') },
  MAR: { id: 'mar', name: 'Marrocos', code: 'ma', flagUrl: getFlag('ma') },
  HAI: { id: 'hai', name: 'Haiti', code: 'ht', flagUrl: getFlag('ht') },
  SCO: { id: 'sco', name: 'Escócia', code: 'gb-sct', flagUrl: getFlag('gb-sct') },
  PAR: { id: 'par', name: 'Paraguai', code: 'py', flagUrl: getFlag('py') },
  AUS: { id: 'aus', name: 'Austrália', code: 'au', flagUrl: getFlag('au') },
  CUW: { id: 'cuw', name: 'Curaçao', code: 'cw', flagUrl: getFlag('cw') },
  CIV: { id: 'civ', name: 'Costa do Marfim', code: 'ci', flagUrl: getFlag('ci') },
  ECU: { id: 'ecu', name: 'Equador', code: 'ec', flagUrl: getFlag('ec') },
  JPN: { id: 'jpn', name: 'Japão', code: 'jp', flagUrl: getFlag('jp') },
  TUN: { id: 'tun', name: 'Tunísia', code: 'tn', flagUrl: getFlag('tn') },
  EGY: { id: 'egy', name: 'Egipto', code: 'eg', flagUrl: getFlag('eg') },
  IRN: { id: 'irn', name: 'Irão', code: 'ir', flagUrl: getFlag('ir') },
  NZL: { id: 'nzl', name: 'Nova Zelândia', code: 'nz', flagUrl: getFlag('nz') },
  CPV: { id: 'cpv', name: 'Cabo Verde', code: 'cv', flagUrl: getFlag('cv') },
  KSA: { id: 'ksa', name: 'Arábia Saudita', code: 'sa', flagUrl: getFlag('sa') },
  URU: { id: 'uru', name: 'Uruguai', code: 'uy', flagUrl: getFlag('uy') },
  SEN: { id: 'sen', name: 'Senegal', code: 'sn', flagUrl: getFlag('sn') },
  NOR: { id: 'nor', name: 'Noruega', code: 'no', flagUrl: getFlag('no') },
  ALG: { id: 'alg', name: 'Argélia', code: 'dz', flagUrl: getFlag('dz') },
  AUT: { id: 'aut', name: 'Áustria', code: 'at', flagUrl: getFlag('at') },
  JOR: { id: 'jor', name: 'Jordânia', code: 'jo', flagUrl: getFlag('jo') },
  UZB: { id: 'uzb', name: 'Uzbequistão', code: 'uz', flagUrl: getFlag('uz') },
  COL: { id: 'col', name: 'Colômbia', code: 'co', flagUrl: getFlag('co') },
  CRO: { id: 'cro', name: 'Croácia', code: 'hr', flagUrl: getFlag('hr') },
  GHA: { id: 'gha', name: 'Gana', code: 'gh', flagUrl: getFlag('gh') },
  PAN: { id: 'pan', name: 'Panamá', code: 'pa', flagUrl: getFlag('pa') },

  // Equipas dos Playoffs
  WAL: { id: 'wal', name: 'País de Gales', code: 'gb-wls', flagUrl: getFlag('gb-wls') },
  BIH: { id: 'bih', name: 'Bósnia Herz.', code: 'ba', flagUrl: getFlag('ba') },
  ITA: { id: 'ita', name: 'Itália', code: 'it', flagUrl: getFlag('it') },
  NIR: { id: 'nir', name: 'Irlanda do Norte', code: 'gb-nir', flagUrl: getFlag('gb-nir') },
  UKR: { id: 'ukr', name: 'Ucrânia', code: 'ua', flagUrl: getFlag('ua') },
  SWE: { id: 'swe', name: 'Suécia', code: 'se', flagUrl: getFlag('se') },
  POL: { id: 'pol', name: 'Polónia', code: 'pl', flagUrl: getFlag('pl') },
  ALB: { id: 'alb', name: 'Albânia', code: 'al', flagUrl: getFlag('al') },
  SVK: { id: 'svk', name: 'Eslováquia', code: 'sk', flagUrl: getFlag('sk') },
  KOS: { id: 'kos', name: 'Kosovo', code: 'xk', flagUrl: getFlag('xk') },
  TUR: { id: 'tur', name: 'Turquia', code: 'tr', flagUrl: getFlag('tr') },
  ROU: { id: 'rou', name: 'Roménia', code: 'ro', flagUrl: getFlag('ro') },
  CZE: { id: 'cze', name: 'Chéquia', code: 'cz', flagUrl: getFlag('cz') },
  IRL: { id: 'irl', name: 'Irlanda', code: 'ie', flagUrl: getFlag('ie') },
  DEN: { id: 'den', name: 'Dinamarca', code: 'dk', flagUrl: getFlag('dk') },
  MKD: { id: 'mkd', name: 'Macedónia do Norte', code: 'mk', flagUrl: getFlag('mk') },
  NCL: { id: 'ncl', name: 'Nova Caledónia', code: 'nc', flagUrl: getFlag('nc') },
  JAM: { id: 'jam', name: 'Jamaica', code: 'jm', flagUrl: getFlag('jm') },
  COD: { id: 'cod', name: 'RD Congo', code: 'cd', flagUrl: getFlag('cd') },
  BOL: { id: 'bol', name: 'Bolívia', code: 'bo', flagUrl: getFlag('bo') },
  SUR: { id: 'sur', name: 'Suriname', code: 'sr', flagUrl: getFlag('sr') },
  IRQ: { id: 'irq', name: 'Iraque', code: 'iq', flagUrl: getFlag('iq') },
  SYR: { id: 'syr', name: 'Síria', code: 'sy', flagUrl: getFlag('sy') },
  HON: { id: 'hon', name: 'Honduras', code: 'hn', flagUrl: getFlag('hn') },

  // Placeholders para os vencedores dos Playoffs
  PATH1: { id: 'p1', name: 'Venc. Playoff 1', code: 'xx', flagUrl: 'https://placehold.co/160x120/1E293B/94A3B8?text=P1' },
  PATH2: { id: 'p2', name: 'Venc. Playoff 2', code: 'xx', flagUrl: 'https://placehold.co/160x120/1E293B/94A3B8?text=P2' },
  PATH3: { id: 'p3', name: 'Venc. Playoff 3', code: 'xx', flagUrl: 'https://placehold.co/160x120/1E293B/94A3B8?text=P3' },
  PATH4: { id: 'p4', name: 'Venc. Playoff 4', code: 'xx', flagUrl: 'https://placehold.co/160x120/1E293B/94A3B8?text=P4' },
  PATH5: { id: 'p5', name: 'Venc. Playoff 5', code: 'xx', flagUrl: 'https://placehold.co/160x120/1E293B/94A3B8?text=P5' },
  PATH6: { id: 'p6', name: 'Venc. Playoff 6', code: 'xx', flagUrl: 'https://placehold.co/160x120/1E293B/94A3B8?text=P6' },
};

export const INITIAL_GROUPS: Group[] = [
  { name: 'Grupo A', teams: [TEAMS.MEX, TEAMS.RSA, TEAMS.KOR, TEAMS.PATH4] },
  { name: 'Grupo B', teams: [TEAMS.CAN, TEAMS.PATH1, TEAMS.QAT, TEAMS.SUI] },
  { name: 'Grupo C', teams: [TEAMS.BRA, TEAMS.MAR, TEAMS.HAI, TEAMS.SCO] },
  { name: 'Grupo D', teams: [TEAMS.USA, TEAMS.PAR, TEAMS.AUS, TEAMS.PATH3] },
  { name: 'Grupo E', teams: [TEAMS.GER, TEAMS.CUW, TEAMS.CIV, TEAMS.ECU] },
  { name: 'Grupo F', teams: [TEAMS.NED, TEAMS.JPN, TEAMS.PATH2, TEAMS.TUN] },
  { name: 'Grupo G', teams: [TEAMS.BEL, TEAMS.EGY, TEAMS.IRN, TEAMS.NZL] },
  { name: 'Grupo H', teams: [TEAMS.ESP, TEAMS.CPV, TEAMS.KSA, TEAMS.URU] },
  { name: 'Grupo I', teams: [TEAMS.FRA, TEAMS.SEN, TEAMS.PATH6, TEAMS.NOR] },
  { name: 'Grupo J', teams: [TEAMS.ARG, TEAMS.ALG, TEAMS.AUT, TEAMS.JOR] },
  { name: 'Grupo K', teams: [TEAMS.POR, TEAMS.PATH5, TEAMS.UZB, TEAMS.COL] },
  { name: 'Grupo L', teams: [TEAMS.ENG, TEAMS.CRO, TEAMS.GHA, TEAMS.PAN] },
];

export const INITIAL_PLAYOFFS: PlayoffPath[] = [
  {
    id: 'path1', name: 'Playoff 1 (UEFA A)', winnerGoesToGroup: 'Grupo B',
    matches: [
      { id: 'p1_sf1', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.WAL, awayTeam: TEAMS.BIH, events: [], isFinished: false },
      { id: 'p1_sf2', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.ITA, awayTeam: TEAMS.NIR, events: [], isFinished: false },
      { id: 'p1_f', stage: 'PLAYOFF_F', date: '31 Mar 2026', homeTeam: null, awayTeam: null, homePlaceholder: 'Venc. SF1', awayPlaceholder: 'Venc. SF2', events: [], isFinished: false },
    ]
  },
  {
    id: 'path2', name: 'Playoff 2 (UEFA B)', winnerGoesToGroup: 'Grupo F',
    matches: [
      { id: 'p2_sf1', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.UKR, awayTeam: TEAMS.SWE, events: [], isFinished: false },
      { id: 'p2_sf2', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.POL, awayTeam: TEAMS.ALB, events: [], isFinished: false },
      { id: 'p2_f', stage: 'PLAYOFF_F', date: '31 Mar 2026', homeTeam: null, awayTeam: null, homePlaceholder: 'Venc. SF1', awayPlaceholder: 'Venc. SF2', events: [], isFinished: false },
    ]
  },
  {
    id: 'path3', name: 'Playoff 3 (UEFA C)', winnerGoesToGroup: 'Grupo D',
    matches: [
      { id: 'p3_sf1', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.SVK, awayTeam: TEAMS.KOS, events: [], isFinished: false },
      { id: 'p3_sf2', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.TUR, awayTeam: TEAMS.ROU, events: [], isFinished: false },
      { id: 'p3_f', stage: 'PLAYOFF_F', date: '31 Mar 2026', homeTeam: null, awayTeam: null, homePlaceholder: 'Venc. SF1', awayPlaceholder: 'Venc. SF2', events: [], isFinished: false },
    ]
  },
  {
    id: 'path4', name: 'Playoff 4 (UEFA D)', winnerGoesToGroup: 'Grupo A',
    matches: [
      { id: 'p4_sf1', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.CZE, awayTeam: TEAMS.IRL, events: [], isFinished: false },
      { id: 'p4_sf2', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.DEN, awayTeam: TEAMS.MKD, events: [], isFinished: false },
      { id: 'p4_f', stage: 'PLAYOFF_F', date: '31 Mar 2026', homeTeam: null, awayTeam: null, homePlaceholder: 'Venc. SF1', awayPlaceholder: 'Venc. SF2', events: [], isFinished: false },
    ]
  },
  {
    id: 'path5', name: 'Playoff 5 (Inter. 1)', winnerGoesToGroup: 'Grupo K',
    matches: [
      { id: 'p5_sf1', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.NCL, awayTeam: TEAMS.JAM, events: [], isFinished: false },
      { id: 'p5_f', stage: 'PLAYOFF_F', date: '31 Mar 2026', homeTeam: TEAMS.COD, awayTeam: null, homePlaceholder: 'RD Congo', awayPlaceholder: 'Venc. SF1', events: [], isFinished: false },
    ]
  },
  {
    id: 'path6', name: 'Playoff 6 (Inter. 2)', winnerGoesToGroup: 'Grupo I',
    matches: [
      { id: 'p6_sf1', stage: 'PLAYOFF_SF', date: '26 Mar 2026', homeTeam: TEAMS.SUR, awayTeam: TEAMS.BOL, events: [], isFinished: false },
      { id: 'p6_f', stage: 'PLAYOFF_F', date: '31 Mar 2026', homeTeam: TEAMS.IRQ, awayTeam: null, homePlaceholder: 'Iraque', awayPlaceholder: 'Venc. SF1', events: [], isFinished: false },
    ]
  }
];

const generateMatches = (): Match[] => {
  const matches: Match[] = [];
  let matchNumber = 1;
  const dates = ['11 Jun 2026', '12 Jun 2026', '13 Jun 2026', '14 Jun 2026', '15 Jun 2026', '16 Jun 2026', '17 Jun 2026', '18 Jun 2026', '19 Jun 2026', '20 Jun 2026', '21 Jun 2026', '22 Jun 2026', '23 Jun 2026', '24 Jun 2026', '25 Jun 2026', '26 Jun 2026', '27 Jun 2026'];
  
  INITIAL_GROUPS.forEach((group, groupIndex) => {
    const [t1, t2, t3, t4] = group.teams;
    
    // Matchday 1
    matches.push({ id: `g${groupIndex}_m1`, matchNumber: matchNumber++, stage: 'Group', date: dates[groupIndex % dates.length], time: '16:00', homeTeam: t1, awayTeam: t2, events: [], isFinished: false });
    matches.push({ id: `g${groupIndex}_m2`, matchNumber: matchNumber++, stage: 'Group', date: dates[groupIndex % dates.length], time: '20:00', homeTeam: t3, awayTeam: t4, events: [], isFinished: false });
    
    // Matchday 2
    matches.push({ id: `g${groupIndex}_m3`, matchNumber: matchNumber++, stage: 'Group', date: dates[(groupIndex + 4) % dates.length], time: '16:00', homeTeam: t1, awayTeam: t3, events: [], isFinished: false });
    matches.push({ id: `g${groupIndex}_m4`, matchNumber: matchNumber++, stage: 'Group', date: dates[(groupIndex + 4) % dates.length], time: '20:00', homeTeam: t4, awayTeam: t2, events: [], isFinished: false });
    
    // Matchday 3
    matches.push({ id: `g${groupIndex}_m5`, matchNumber: matchNumber++, stage: 'Group', date: dates[(groupIndex + 8) % dates.length], time: '16:00', homeTeam: t4, awayTeam: t1, events: [], isFinished: false });
    matches.push({ id: `g${groupIndex}_m6`, matchNumber: matchNumber++, stage: 'Group', date: dates[(groupIndex + 8) % dates.length], time: '16:00', homeTeam: t2, awayTeam: t3, events: [], isFinished: false });
  });

  // 16-avos (32 teams -> 16 matches)
  const r32Matches = [
    { id: 'r32_1', home: '2º Grupo A', away: '2º Grupo B' },
    { id: 'r32_2', home: '1º Grupo E', away: '3º Grupo A/B/C/D/F' },
    { id: 'r32_3', home: '1º Grupo I', away: '3º Grupo C/D/F/G/H' },
    { id: 'r32_4', home: '2º Grupo C', away: '2º Grupo D' },
    { id: 'r32_5', home: '1º Grupo B', away: '3º Grupo E/F/G/I/J' },
    { id: 'r32_6', home: '1º Grupo F', away: '2º Grupo C' },
    { id: 'r32_7', home: '1º Grupo J', away: '2º Grupo H' },
    { id: 'r32_8', home: '2º Grupo E', away: '2º Grupo F' },
    { id: 'r32_9', home: '1º Grupo C', away: '3º Grupo A/B/F/G/H' },
    { id: 'r32_10', home: '1º Grupo G', away: '3º Grupo A/E/H/I/J' },
    { id: 'r32_11', home: '1º Grupo K', away: '3º Grupo D/E/I/J/L' },
    { id: 'r32_12', home: '2º Grupo H', away: '2º Grupo J' },
    { id: 'r32_13', home: '1º Grupo D', away: '3º Grupo B/E/F/I/J' },
    { id: 'r32_14', home: '1º Grupo H', away: '2º Grupo J' },
    { id: 'r32_15', home: '1º Grupo L', away: '3º Grupo E/H/I/J/K' },
    { id: 'r32_16', home: '2º Grupo G', away: '2º Grupo I' },
  ];

  r32Matches.forEach((match, index) => {
    matches.push({ id: match.id, matchNumber: matchNumber++, stage: 'R32', date: '28 Jun 2026', time: '20:00', homeTeam: null, awayTeam: null, homePlaceholder: match.home, awayPlaceholder: match.away, events: [], isFinished: false });
  });

  // Oitavos (16 teams -> 8 matches)
  const r16Matches = [
    { id: 'r16_1', home: 'Venc. Jogo 73', away: 'Venc. Jogo 75' },
    { id: 'r16_2', home: 'Venc. Jogo 74', away: 'Venc. Jogo 76' },
    { id: 'r16_3', home: 'Venc. Jogo 77', away: 'Venc. Jogo 79' },
    { id: 'r16_4', home: 'Venc. Jogo 78', away: 'Venc. Jogo 80' },
    { id: 'r16_5', home: 'Venc. Jogo 81', away: 'Venc. Jogo 83' },
    { id: 'r16_6', home: 'Venc. Jogo 82', away: 'Venc. Jogo 84' },
    { id: 'r16_7', home: 'Venc. Jogo 85', away: 'Venc. Jogo 87' },
    { id: 'r16_8', home: 'Venc. Jogo 86', away: 'Venc. Jogo 88' },
  ];

  r16Matches.forEach((match, index) => {
    matches.push({ id: match.id, matchNumber: matchNumber++, stage: 'R16', date: '04 Jul 2026', time: '20:00', homeTeam: null, awayTeam: null, homePlaceholder: match.home, awayPlaceholder: match.away, events: [], isFinished: false });
  });

  // Quartos (8 teams -> 4 matches)
  const qfMatches = [
    { id: 'qf_1', home: 'Venc. Jogo 89', away: 'Venc. Jogo 90' },
    { id: 'qf_2', home: 'Venc. Jogo 91', away: 'Venc. Jogo 92' },
    { id: 'qf_3', home: 'Venc. Jogo 93', away: 'Venc. Jogo 94' },
    { id: 'qf_4', home: 'Venc. Jogo 95', away: 'Venc. Jogo 96' },
  ];

  qfMatches.forEach((match, index) => {
    matches.push({ id: match.id, matchNumber: matchNumber++, stage: 'QF', date: '09 Jul 2026', time: '20:00', homeTeam: null, awayTeam: null, homePlaceholder: match.home, awayPlaceholder: match.away, events: [], isFinished: false });
  });

  // Meias (4 teams -> 2 matches)
  const sfMatches = [
    { id: 'sf_1', home: 'Venc. Jogo 97', away: 'Venc. Jogo 98' },
    { id: 'sf_2', home: 'Venc. Jogo 99', away: 'Venc. Jogo 100' },
  ];

  sfMatches.forEach((match, index) => {
    matches.push({ id: match.id, matchNumber: matchNumber++, stage: 'SF', date: '14 Jul 2026', time: '20:00', homeTeam: null, awayTeam: null, homePlaceholder: match.home, awayPlaceholder: match.away, events: [], isFinished: false });
  });

  // 3º e 4º
  matches.push({ id: `3rd_1`, matchNumber: matchNumber++, stage: '3RD', date: '18 Jul 2026', time: '20:00', homeTeam: null, awayTeam: null, homePlaceholder: `Vencido Jogo 101`, awayPlaceholder: `Vencido Jogo 102`, events: [], isFinished: false });

  // Final
  matches.push({ id: `final_1`, matchNumber: matchNumber++, stage: 'FINAL', date: '19 Jul 2026', time: '20:00', homeTeam: null, awayTeam: null, homePlaceholder: `Venc. Jogo 101`, awayPlaceholder: `Venc. Jogo 102`, events: [], isFinished: false });
  
  return matches;
};

export const INITIAL_MATCHES: Match[] = generateMatches();
