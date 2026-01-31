import { pool } from "../db/postgres/postgres.js";
import type { DBTask } from "../db/postgres/types.js";
import type { Task, TaskData } from "../types/task.type.js";

export class TasksModel {
  static async insertTask(newTask: TaskData, userId: string) {
    const { title, description } = newTask;

    const taskId = crypto.randomUUID();

    const query = await pool.query(
      `
      INSERT INTO tasks(task_id,user_id,title,description)
      VALUES($1,$2,$3,$4)
      RETURNING *
      `,
      [taskId, userId, title, description],
    );

    const task = query.rows[0] as DBTask;

    const parsedTask: Task = {
      userId: task.user_id,
      taskId: task.task_id,
      title: task.title,
      description: task.description,
    };

    return parsedTask;
  }

  static async getUserTasks(userId: string) {
    const tasks = await pool.query(
      `
      SELECT * FROM tasks
      WHERE user_id = $1
      `,
      [userId],
    );

    return tasks.rows;
  }

  static async updateTask(userId: string, taskId: string, newData: TaskData) {
    const { title, description } = newData;

    const task = await pool.query(
      `
      UPDATE tasks SET title = $1, description = $2
      WHERE task_id = $3 AND user_id = $4
      RETURNING *
      `,
      [title, description, taskId, userId],
    );
    return task.rows[0];
  }

  static async deleteTask(userId: string, taskId: string) {
    const task = await pool.query(
      `
      DELETE FROM tasks
      WHERE task_id = $1 AND user_id = $2
      RETURNING task_id
      `,
      [taskId, userId],
    );

    return task.rows[0];
  }
}
