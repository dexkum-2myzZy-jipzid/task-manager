import { Task } from "./model/Task";

export function sortAndMergeTasks(tasksArray: Task[]) {
  const unfinishedTasks = tasksArray.filter((task) => !task.done);
  const finishedTasks = tasksArray.filter((task) => task.done);

  // Sort unfinished tasks by creation date, newest first
  const sortedUnfinishedTasks = unfinishedTasks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Sort finished tasks by finish date, or treat as newest if `finishedAt` is null
  const sortedFinishedTasks = finishedTasks.sort((a, b) => {
    const timeA = a.finishedAt
      ? new Date(a.finishedAt).getTime()
      : Number.MAX_SAFE_INTEGER;
    const timeB = b.finishedAt
      ? new Date(b.finishedAt).getTime()
      : Number.MAX_SAFE_INTEGER;
    return timeB - timeA;
  });

  // Merge and return the sorted tasks
  return [...sortedUnfinishedTasks, ...sortedFinishedTasks];
}

export const getTimePeriod = (filter: string): { start: Date; end: Date } => {
  let startOfPeriod = new Date();
  let endOfPeriod = new Date();

  switch (filter) {
    case "daily":
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod.setHours(23, 59, 59, 999);
      break;
    case "weekly":
      const dayOfWeek = startOfPeriod.getDay();
      startOfPeriod.setDate(startOfPeriod.getDate() - dayOfWeek);
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod.setDate(endOfPeriod.getDate() + (6 - dayOfWeek));
      endOfPeriod.setHours(23, 59, 59, 999);
      break;
    case "monthly":
      startOfPeriod.setDate(1);
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod.setMonth(endOfPeriod.getMonth() + 1);
      endOfPeriod.setDate(0);
      endOfPeriod.setHours(23, 59, 59, 999);
      break;
  }

  return { start: startOfPeriod, end: endOfPeriod };
};
