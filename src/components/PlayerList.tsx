import { useState } from 'react';
import { Player, Platform, DepositMethod } from '../types';
import { UserPlus, Users, Edit2, Trash2, Save, X } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  onDeletePlayer: (id: string) => void;
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

export function PlayerList({ players, onAddPlayer, onDeletePlayer }: PlayerListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');
  const [platform, setPlatform] = useState<Platform>('GameVault');
  const [depositMethod, setDepositMethod] = useState<DepositMethod>('Chime');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlayer({
      name,
      gameId,
      platform,
      depositMethod,
    });
    // Reset form
    setName('');
    setGameId('');
    setPlatform('GameVault');
    setDepositMethod('Chime');
    setShowAddForm(false);
  };

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          <h2 className="text-white">Players</h2>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Player
          </button>
        )}
      </div>

      {/* Add Player Form */}
      {showAddForm && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">New Player</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Player Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter player name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Game ID *</label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter game ID"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Platform *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Deposit Method *</label>
              <select
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value as DepositMethod)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                {DEPOSIT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Player
            </button>
          </form>
        </div>
      )}

      {/* Players List */}
      <div className="space-y-3">
        {players.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No players yet</p>
            <p className="text-sm text-gray-600 mt-1">Add your first player to get started</p>
          </div>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white mb-1">{player.name}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">ID:</span> {player.gameId}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Platform:</span> {player.platform}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Method:</span> {player.depositMethod}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDeletePlayer(player.id)}
                  className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
