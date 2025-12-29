import { Transaction, PlatformCredit } from '../types';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  platformCredits: PlatformCredit[];
}

export function Dashboard({ transactions, platformCredits }: DashboardProps) {
  // Get today's transactions
  const today = new Date();
  const todayTransactions = transactions.filter(t => {
    const transDate = new Date(t.date);
    return (
      transDate.getDate() === today.getDate() &&
      transDate.getMonth() === today.getMonth() &&
      transDate.getFullYear() === today.getFullYear()
    );
  });

  // Calculate today's totals
  const todayCashIn = todayTransactions.reduce((sum, t) => sum + t.cashIn, 0);
  const todayCashOut = todayTransactions.reduce((sum, t) => sum + t.cashOut, 0);
  const todayProfit = todayCashIn - todayCashOut;

  // Recent transactions (last 10)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6 pb-6">
      {/* Today's Summary */}
      <div>
        <h2 className="mb-4 text-gray-400">Today's Summary</h2>
        <div className="grid grid-cols-1 gap-4">
          {/* Cash In */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400 mb-1">Cash In</p>
                <p className="text-3xl text-green-300">${todayCashIn.toFixed(2)}</p>
              </div>
              <div className="bg-green-600/30 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          {/* Cash Out */}
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400 mb-1">Cash Out</p>
                <p className="text-3xl text-red-300">${todayCashOut.toFixed(2)}</p>
              </div>
              <div className="bg-red-600/30 p-3 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          {/* Holding Profit */}
          <div className={`bg-gradient-to-br ${todayProfit >= 0 ? 'from-blue-900/30 to-blue-800/20 border-blue-700/50' : 'from-orange-900/30 to-orange-800/20 border-orange-700/50'} border rounded-xl p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${todayProfit >= 0 ? 'text-blue-400' : 'text-orange-400'} mb-1`}>Holding Profit</p>
                <p className={`text-3xl ${todayProfit >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>
                  ${todayProfit.toFixed(2)}
                </p>
              </div>
              <div className={`${todayProfit >= 0 ? 'bg-blue-600/30' : 'bg-orange-600/30'} p-3 rounded-full`}>
                <DollarSign className={`w-6 h-6 ${todayProfit >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Credits */}
      <div>
        <h2 className="mb-4 text-gray-400">Platform Credits</h2>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
          {platformCredits.map((pc) => (
            <div key={pc.platform} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600/30 p-2 rounded-lg">
                  <Wallet className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-300">{pc.platform}</span>
              </div>
              <span className={`${pc.credits >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pc.credits.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="mb-4 text-gray-400">Recent Transactions</h2>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center text-gray-500">
              No transactions yet
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white">{transaction.playerName}</p>
                    <p className="text-sm text-gray-400">{transaction.gameId} • {transaction.platform}</p>
                  </div>
                  <span className={`text-sm ${transaction.holdingProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${transaction.holdingProfit.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">In: </span>
                    <span className="text-green-400">${transaction.cashIn.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Out: </span>
                    <span className="text-red-400">${transaction.cashOut.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(transaction.date).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
