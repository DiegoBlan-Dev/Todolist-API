export interface Task {
  task_id: string;
  user_id: string;
  title: string;
  description: string;
}

export interface TaskDTO {
  taskId?: string;
  userId?: string;
  title: string;
  description: string;
}
