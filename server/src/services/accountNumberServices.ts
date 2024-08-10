const client = require('../config/database');

function generateRandomDigits(length: number): string {
  let digits = '';
  for (let i = 0; i < length; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return digits;
}

async function isAccountNumberUnique(accountNumber: string): Promise<boolean> {
  const result = await client.query(
    'SELECT COUNT(*) FROM accounts WHERE account_number = $1',
    [accountNumber]
  );
  return parseInt(result.rows[0].count, 10) === 0;
}

export async function getUniqueAccountNumber(): Promise<string> {
  let accountNumber;
  do {
    accountNumber = `acc_${generateRandomDigits(10)}`;
  } while (!(await isAccountNumberUnique(accountNumber)));
  return accountNumber;
}
