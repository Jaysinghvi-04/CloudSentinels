
import React, { useState } from 'react';
import { Share2, Globe, Database, Server, Key, ShieldAlert, Zap, Info, ChevronRight, Activity, MousePointer2 } from 'lucide-react';

const VisualizerView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes = [
    { id: 'internet', icon: <Globe />, label: 'The Internet', x: 80, y: 180, color: 'text-zinc-400 dark:text-zinc-600' },
    { id: 'lb', icon: <Server />, label: 'Public LB (AWS)', x: 260, y: 180, color: 'text-blue-500' },
    { id: 'vm', icon: <Zap />, label: 'Prod-API-Cluster', x: 440, y: 180, color: 'text-red-500', alert: true },
    { id: 'role', icon: <Key />, label: 'Cross-Acc-IAM', x: 620, y: 180, color: 'text-amber-500' },
    { id: 'db', icon: <Database />, label: 'Core-Customer-S3', x: 800, y: 180, color: 'text-emerald-500' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">Path Vectorization</h1>
          <p className="text-zinc-500 mt-1 font-medium italic">Real-time blast-radius modeling showing active toxic paths to data assets.</p>
        </div>
        <div className="px-6 py-3 bg-red-600/5 dark:bg-red-600/10 border border-red-500/20 rounded-[24px] flex items-center gap-3 shadow-xl dark:shadow-none">
           <div className="relative">
             <ShieldAlert className="text-red-500" size={20} />
             <div className="absolute inset-0 bg-red-500 blur-lg opacity-40"></div>
           </div>
           <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest">Critical Path Violation Detected</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Graph Canvas */}
        <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[40px] relative overflow-hidden group shadow-2xl dark:shadow-none transition-colors duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          <div className="absolute top-8 left-8 flex items-center gap-3 z-30">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400 tracking-widest">Live Vector Analysis</span>
             </div>
             <div className="p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-help shadow-lg" title="Simulation Speed">
                <Activity size={16} className="text-zinc-400 dark:text-zinc-500" />
             </div>
          </div>

          <svg className="w-full h-full relative z-10 p-10 cursor-grab active:cursor-grabbing">
            {/* Background Paths (Dotted) */}
            <path d="M 80 180 Q 260 280 440 180" fill="none" stroke="currentColor" className="text-zinc-100 dark:text-zinc-900" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 440 180 Q 620 80 800 180" fill="none" stroke="currentColor" className="text-zinc-100 dark:text-zinc-900" strokeWidth="2" strokeDasharray="5 5" />

            {/* Toxic Path Line (Active) */}
            <path 
              d="M 80 180 L 260 180 L 440 180 L 620 180 L 800 180" 
              fill="none" 
              stroke="url(#toxicGradient)" 
              strokeWidth="6" 
              strokeLinecap="round"
              strokeDasharray="15 10"
              className="animate-[dash_30s_linear_infinite] filter drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]"
            />
            
            <defs>
              <linearGradient id="toxicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {nodes.map((node) => (
              <g 
                key={node.id} 
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node.id)}
                className="cursor-pointer group/node outline-none"
              >
                {/* Node Glow/Pulse */}
                {node.alert && (
                   <circle r="45" fill="currentColor" className="text-red-500/10 animate-pulse" />
                )}
                
                {/* Connection Dots */}
                <circle cx="-35" cy="0" r="2" className="fill-zinc-200 dark:fill-zinc-800" />
                <circle cx="35" cy="0" r="2" className="fill-zinc-200 dark:fill-zinc-800" />

                <circle 
                  r="34" 
                  fill="currentColor"
                  className={`
                    transition-all duration-300 shadow-2xl
                    ${selectedNode === node.id 
                      ? 'text-white dark:text-zinc-950 stroke-red-500 stroke-[3px]' 
                      : 'text-zinc-50 dark:text-[#09090b] stroke-zinc-200 dark:stroke-zinc-800 group-hover/node:stroke-zinc-400 dark:group-hover/node:stroke-zinc-600 stroke-[2px]'
                    }
                  `}
                />
                
                <foreignObject x="-16" y="-16" width="32" height="32" className={`${node.color} transition-transform duration-300 group-hover/node:scale-110`}>
                   {node.icon}
                </foreignObject>
                
                <text 
                  y="64" 
                  textAnchor="middle" 
                  className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${selectedNode === node.id ? 'fill-red-600 dark:fill-red-500' : 'fill-zinc-400 dark:fill-zinc-600 group-hover/node:fill-zinc-900 dark:group-hover/node:fill-zinc-300'}`}
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>

          <div className="absolute bottom-8 left-8 flex items-center gap-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-5 rounded-[28px] z-20 shadow-2xl dark:shadow-none">
             <LegendItem color="bg-zinc-200 dark:bg-zinc-800" label="Hardened" />
             <LegendItem color="bg-red-500" label="Toxic Node" glow />
             <LegendItem color="bg-emerald-500" label="Critical Data" />
             <div className="w-px h-6 bg-zinc-100 dark:bg-zinc-800 mx-2"></div>
             <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
               <MousePointer2 size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Select Node</span>
             </div>
          </div>
        </div>

        {/* Side Inspector */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
           {selectedNode ? (
             <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[40px] p-8 h-full animate-in slide-in-from-right-8 duration-500 shadow-2xl dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-[0.05] dark:opacity-[0.03] pointer-events-none rotate-12">
                   {nodes.find(n => n.id === selectedNode)?.icon}
                </div>

                <div className="flex items-start justify-between mb-10 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic">Telemetry Stream</span>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white">{nodes.find(n => n.id === selectedNode)?.label}</h3>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                    <Zap size={20} className="text-zinc-300 dark:text-zinc-600" />
                  </button>
                </div>

                <div className="space-y-8 relative z-10">
                   <section>
                      <h4 className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-3 italic">
                         <Info size={16} className="text-blue-500" /> Security State
                      </h4>
                      <div className="space-y-3">
                        <ContextItem label="Exposure" value="High (Direct)" />
                        <ContextItem label="SLA" value="24/7 Monitoring" />
                        <ContextItem label="Disk Encryption" value="Unencrypted" status="bad" />
                        <ContextItem label="Authn" value="MFA Enforcement" status="good" />
                      </div>
                   </section>

                   <section>
                      <h4 className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest mb-4 flex items-center gap-3 italic">
                         <ShieldAlert size={16} /> Vulnerability Feed
                      </h4>
                      <div className="p-5 bg-red-50 dark:bg-red-600/5 border border-red-200 dark:border-red-500/20 rounded-[28px] space-y-3 shadow-inner">
                        <p className="text-xs text-red-700 dark:text-red-400 font-bold leading-relaxed italic uppercase tracking-tight">
                          Resource is reachable via 0.0.0.0/0 on Port 22. Handshake allowed from untrusted zones.
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-500 text-[8px] font-black rounded uppercase tracking-widest">CVE-2024-1102</span>
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-500 text-[8px] font-black rounded uppercase tracking-widest">Active Exploit</span>
                        </div>
                      </div>
                   </section>

                   <button className="w-full mt-4 flex items-center justify-between p-5 bg-red-600 text-white rounded-[24px] hover:bg-red-500 transition-all shadow-xl shadow-red-900/20 group active:scale-95">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white/10 rounded-xl">
                          <Zap size={20} fill="currentColor" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Magic Resolve Path</span>
                      </div>
                      <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
           ) : (
             <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-[40px] p-10 h-full flex flex-col items-center justify-center text-center shadow-inner group transition-all duration-500">
                <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[28px] flex items-center justify-center mb-8 border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                  <Share2 size={40} className="text-zinc-200 dark:text-zinc-700 animate-pulse" />
                </div>
                <h3 className="text-lg font-black italic uppercase text-zinc-400 dark:text-zinc-600 mb-2">Vector Inspector</h3>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-700 font-black max-w-[220px] leading-relaxed uppercase tracking-widest">Select a cluster node to visualize its security context and potential exfiltration routes.</p>
             </div>
           )}
        </div>
      </div>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
};

const LegendItem = ({ color, label, glow }: { color: string, label: string, glow?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`w-2 h-2 rounded-full ${color} ${glow ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`}></div>
    <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">{label}</span>
  </div>
);

const ContextItem = ({ label, value, status }: { label: string, value: string, status?: 'good' | 'bad' }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/50 shadow-inner">
     <span className="text-[10px] text-zinc-500 dark:text-zinc-600 font-black uppercase tracking-widest">{label}</span>
     <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${status === 'good' ? 'text-emerald-600 dark:text-emerald-500' : status === 'bad' ? 'text-red-600 dark:text-red-500' : 'text-zinc-800 dark:text-zinc-300'}`}>{value}</span>
  </div>
);

export default VisualizerView;
