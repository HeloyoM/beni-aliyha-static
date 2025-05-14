export default interface IPayment {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}