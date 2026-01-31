export type DBUser = {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
};

export type DBTask = {
  user_id: string;
  task_id: string;
  title: string;
  description: string;
};
