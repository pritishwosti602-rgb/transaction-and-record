import { useState } from 'react';
import { Settings as SettingsIcon, Database, Trash2, AlertTriangle, Download, Upload } from 'lucide-react';

interface SettingsProps {
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (data: string) => void;
}

export function Settings({ onResetData, onExportData, onImportData }: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        onImportData(data);
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    onResetData();
    setShowResetConfirm(false);
  };

  return (
    <div className="pb-6">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-6 h-6 text-purple-400" />
        <h2 className="text-white">Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Data Management */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-purple-400" />
            <h3 className="text-white">Data Management</h3>
          </div>

          <div className="space-y-3">
            {/* Export Data */}
            <button
              onClick={onExportData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export All Data
            </button>

            {/* Import Data */}
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <div className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Import Data
              </div>
            </label>

            <p className="text-xs text-gray-500 text-center">
              Export your data as backup or import previously saved data
            </p>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white mb-3">App Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Version</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Storage</span>
              <span className="text-green-400">☁️ Cloud Sync</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Mode</span>
              <span className="text-green-400">Online</span>
            </div>
          </div>
          <div className="mt-3 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
            <p className="text-xs text-green-400">
              ✓ Your data syncs across all devices automatically
            </p>
          </div>
        </div>

        {/* Business Logic Info */}
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
          <h3 className="text-blue-400 mb-3">💡 Business Logic</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <strong>Holding Profit</strong> = Cash In - Cash Out</p>
            <p>• <strong>Platform Credit</strong> = Previous Credit - Loaded Points + Redeemed Points - Free Play</p>
            <p className="text-xs text-blue-400 mt-2">
              Cash In/Out affects profit only, NOT platform credits
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-red-400">Danger Zone</h3>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-400">
                This will permanently delete all transactions, players, and reset platform credits. This action cannot be undone!
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}