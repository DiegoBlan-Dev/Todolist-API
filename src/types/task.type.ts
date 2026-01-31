export type Task = {
  title: string;
  description: string;
  userId: string;
  taskId?: string;
};

export type TaskData = {
  title: string;
  description?: string;
};
