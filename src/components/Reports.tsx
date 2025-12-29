import { useState } from 'react';
import { Transaction, PlatformCredit } from '../types';
import { filterTransactionsByDate, calculateTotals, exportToCSV, downloadCSV } from '../utils/reports';
import { FileText, Download, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
  platformCredits: PlatformCredit[];
}

type ReportType = 'daily' | 'monthly' | 'yearly';

export function Reports({ transactions, platformCredits }: ReportsProps) {
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredTransactions = filterTransactionsByDate(transactions, reportType, selectedDate);
  const totals = calculateTotals(filteredTransactions);

  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    switch (reportType) {
      case 'daily':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    switch (reportType) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(filteredTransactions);
    const dateStr = selectedDate.toISOString().split('T')[0];
    downloadCSV(csv, `report-${reportType}-${dateStr}.csv`);
  };

  const getDateDisplay = () => {
    switch (reportType) {
      case 'daily':
        return selectedDate.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      case 'monthly':
        return selectedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        });
      case 'yearly':
        return selectedDate.getFullYear().toString();
    }
  };

  return (
    <div className="pb-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-purple-400" />
        <h2 className="text-white">Reports</h2>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={() => setReportType('daily')}
          className={`py-3 rounded-lg transition-colors ${
            reportType === 'daily'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setReportType('monthly')}
          className={`py-3 rounded-lg transition-colors ${
            reportType === 'monthly'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setReportType('yearly')}
          className={`py-3 rounded-lg transition-colors ${
            reportType === 'yearly'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Date Navigator */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-white">{getDateDisplay()}</span>
          </div>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="space-y-3 mb-6">
        <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-700/50 rounded-xl p-4">
          <p className="text-sm text-green-400 mb-1">Total Cash In</p>
          <p className="text-3xl text-green-300">${totals.cashIn.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/50 rounded-xl p-4">
          <p className="text-sm text-red-400 mb-1">Total Cash Out</p>
          <p className="text-3xl text-red-300">${totals.cashOut.toFixed(2)}</p>
        </div>

        <div className={`bg-gradient-to-r ${totals.holdingProfit >= 0 ? 'from-blue-900/30 to-blue-800/20 border-blue-700/50' : 'from-orange-900/30 to-orange-800/20 border-orange-700/50'} border rounded-xl p-4`}>
          <p className={`text-sm ${totals.holdingProfit >= 0 ? 'text-blue-400' : 'text-orange-400'} mb-1`}>
            Total Holding Profit
          </p>
          <p className={`text-3xl ${totals.holdingProfit >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>
            ${totals.holdingProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Points Summary */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-400 mb-3">Points Summary</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Loaded</p>
            <p className="text-lg text-purple-400">{totals.loadedPoints}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Redeemed</p>
            <p className="text-lg text-green-400">{totals.redeemedPoints}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Free Play</p>
            <p className="text-lg text-yellow-400">{totals.freePlay}</p>
          </div>
        </div>
      </div>

      {/* Platform Credits */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-400 mb-3">Current Platform Credits</p>
        <div className="space-y-2">
          {platformCredits.map((pc) => (
            <div key={pc.platform} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
              <span className="text-gray-300 text-sm">{pc.platform}</span>
              <span className={`${pc.credits >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pc.credits.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExportCSV}
        disabled={filteredTransactions.length === 0}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Download className="w-5 h-5" />
        Export to CSV ({filteredTransactions.length} transactions)
      </button>

      {/* Transaction List */}
      <div className="mt-6">
        <h3 className="text-gray-400 mb-3">Transactions</h3>
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center text-gray-500">
              No transactions for this period
            </div>
          ) : (
            filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white">{transaction.playerName}</p>
                      <p className="text-sm text-gray-400">
                        {transaction.gameId} • {transaction.platform}
                      </p>
                    </div>
                    <span
                      className={`${
                        transaction.holdingProfit >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      ${transaction.holdingProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">In: </span>
                      <span className="text-green-400">${transaction.cashIn.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Out: </span>
                      <span className="text-red-400">${transaction.cashOut.toFixed(2)}</span>
                    </div>
                  </div>
                  {transaction.notes && (
                    <p className="text-xs text-gray-500 border-t border-gray-700 pt-2 mt-2">
                      {transaction.notes}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
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
