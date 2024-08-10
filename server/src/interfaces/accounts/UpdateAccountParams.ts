export interface UpdateAccountParams {
  accountId: number; // Always required for identifying the account
  type?: 'savings' | 'checking'; // Optional type field
  balance?: number; // Optional balance field
}
