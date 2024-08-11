export interface CreateTransactionParams {
  transaction_id?: number;
  account_id: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  date?: Date;
  target_account_id?: number;
  created_at?: Date;
}
