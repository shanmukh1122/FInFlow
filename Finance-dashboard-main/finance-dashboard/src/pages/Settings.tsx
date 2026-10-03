// src/pages/Settings.tsx
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Moon, Sun, Bell, Lock, Palette, Globe, Database, Trash2, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode, showNotification } = useStore();
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');

  const handleSaveSettings = () => {
    showNotification('Settings saved successfully!', 'success');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure? This will delete all your data!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Settings
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Customize your dashboard experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Palette size={20} className="text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                <span>Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary-600' : 'bg-gray-300'} relative`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Bell size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="flex items-center justify-between">
            <span>Push Notifications</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-primary-600' : 'bg-gray-300'} relative`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Globe size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Preferences</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500 block mb-1">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <Database size={20} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold">Data Management</h3>
          </div>
          <div className="space-y-3">
            <button className="btn-secondary w-full flex items-center justify-center gap-2">
              <Save size={16} />
              Export All Data
            </button>
            <button onClick={handleClearData} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              <Trash2 size={16} />
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveSettings} className="btn-primary flex items-center gap-2">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;