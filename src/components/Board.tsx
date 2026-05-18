/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardCode,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { Sidebar } from './Sidebar';
import { Analytics } from './Analytics';
import { useStore } from '../store';
import { Task, Priority } from '../types';
import { LayoutGrid, BarChart3, Search, Plus, Filter, Settings, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

export default function Board() {
  const { columns, tasks, moveTask, reorderTasks, addTask } = useStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        setIsAddingTask('todo');
      }
      if (e.key === 'a' || e.key === 'A') {
        setShowAnalytics(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (!isActiveATask) return;

    // Dropping a task over another task
    if (isActiveATask && isOverATask) {
      const activeTask = tasks.find(t => t.id === activeId);
      const overTask = tasks.find(t => t.id === overId);

      if (activeTask && overTask && activeTask.columnId !== overTask.columnId) {
        moveTask(activeTask.id, overTask.columnId);
      }
    }

    // Dropping a task over a column
    if (isActiveATask && isOverAColumn) {
      const activeTask = tasks.find(t => t.id === activeId);
      if (activeTask && activeTask.columnId !== overId) {
        moveTask(activeTask.id, overId as string);
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      const oldIndex = tasks.findIndex((t) => t.id === activeId);
      const newIndex = tasks.findIndex((t) => t.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTasks(arrayMove(tasks, oldIndex, newIndex));
      }
    }

    setActiveTask(null);
  }

  const handleCreateTask = (columnId: string) => {
    const title = prompt('Task Title:');
    if (!title) return;
    addTask(columnId, title, '', 'medium', new Date(Date.now() + 86400000).toISOString());
  };

  return (
    <div className="flex h-screen bg-[#09090B] font-sans text-slate-300 overflow-hidden">
      {/* Main Board Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-black/10 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <LayoutGrid size={18} className="text-white" />
              </div>
              <h1 className="font-semibold text-lg text-white tracking-tight select-none">ZenFlow</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <button className="px-3 py-1.5 text-xs font-semibold text-white bg-white/5 rounded-md">Board</button>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors">Timeline</button>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors">Calendar</button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full w-64 focus:ring-1 focus:ring-indigo-500/30 focus:bg-white/10 transition-all outline-none"
              />
            </div>
            <button 
              onClick={() => setShowAnalytics(true)}
              className="px-4 py-1.5 bg-indigo-500 text-white rounded-full text-xs font-medium hover:bg-indigo-600 transition-colors"
            >
              Analytics
            </button>
            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#09090B]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </header>

        {/* Board Content */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8 scrollbar-hide">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-8 h-full">
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={filteredTasks.filter((t) => t.columnId === column.id)}
                  onAddTask={handleCreateTask}
                />
              ))}
              
              {/* Add Column Placeholder */}
              <button className="w-72 shrink-0 h-10 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 hover:border-white/20 bg-white/2 mt-1 transition-all text-xs font-semibold group">
                <Plus size={14} className="group-hover:scale-110 transition-transform" />
                Add Column
              </button>
            </div>

            {createPortal(
              <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: {
                    active: {
                      opacity: '0.4',
                    },
                  },
                }),
              }}>
                {activeTask && (
                  <div className="rotate-3 shadow-2xl scale-105 pointer-events-none">
                    <TaskCard task={activeTask} />
                  </div>
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Analytics onClose={() => setShowAnalytics(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
