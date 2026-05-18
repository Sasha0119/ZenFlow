/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';

interface AnalyticsProps {
  onClose: () => void;
}

export function Analytics({ onClose }: AnalyticsProps) {
  const tasks = useStore((state) => state.tasks);
  const columns = useStore((state) => state.columns);

  const tasksByColumn = columns.map(col => ({
    name: col.title,
    count: tasks.filter(t => t.columnId === col.id).length
  }));

  const tasksByPriority = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#fb7185' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#fbbf24' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#60a5fa' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/60 backdrop-blur-md">
      <div className="bg-[#18181B] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/5">
        <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 bg-[#18181B]/80 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Productivity Analytics</h2>
            <p className="text-xs text-slate-500">A detailed breakdown of your workflow performance</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status Breakdown */}
          <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
              Task Status Distribution
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasksByColumn} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#ffffff02' }}
                    contentStyle={{ backgroundColor: '#09090B', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', fontSize: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Pie */}
          <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full"></span>
              Priority Breakdown
            </h3>
            <div className="h-64 w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {tasksByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090B', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', fontSize: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 pr-4">
                {tasksByPriority.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.name}</span>
                    <span className="text-xs font-semibold text-white ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">
            <StatCard title="Total Tasks" value={tasks.length} sub="Overall board capacity" />
            <StatCard title="In Progress" value={tasks.filter(t => t.columnId === 'inprogress').length} sub="Active work items" color="text-indigo-400" />
            <StatCard title="Completed" value={tasks.filter(t => t.columnId === 'done').length} sub="Successfully finished" color="text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, color = "text-white" }: { title: string, value: number, sub: string, color?: string }) {
  return (
    <div className="bg-black/20 p-6 rounded-2xl border border-white/5 shadow-sm">
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</h4>
      <p className={cn("text-3xl font-light tracking-tight", color)}>{value}</p>
      <p className="text-[10px] text-slate-600 mt-1">{sub}</p>
    </div>
  );
}
