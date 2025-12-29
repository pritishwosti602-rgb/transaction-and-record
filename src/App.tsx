import { useState, useEffect } from 'react';
import { Transaction, Player, PlatformCredit } from './types';
import {
  getTransactions,
  saveTransactions,
  getPlayers,
  savePlayers,
  getPlatformCredits,
  savePlatformCredits,
  updatePlatformCredit,
} from './utils/storage';
import { Dashboard } from './components/Dashboard';
import { AddTransaction } from './components/AddTransaction';
import { PlayerList } from './components/PlayerList';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Home, Plus, Users, FileText, Settings as SettingsIcon } from 'lucide-react';

type Screen = 'dashboard' | 'add-transaction' | 'players' | 'reports' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [platformCredits, setPlatformCredits] = useState<PlatformCredit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [txns, plrs, credits] = await Promise.all([
        getTransactions(),
        getPlayers(),
        getPlatformCredits(),
      ]);
      setTransactions(txns);
      setPlayers(plrs);
      setPlatformCredits(credits);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);

    // Update platform credits
    await updatePlatformCredit(
      transaction.platform,
      transaction.loadedPoints,
      transaction.redeemedPoints,
      transaction.freePlay
    );
    const updatedCredits = await getPlatformCredits();
    setPlatformCredits(updatedCredits);

    // Check if player exists, if not, add them
    const playerExists = players.some(
      (p) => p.gameId === transaction.gameId && p.name === transaction.playerName
    );

    if (!playerExists) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: transaction.playerName,
        gameId: transaction.gameId,
        platform: transaction.platform,
        depositMethod: transaction.depositMethod,
      };
      const updatedPlayers = [...players, newPlayer];
      setPlayers(updatedPlayers);
      await savePlayers(updatedPlayers);
    }

    setCurrentScreen('dashboard');
  };

  const handleAddPlayer = async (player: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...player,
      id: Date.now().toString(),
    };
    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    await savePlayers(updatedPlayers);
  };

  const handleDeletePlayer = async (id: string) => {
    const updatedPlayers = players.filter((p) => p.id !== id);
    setPlayers(updatedPlayers);
    await savePlayers(updatedPlayers);
  };

  const handleResetData = async () => {
    await saveTransactions([]);
    await savePlayers([]);
    const initialCredits = await getPlatformCredits();
    await savePlatformCredits(initialCredits);
    await loadData();
  };

  const handleExportData = () => {
    const data = {
      transactions,
      players,
      platformCredits,
      exportDate: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.transactions) {
        setTransactions(data.transactions);
        saveTransactions(data.transactions);
      }
      if (data.players) {
        setPlayers(data.players);
        savePlayers(data.players);
      }
      if (data.platformCredits) {
        setPlatformCredits(data.platformCredits);
        savePlatformCredits(data.platformCredits);
      }
      alert('Data imported successfully!');
    } catch (error) {
      alert('Error importing data. Please check the file format.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-white text-center">Transaction & Profit Tracker</h1>
          {isLoading && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-400">Syncing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-400">Loading your data...</p>
            </div>
          </div>
        ) : (
          <>
            {currentScreen === 'dashboard' && (
              <Dashboard transactions={transactions} platformCredits={platformCredits} />
            )}
            {currentScreen === 'add-transaction' && (
              <AddTransaction
                players={players}
                onSave={handleAddTransaction}
                onCancel={() => setCurrentScreen('dashboard')}
              />
            )}
            {currentScreen === 'players' && (
              <PlayerList
                players={players}
                onAddPlayer={handleAddPlayer}
                onDeletePlayer={handleDeletePlayer}
              />
            )}
            {currentScreen === 'reports' && (
              <Reports transactions={transactions} platformCredits={platformCredits} />
            )}
            {currentScreen === 'settings' && (
              <Settings
                onResetData={handleResetData}
                onExportData={handleExportData}
                onImportData={handleImportData}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-2xl mx-auto px-4">
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className={`flex flex-col items-center py-3 transition-colors ${
                currentScreen === 'dashboard'
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => setCurrentScreen('add-transaction')}
              className={`flex flex-col items-center py-3 transition-colors ${
                currentScreen === 'add-transaction'
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-xs">Add</span>
            </button>

            <button
              onClick={() => setCurrentScreen('players')}
              className={`flex flex-col items-center py-3 transition-colors ${
                currentScreen === 'players'
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              <Users className="w-6 h-6 mb-1" />
              <span className="text-xs">Players</span>
            </button>

            <button
              onClick={() => setCurrentScreen('reports')}
              className={`flex flex-col items-center py-3 transition-colors ${
                currentScreen === 'reports'
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              <FileText className="w-6 h-6 mb-1" />
              <span className="text-xs">Reports</span>
            </button>

            <button
              onClick={() => setCurrentScreen('settings')}
              className={`flex flex-col items-center py-3 transition-colors ${
                currentScreen === 'settings'
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              <SettingsIcon className="w-6 h-6 mb-1" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom padding to prevent content being hidden by navigation */}
      <div className="h-20"></div>
    </div>
  );
}