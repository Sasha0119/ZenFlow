/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';
import { cn } from '../lib/utils';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask?: (columnId: string) => void;
}

export function Column({ column, tasks, onAddTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="flex flex-col w-72 shrink-0 h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {column.title}
          </h2>
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 rounded">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onAddTask?.(column.id)}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 flex flex-col gap-3 p-2 rounded-2xl transition-colors duration-200 min-h-[150px]',
          isOver ? 'bg-indigo-500/5 border-2 border-dashed border-indigo-500/20' : 'bg-transparent'
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && !isOver && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-white/5 rounded-xl py-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
