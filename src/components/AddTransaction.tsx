import { useState } from 'react';
import { Transaction, Player, Platform, DepositMethod } from '../types';
import { Save, X } from 'lucide-react';

interface AddTransactionProps {
  players: Player[];
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const PLATFORMS: Platform[] = [
  'GameVault',
  'Juwa',
  'Orion Star',
  'Fire Kirin',
  'Vegas Sweeps',
  'Ultra Panda',
  'Vblink',
  'Milkyway',
];

const DEPOSIT_METHODS: DepositMethod[] = ['Chime', 'CashApp', 'Crypto'];

export function AddTransaction({ players, onSave, onCancel }: AddTransactionProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [platform, setPlatform] = useState<Platform>('GameVault');
  const [depositMethod, setDepositMethod] = useState<DepositMethod>('Chime');
  const [cashIn, setCashIn] = useState('0');
  const [cashOut, setCashOut] = useState('0');
  const [loadedPoints, setLoadedPoints] = useState('0');
  const [redeemedPoints, setRedeemedPoints] = useState('0');
  const [freePlay, setFreePlay] = useState('0');
  const [notes, setNotes] = useState('');

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
    const player = players.find(p => p.id === playerId);
    if (player) {
      setPlayerName(player.name);
      setGameId(player.gameId);
      setPlatform(player.platform);
      setDepositMethod(player.depositMethod);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cashInNum = parseFloat(cashIn) || 0;
    const cashOutNum = parseFloat(cashOut) || 0;
    const holdingProfit = cashInNum - cashOutNum;

    const transaction: Omit<Transaction, 'id'> = {
      date: new Date().toISOString(),
      playerName,
      gameId,
      platform,
      depositMethod,
      cashIn: cashInNum,
      cashOut: cashOutNum,
      loadedPoints: parseInt(loadedPoints) || 0,
      redeemedPoints: parseInt(redeemedPoints) || 0,
      freePlay: parseInt(freePlay) || 0,
      notes,
      holdingProfit,
    };

    onSave(transaction);
  };

  const holdingProfit = (parseFloat(cashIn) || 0) - (parseFloat(cashOut) || 0);

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white">Add Transaction</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Existing Player */}
        {players.length > 0 && (
          <div>
            <label className="block text-sm text-gray-400 mb-2">Select Player (Optional)</label>
            <select
              value={selectedPlayer}
              onChange={(e) => handlePlayerSelect(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">-- New Player --</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.gameId})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Player Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Player Name *</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="Enter player name"
          />
        </div>

        {/* Game ID */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Game ID *</label>
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="Enter game ID"
          />
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Platform *</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Deposit Method */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Deposit Method *</label>
          <select
            value={depositMethod}
            onChange={(e) => setDepositMethod(e.target.value as DepositMethod)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            {DEPOSIT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Cash Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-4">
          <p className="text-sm text-gray-400">Cash Transactions</p>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Cash In ($)</label>
            <input
              type="number"
              step="0.01"
              value={cashIn}
              onChange={(e) => setCashIn(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-green-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Cash Out ($)</label>
            <input
              type="number"
              step="0.01"
              value={cashOut}
              onChange={(e) => setCashOut(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-red-500"
              placeholder="0.00"
            />
          </div>

          {/* Holding Profit Display */}
          <div className={`p-3 rounded-lg ${holdingProfit >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
            <p className="text-sm text-gray-400">Holding Profit</p>
            <p className={`text-2xl ${holdingProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${holdingProfit.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Points Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-4">
          <p className="text-sm text-gray-400">Platform Credits</p>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Loaded Points</label>
            <input
              type="number"
              value={loadedPoints}
              onChange={(e) => setLoadedPoints(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-purple-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Redeemed Points</label>
            <input
              type="number"
              value={redeemedPoints}
              onChange={(e) => setRedeemedPoints(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-purple-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Free Play</label>
            <input
              type="number"
              value={freePlay}
              onChange={(e) => setFreePlay(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-purple-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
            rows={3}
            placeholder="Add any notes..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Transaction
        </button>
      </form>
    </div>
  );
}
