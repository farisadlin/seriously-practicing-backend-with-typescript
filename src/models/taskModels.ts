export interface Task {
  id?: number;
  user_id: string | number;
  title: string;
  description: string;
  completed?: number | boolean;
  created_at?: Date;
  updated_at?: Date;
}
