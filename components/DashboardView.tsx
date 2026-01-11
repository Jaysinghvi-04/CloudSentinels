
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';
import { AlertCircle, Activity, ArrowUpRight, CheckCircle, ShieldCheck } from 'lucide-react';

const riskData = [
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'High', value: 25, color: '#f97316' },
  { name: 'Medium', value: 45, color: '#0A2463' },
  { name: 'Low', value: 18, color: '#1D3557' },
];

const trendData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 72 },
  { name: 'Thu', score: 70 },
  { name: 'Fri', score: 75 },
  { name: 'Sat', score: 78 },
  { name: 'Sun', score: 78 },
];

const recentActivity = [
  { id: '1', msg: 'New S3 bucket "finance-backups" detected in AWS-PROD', time: '2 mins ago', type: 'alert' },
  { id: '2', msg: 'Remediation successful: Public access removed from Azure Disk', time: '14 mins ago', type: 'success' },
  { id: '3', msg: 'Policy update: NIST 800-53 compliance mapping refreshed', time: '1 hour ago', type: 'info' },
  { id: '4', msg: 'GCP Service Account "deploy-worker" assigned excess roles', time: '3 hours ago', type: 'warning' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const DashboardView: React.FC = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[1600px] mx-auto"
    >
      <div className="flex items-center justify-between">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Security Command</h1>
          <p className="text-slate-500 mt-1 font-medium">Multi-cloud posture & threat surface orchestration.</p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-3">
          <div className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Global Scan Active</span>
          </div>
        </motion.div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Compliance Overall" 
          value="78.4%" 
          trend="+1.2%" 
          icon={<ShieldCheck className="text-brand-navy" />} 
          chart={<MiniTrend data={trendData} color="#0A2463" />}
        />
        <StatCard 
          label="Active Threats" 
          value="12" 
          trend="-4" 
          icon={<AlertCircle className="text-amber-500" />} 
          chart={<MiniTrend data={trendData} color="#f59e0b" />}
        />
        <StatCard 
          label="Inventory (Assets)" 
          value="4,291" 
          trend="+124" 
          icon={<Activity className="text-blue-500" />} 
          chart={<MiniTrend data={trendData} color="#3b82f6" />}
        />
        <StatCard 
          label="Auto-Remediations" 
          value="156" 
          trend="+22" 
          icon={<CheckCircle className="text-emerald-500" />} 
          chart={<MiniTrend data={trendData} color="#10b981" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Gauge */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="lg:col-span-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-navy via-blue-500 to-emerald-500"></div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 self-start mb-8">Posture Integrity</h3>
          
          <div className="relative w-56 h-56 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <motion.circle 
                  cx="112" cy="112" r="100" 
                  stroke="currentColor" strokeWidth="16" fill="transparent" 
                  strokeDasharray="628" 
                  initial={{ strokeDashoffset: 628 }}
                  animate={{ strokeDashoffset: 628 * (1 - 0.784) }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="text-brand-navy" strokeLinecap="round" 
                />
             </svg>
             <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-slate-900 dark:text-white">78%</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mt-1 text-center">Verified Score</span>
             </div>
          </div>
          
          <div className="mt-12 space-y-4 w-full">
            <StandardProgress label="CIS Benchmark" score={92} color="bg-emerald-500" />
            <StandardProgress label="NIST 800-53" score={64} color="bg-brand-navy" />
            <StandardProgress label="SOC2 Type II" score={81} color="bg-blue-500" />
          </div>
        </motion.div>

        {/* Severity Breakdown */}
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="lg:col-span-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                  itemStyle={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-500">{item.name}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="lg:col-span-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Attack Vectors (Live)</h3>
            <button className="text-[10px] uppercase font-black text-brand-navy dark:text-blue-400 tracking-wider hover:text-brand-midnight transition-colors">Stream Monitor</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <motion.div 
                key={activity.id} 
                whileHover={{ x: 5 }}
                className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl group transition-all"
              >
                <div className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${
                  activity.type === 'alert' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
                  activity.type === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' :
                  activity.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-brand-navy shadow-[0_0_8px_rgba(10,36,99,0.4)]'
                }`}></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{activity.msg}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-500 dark:text-slate-600 font-mono font-bold tracking-tighter">{activity.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const StandardProgress = ({ label, score, color }: { label: string, score: number, color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{score}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        className={`h-full ${color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
      />
    </div>
  </div>
);

const StatCard: React.FC<{ label: string, value: string, trend: string, icon: React.ReactNode, chart: React.ReactNode }> = ({ label, value, trend, icon, chart }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-all group overflow-hidden relative shadow-md"
  >
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 transition-colors shadow-inner text-brand-navy dark:text-blue-400">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend}
        <ArrowUpRight size={12} strokeWidth={3} className={trend.startsWith('-') ? 'rotate-90' : ''} />
      </div>
    </div>
    <div className="space-y-1 relative z-10">
      <h4 className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</h4>
      <p className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{value}</p>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-12 opacity-10 dark:opacity-20 group-hover:opacity-40 transition-opacity">
      {chart}
    </div>
  </motion.div>
);

const MiniTrend: React.FC<{ data: any[], color: string }> = ({ data, color }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <Area type="monotone" dataKey="score" stroke={color} fill={color} fillOpacity={0.4} strokeWidth={2} />
    </AreaChart>
  </ResponsiveContainer>
);

export default DashboardView;
