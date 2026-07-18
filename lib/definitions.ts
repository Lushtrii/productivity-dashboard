export interface Todo {
  id: string;
  title: string;
  dueDate: Temporal.PlainDate;
  dueTime: Temporal.PlainTime;
  priorityLevel: number;
  isComplete: boolean;
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
  activeDays: boolean[];
}

export interface TimeRange {
  startTime: Temporal.PlainTime;
  endTime: Temporal.PlainTime;
}
