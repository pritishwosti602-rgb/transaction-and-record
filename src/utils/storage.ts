import { Transaction, Player, PlatformCredit, Platform } from '../types';
import { projectId, publicAnonKey } from './supabase/info';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const SERVER_URL = `${SUPABASE_URL}/functions/v1/make-server-2a72100d`;

const TRANSACTIONS_KEY = 'transactions';
const PLAYERS_KEY = 'players';
const PLATFORM_CREDITS_KEY = 'platformCredits';

// Initialize platform credits with 500 for each platform
const INITIAL_PLATFORM_CREDITS: PlatformCredit[] = [
  { platform: 'GameVault', credits: 500 },
  { platform: 'Juwa', credits: 500 },
  { platform: 'Orion Star', credits: 500 },
  { platform: 'Fire Kirin', credits: 500 },
  { platform: 'Vegas Sweeps', credits: 500 },
  { platform: 'Ultra Panda', credits: 500 },
  { platform: 'Vblink', credits: 500 },
  { platform: 'Milkyway', credits: 500 },
];

// Helper function to make API calls
async function apiCall(endpoint: string, method: string = 'GET', body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${SERVER_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${errorText}`);
  }
  return response.json();
}

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const result = await apiCall('/transactions', 'GET');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    await apiCall('/transactions', 'POST', { transactions });
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const getPlayers = async (): Promise<Player[]> => {
  try {
    const result = await apiCall('/players', 'GET');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
};

export const savePlayers = async (players: Player[]): Promise<void> => {
  try {
    await apiCall('/players', 'POST', { players });
  } catch (error) {
    console.error('Error saving players:', error);
  }
};

export const getPlatformCredits = async (): Promise<PlatformCredit[]> => {
  try {
    const result = await apiCall('/platform-credits', 'GET');
    if (result.data && result.data.length > 0) {
      return result.data;
    }
    // Initialize if not exists
    await savePlatformCredits(INITIAL_PLATFORM_CREDITS);
    return INITIAL_PLATFORM_CREDITS;
  } catch (error) {
    console.error('Error fetching platform credits:', error);
    return INITIAL_PLATFORM_CREDITS;
  }
};

export const savePlatformCredits = async (credits: PlatformCredit[]): Promise<void> => {
  try {
    await apiCall('/platform-credits', 'POST', { credits });
  } catch (error) {
    console.error('Error saving platform credits:', error);
  }
};

export const updatePlatformCredit = async (platform: Platform, loadedPoints: number, redeemedPoints: number, freePlay: number): Promise<void> => {
  const credits = await getPlatformCredits();
  const platformCredit = credits.find(c => c.platform === platform);
  
  if (platformCredit) {
    // Platform Credit = Previous Credit - Loaded Points + Redeemed Points - Free Play
    platformCredit.credits = platformCredit.credits - loadedPoints + redeemedPoints - freePlay;
    await savePlatformCredits(credits);
  }
};