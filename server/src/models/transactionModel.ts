const client = require('../config/database');
import { CreateTransactionParams } from "../interfaces/transactions/CreateTransactionParams";

export async function createTransaction(transaction: CreateTransactionParams, client: any): Promise<CreateTransactionParams> {
  const query = `
    INSERT INTO transactions (account_id, type, amount, date, target_account_id, created_at)
    VALUES ($1, $2, $3, current_timestamp, $4, current_timestamp)
    RETURNING transaction_id, account_id, type, amount, date, target_account_id, created_at;
  `;
  const values = [
    transaction.account_id,
    transaction.type,
    transaction.amount,
    transaction.target_account_id || null,
  ];

  const result = await client.query(query, values);
  return result.rows[0];
}

export async function fetchTransactionsByAccountId(accountId: number): Promise<CreateTransactionParams[]> {
  const query = `
    SELECT * FROM transactions
    WHERE account_id = $1
    ORDER BY date DESC;
  `;
  const result = await client.query(query, [accountId]);
  return result.rows;
}


