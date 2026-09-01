export type TransactionType = "income" | "expense";

export type Category = {
  id: string;
  user_id: string | null;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category_id: string | null;
  description: string | null;
  date: string;
  created_at: string;
};

export type TransactionWithCategory = Transaction & {
  categories: Pick<Category, "name" | "icon"> | null;
};
