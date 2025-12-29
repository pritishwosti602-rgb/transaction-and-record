import { Transaction } from '../types';

export const filterTransactionsByDate = (
  transactions: Transaction[],
  type: 'daily' | 'monthly' | 'yearly',
  date: Date
): Transaction[] => {
  return transactions.filter(t => {
    const transDate = new Date(t.date);
    
    switch (type) {
      case 'daily':
        return (
          transDate.getDate() === date.getDate() &&
          transDate.getMonth() === date.getMonth() &&
          transDate.getFullYear() === date.getFullYear()
        );
      case 'monthly':
        return (
          transDate.getMonth() === date.getMonth() &&
          transDate.getFullYear() === date.getFullYear()
        );
      case 'yearly':
        return transDate.getFullYear() === date.getFullYear();
      default:
        return false;
    }
  });
};

export const calculateTotals = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, t) => ({
      cashIn: acc.cashIn + t.cashIn,
      cashOut: acc.cashOut + t.cashOut,
      holdingProfit: acc.holdingProfit + t.holdingProfit,
      loadedPoints: acc.loadedPoints + t.loadedPoints,
      redeemedPoints: acc.redeemedPoints + t.redeemedPoints,
      freePlay: acc.freePlay + t.freePlay,
    }),
    {
      cashIn: 0,
      cashOut: 0,
      holdingProfit: 0,
      loadedPoints: 0,
      redeemedPoints: 0,
      freePlay: 0,
    }
  );
};

export const exportToCSV = (transactions: Transaction[]): string => {
  const headers = [
    'Date',
    'Player Name',
    'Game ID',
    'Platform',
    'Deposit Method',
    'Cash In',
    'Cash Out',
    'Holding Profit',
    'Loaded Points',
    'Redeemed Points',
    'Free Play',
    'Notes',
  ];

  const rows = transactions.map(t => [
    new Date(t.date).toLocaleString(),
    t.playerName,
    t.gameId,
    t.platform,
    t.depositMethod,
    t.cashIn.toFixed(2),
    t.cashOut.toFixed(2),
    t.holdingProfit.toFixed(2),
    t.loadedPoints,
    t.redeemedPoints,
    t.freePlay,
    t.notes,
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csv;
};

export const downloadCSV = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
