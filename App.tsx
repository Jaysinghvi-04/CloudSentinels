
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  ShieldCheck, 
  Key, 
  AlertTriangle, 
  Share2, 
  FileText, 
  Settings,
  Zap,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ViewType, CloudProvider } from './types';
import SidebarItem from './components/SidebarItem';
import TopBar from './components/TopBar';
import DashboardView from './components/DashboardView';
import CloudVaultView from './components/CloudVaultView';
import FindingsView from './components/FindingsView';
import VisualizerView from './components/VisualizerView';
import ReportBuilderView from './components/ReportBuilderView';
import AuthView from './components/AuthView';
import NewScanModal from './components/NewScanModal';
import CursorFollower from './components/CursorFollower';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cloudsentinels-auth') === 'true';
  });
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isScanning, setIsScanning] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [activeScanPlatform, setActiveScanPlatform] = useState<CloudProvider | null>(null);
  
  // Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  // Parallax Transforms - Defined at top level (Fix for Error #310)
  const bgX = useTransform(smoothX, [0, 2000], [20, -20]);
  const bgY = useTransform(smoothY, [0, 1200], [20, -20]);
  const bgXInverted = useTransform(bgX, v => -v);
  const bgYInverted = useTransform(bgY, v => -v);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('cloudsentinels-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('cloudsentinels-theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [theme, mouseX, mouseY]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('cloudsentinels-auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cloudsentinels-auth');
  };

  const handleStartScan = (platform: CloudProvider) => {
    setActiveScanPlatform(platform);
    setIsScanning(true);
    setShowScanModal(false);
    setTimeout(() => {
      setIsScanning(false);
      setActiveScanPlatform(null);
    }, 5000);
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />;
  }

  const variants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 1.02 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-500 cursor-none"
    >
      <CursorFollower />
      
      <AnimatePresence>
        {showScanModal && (
          <NewScanModal 
            onClose={() => setShowScanModal(false)} 
            onStartScan={handleStartScan}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center lg:items-stretch transition-all duration-300 z-50 bg-white dark:bg-slate-950">
        <div className="p-6 flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 bg-brand-navy rounded-xl flex items-center justify-center shrink-0 shadow-xl shadow-brand-navy/20"
          >
            <ShieldCheck className="text-white" size={24} />
          </motion.div>
          <span className="hidden lg:block text-xl font-black tracking-tighter italic uppercase text-brand-navy dark:text-slate-100">Cloud Sentinels</span>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {['dashboard', 'resources', 'compliance', 'vault', 'findings', 'visualizer', 'reports'].map((view) => (
            <SidebarItem 
              key={view}
              icon={getIconForView(view)} 
              label={view.charAt(0).toUpperCase() + view.slice(1)} 
              active={activeView === view} 
              onClick={() => setActiveView(view as ViewType)} 
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeView === 'settings'} 
            onClick={() => setActiveView('settings')} 
          />
          <SidebarItem 
            icon={<LogOut size={20} />} 
            label="Sign Out" 
            onClick={handleLogout} 
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden transition-colors duration-500">
        <TopBar 
          onNewScan={() => setShowScanModal(true)} 
          isScanning={isScanning} 
          activeScanPlatform={activeScanPlatform}
          theme={theme} 
          onToggleTheme={toggleTheme} 
        />

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {(() => {
                switch (activeView) {
                  case 'dashboard': return <DashboardView />;
                  case 'vault': return <CloudVaultView />;
                  case 'findings': return <FindingsView />;
                  case 'visualizer': return <VisualizerView />;
                  case 'reports': return <ReportBuilderView />;
                  default: return (
                    <div className="flex items-center justify-center h-full flex-col text-slate-400 dark:text-slate-500">
                      <div className="p-8 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl dark:shadow-none flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
                          <Zap size={40} className="text-slate-300 dark:text-slate-700 animate-pulse" />
                        </div>
                        <p className="text-xl font-black uppercase tracking-[0.2em] italic text-slate-900 dark:text-white">Module Offline</p>
                        <p className="text-xs text-slate-500 mt-2 font-black uppercase tracking-widest max-w-[240px] text-center leading-relaxed">
                          The <span className="text-brand-navy dark:text-blue-400">{activeView}</span> cluster is currently being provisioned.
                        </p>
                        <button 
                          onClick={() => setActiveView('dashboard')}
                          className="mt-8 px-8 py-3 bg-brand-navy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-midnight transition-all active:scale-95 shadow-xl"
                        >
                          Return to Command
                        </button>
                      </div>
                    </div>
                  );
                }
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Parallax Background Decor */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            style={{ x: bgX, y: bgY }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-navy/5 dark:bg-brand-navy/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" 
          />
          <motion.div 
            style={{ x: bgXInverted, y: bgYInverted }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-midnight/5 dark:bg-blue-900/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" 
          />
        </div>
      </main>
    </motion.div>
  );
};

const getIconForView = (view: string) => {
  switch (view) {
    case 'dashboard': return <LayoutDashboard size={20} />;
    case 'resources': return <Database size={20} />;
    case 'compliance': return <ShieldCheck size={20} />;
    case 'vault': return <Key size={20} />;
    case 'findings': return <AlertTriangle size={20} />;
    case 'visualizer': return <Share2 size={20} />;
    case 'reports': return <FileText size={20} />;
    default: return <Settings size={20} />;
  }
};

export default App;
