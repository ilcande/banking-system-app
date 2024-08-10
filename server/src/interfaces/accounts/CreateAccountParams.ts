export interface CreateAccountParams {
  accountNumber: string;
  type: 'savings' | 'checking';
  balance: number;
  currency: string;
  userId: number;
}
