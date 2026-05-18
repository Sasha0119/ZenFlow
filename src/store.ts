/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Column, Task, Activity, Priority } from './types';

interface ZenStore {
  columns: Column[];
  tasks: Task[];
  activities: Activity[];
  addTask: (columnId: string, title: string, description: string, priority: Priority, deadline: string) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
  logActivity: (type: Activity['type'], content: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
}

export const useStore = create<ZenStore>()(
  persist(
    (set) => ({
      columns: [
        { id: 'todo', title: 'To Do' },
        { id: 'inprogress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
      ],
      tasks: [
        {
          id: '1',
          title: 'Design ZenFlow UI',
          description: 'Create a minimal and ultra-clean interface design.',
          priority: 'high',
          deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
          columnId: 'todo',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Implement DnD',
          description: 'Use dnd-kit for smooth task dragging.',
          priority: 'medium',
          deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
          columnId: 'inprogress',
          createdAt: new Date().toISOString(),
        },
      ],
      activities: [
        {
          id: 'a1',
          type: 'create',
          content: 'Board initialized',
          timestamp: new Date().toISOString(),
        }
      ],

      addTask: (columnId, title, description, priority, deadline) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          description,
          priority,
          deadline,
          columnId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
          activities: [
            {
              id: crypto.randomUUID(),
              type: 'create' as const,
              content: `Added task "${title}"`,
              timestamp: new Date().toISOString(),
            },
            ...state.activities,
          ].slice(0, 50),
        }));
      },

      moveTask: (taskId, newColumnId) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;
          
          const newTasks = state.tasks.map((t) =>
            t.id === taskId ? { ...t, columnId: newColumnId } : t
          );
          
          return {
            tasks: newTasks,
            activities: [
              {
                id: crypto.randomUUID(),
                type: 'move' as const,
                content: `Moved "${task.title}" to ${newColumnId}`,
                timestamp: new Date().toISOString(),
              },
              ...state.activities,
            ].slice(0, 50),
          };
        });
      },

      deleteTask: (taskId) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          return {
            tasks: state.tasks.filter((t) => t.id !== taskId),
            activities: [
              {
                id: crypto.randomUUID(),
                type: 'delete' as const,
                content: `Deleted task "${task?.title}"`,
                timestamp: new Date().toISOString(),
              },
              ...state.activities,
            ].slice(0, 50),
          };
        });
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
        }));
      },

      addColumn: (title) => {
        set((state) => ({
          columns: [...state.columns, { id: crypto.randomUUID(), title }],
        }));
      },

      deleteColumn: (columnId) => {
        set((state) => ({
          columns: state.columns.filter((c) => c.id !== columnId),
          tasks: state.tasks.filter((t) => t.columnId !== columnId),
        }));
      },

      logActivity: (type, content) => {
        set((state) => ({
          activities: [
            {
              id: crypto.randomUUID(),
              type: type as any,
              content,
              timestamp: new Date().toISOString(),
            },
            ...state.activities,
          ].slice(0, 50),
        }));
      },

      reorderTasks: (newTasks) => {
        set({ tasks: newTasks });
      }
    }),
    {
      name: 'zenflow-storage',
    }
  )
);
