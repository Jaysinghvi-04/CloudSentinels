
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Plus, Sun, Moon, RefreshCw } from 'lucide-react';
import { CloudProvider } from '../types';

interface TopBarProps {
  onNewScan: () => void;
  isScanning: boolean;
  activeScanPlatform?: CloudProvider | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onNewScan, isScanning, activeScanPlatform, theme, onToggleTheme }) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 transition-all duration-500">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl group focus-within:ring-2 focus-within:ring-brand-navy/20 transition-all">
          <Search size={16} className="text-slate-500 group-focus-within:text-brand-navy transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources, findings..." 
            className="bg-transparent border-none outline-none text-sm w-48 lg:w-64 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100 font-medium"
          />
        </div>
        
        {/* Health Indicators */}
        <div className="hidden md:flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-6">
          <HealthBadge provider="AWS" status="healthy" />
          <HealthBadge provider="Azure" status="warning" />
          <HealthBadge provider="GCP" status="error" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <motion.button 
          onClick={onToggleTheme}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-sm overflow-hidden"
        >
          <motion.div 
            key={theme} 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="theme-icon-animate"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.div>
        </motion.button>

        <motion.button 
          onClick={onNewScan}
          disabled={isScanning}
          whileHover={!isScanning ? { scale: 1.05 } : {}}
          whileTap={!isScanning ? { scale: 0.95 } : {}}
          className={`
            flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
            ${isScanning 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700' 
              : 'bg-brand-navy text-white hover:bg-brand-midnight shadow-xl shadow-brand-navy/20'
            }
          `}
        >
          {isScanning ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Scanning {activeScanPlatform || ''}
            </>
          ) : (
            <>
              <Plus size={16} />
              New Scan
            </>
          )}
        </motion.button>

        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
          </motion.button>
          
          <button className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:border-slate-800 pl-3">
            <div className="flex flex-col items-end mr-1">
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase italic tracking-tighter">SecAdmin_01</span>
              <span className="text-[9px] text-brand-navy dark:text-blue-400 uppercase tracking-widest font-black">Superuser</span>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-navy to-brand-midnight flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl"
            >
              <User size={18} className="text-white" />
            </motion.div>
          </button>
        </div>
      </div>
    </header>
  );
};

const HealthBadge: React.FC<{ provider: string, status: string }> = ({ provider, status }) => {
  const statusColors: any = {
    healthy: 'bg-emerald-500 shadow-emerald-500/20',
    warning: 'bg-amber-500 shadow-amber-500/20',
    error: 'bg-red-500 shadow-red-500/20'
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-default">
      <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]} shadow-[0_0_8px_currentColor]`}></div>
      <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">{provider}</span>
    </div>
  );
};

export default TopBar;
