export interface RegisterAccountParams {
  userId: number;
  type: 'savings' | 'checking';
  balance?: number;
  currency?: string;
}
