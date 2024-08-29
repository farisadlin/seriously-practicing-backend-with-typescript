export interface Task {
  id?: number;
  userId: string | number;
  title: string;
  description: string;
  completed?: number | boolean;
}
