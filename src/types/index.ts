export type Platform = 
  | 'GameVault'
  | 'Juwa'
  | 'Orion Star'
  | 'Fire Kirin'
  | 'Vegas Sweeps'
  | 'Ultra Panda'
  | 'Vblink'
  | 'Milkyway';

export type DepositMethod = 'Chime' | 'CashApp' | 'Crypto';

export interface Player {
  id: string;
  name: string;
  gameId: string;
  platform: Platform;
  depositMethod: DepositMethod;
}

export interface Transaction {
  id: string;
  date: string;
  playerName: string;
  gameId: string;
  platform: Platform;
  depositMethod: DepositMethod;
  cashIn: number;
  cashOut: number;
  loadedPoints: number;
  redeemedPoints: number;
  freePlay: number;
  notes: string;
  holdingProfit: number; // Auto-calculated: cashIn - cashOut
}

export interface PlatformCredit {
  platform: Platform;
  credits: number;
}
