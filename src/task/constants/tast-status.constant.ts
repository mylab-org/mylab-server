export const TASK_STATUS = [
  'READY', // 시작전
  'IN_PROGRESS', // 진행중
  'COMPLETED', // 완료
] as const;

export type TaskStatus = (typeof TASK_STATUS)[number];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  READY: '시작 전',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
};

export const DEFAULT_TASK_STATUS: TaskStatus = 'READY';
