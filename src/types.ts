/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  deadline: string;
  columnId: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
}

export interface Activity {
  id: string;
  type: 'create' | 'move' | 'delete' | 'complete';
  content: string;
  timestamp: string;
}

export interface BoardState {
  columns: Column[];
  tasks: Task[];
  activities: Activity[];
}
