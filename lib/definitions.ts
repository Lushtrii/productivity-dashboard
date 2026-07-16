export interface Todo {
  id: string;
  title: string;
  dueDate: string;
  createdAt: string;
  priorityLevel: number;
  isComplete: boolean;
  completionTime: string;
}

export interface HabitResult {
  id: string;
  title: string;
  completions: HabitCompletion[];
}

export interface HabitCompletion {
  id: string;
  targetDate: Temporal.PlainDate;
}

export interface ActiveBlockSessionSummary {
  id: string;
  title: string;
  activeTimes: TimeRange[];
}

export interface TimeRange {
  startTime: Temporal.PlainTime;
  endTime: Temporal.PlainTime;
}
