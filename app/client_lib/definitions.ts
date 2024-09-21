export type UserRegistration = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
};

export type TaskCreate = {
  user_id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In progress' | 'Internal Testing',
  due_date: string,
  created_at: string;
  updated_at: string;
}

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  userId: string;
  status: 'Pending' | 'In progress' | 'Internal Testing'
}
