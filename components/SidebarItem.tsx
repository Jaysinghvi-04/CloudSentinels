
import React from 'react';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
        ${active 
          ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-800/50' 
          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
        }
      `}
    >
      <span className={`shrink-0 transition-colors ${active ? 'text-brand-navy dark:text-blue-400' : 'group-hover:text-slate-900 dark:group-hover:text-slate-100'}`}>
        {icon}
      </span>
      <span className="hidden lg:block font-medium truncate">{label}</span>
      
      {active && (
        <motion.span 
          layoutId="sidebar-active-indicator"
          className="ml-auto hidden lg:block w-1.5 h-1.5 rounded-full bg-brand-navy shadow-[0_0_8px_rgba(10,36,99,0.6)]"
        />
      )}
    </motion.button>
  );
};

export default SidebarItem;
