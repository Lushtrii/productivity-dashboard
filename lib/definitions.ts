export interface Todo {
  id: string;
  title: string;
  dueDate: Temporal.PlainDate | null;
  dueTime: Temporal.PlainTime | null;
  priorityLevel: number | null;
  isComplete: boolean;
  completionTime: Temporal.PlainDateTime | null;
}

export function isTodo(obj: unknown): obj is Todo {
  return (
    (obj as Todo).id !== undefined &&
    typeof (obj as Todo).id === "string" &&
    (obj as Todo).title !== undefined &&
    typeof (obj as Todo).title === "string" &&
    (obj as Todo).dueDate !== undefined &&
    ((obj as Todo).dueDate instanceof Temporal.PlainDate ||
      (obj as Todo).dueDate === null) &&
    (obj as Todo).dueTime !== undefined &&
    ((obj as Todo).dueTime instanceof Temporal.PlainTime ||
      (obj as Todo).dueTime === null) &&
    (obj as Todo).priorityLevel !== undefined &&
    (typeof (obj as Todo).priorityLevel === "number" ||
      (obj as Todo).priorityLevel === null) &&
    (obj as Todo).isComplete !== undefined &&
    typeof (obj as Todo).isComplete === "boolean" &&
    (obj as Todo).completionTime !== undefined &&
    ((obj as Todo).completionTime instanceof Temporal.PlainDateTime ||
      (obj as Todo).completionTime === null)
  );
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
