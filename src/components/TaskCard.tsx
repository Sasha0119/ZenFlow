/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, MoreVertical, Flag } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const priorityColors = {
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    medium: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group relative bg-[#18181B] p-4 rounded-xl border border-white/5 shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing',
        isDragging ? 'opacity-30 border-dashed border-indigo-500/50' : 'hover:border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.05)]'
      )}
      id={`task-${task.id}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={cn(
          'px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border',
          priorityColors[task.priority]
        )}>
          {task.priority}
        </div>
        <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={14} />
        </button>
      </div>

      <h3 className="text-sm font-medium text-white mb-1 leading-tight">
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-3 mt-auto">
        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
          <Calendar size={12} className="opacity-50" />
          {format(new Date(task.deadline), 'MMM d')}
        </div>
      </div>
    </div>
  );
}
