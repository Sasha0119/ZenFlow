/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity as ActivityIcon, Clock, CheckCircle2, ArrowRightLeft, PlusSquare, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

export function Sidebar() {
  const activities = useStore((state) => state.activities);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <PlusSquare size={14} className="text-emerald-400" />;
      case 'move': return <ArrowRightLeft size={14} className="text-indigo-400" />;
      case 'delete': return <Trash2 size={14} className="text-rose-400" />;
      case 'complete': return <CheckCircle2 size={14} className="text-emerald-400" />;
      default: return <Clock size={14} className="text-slate-500" />;
    }
  };

  return (
    <div className="w-80 h-full border-l border-white/5 bg-black/10 flex flex-col hidden lg:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <ActivityIcon size={18} className="text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Activity Feed</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-2">
        <div className="space-y-6 relative before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-px before:bg-white/5">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6">
              <div className="absolute left-[-3px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/10 z-10"></div>
              <div>
                <p className="text-xs text-white leading-relaxed leading-snug">
                  {activity.content}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-center text-slate-700 text-xs py-8">No recent activity</p>
          )}
        </div>
      </div>

      <div className="p-6 bg-white/5">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-3">
          <Shortcut label="N" desc="New task" />
          <Shortcut label="A" desc="Open Analytics" />
          <Shortcut label="S" desc="Focus search" />
        </div>
      </div>
    </div>
  );
}

function Shortcut({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-slate-400">{desc}</span>
      <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-black text-[9px] font-bold text-white font-mono">
        {label}
      </kbd>
    </div>
  );
}
