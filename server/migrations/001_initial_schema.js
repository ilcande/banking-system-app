exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
      id: 'id',
      username: { type: 'varchar(50)', notNull: true, unique: true },
      email: { type: 'varchar(100)', notNull: true, unique: true },
      password: { type: 'varchar(255)', notNull: true },
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true },
      updated_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true }
  });

  pgm.createTable('accounts', {
      account_id: 'id',
      account_number: { type: 'varchar(20)', notNull: true, unique: true },
      type: { type: 'varchar(20)', notNull: true, check: "type IN ('savings', 'checking')" },
      balance: { type: 'numeric(15, 2)', notNull: true, default: 0 },
      currency: { type: 'varchar(3)', notNull: true, default: 'EUR' },
      user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true },
      updated_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true }
  });

  pgm.createTable('transactions', {
      transaction_id: 'id',
      account_id: { type: 'integer', notNull: true, references: 'accounts(account_id)', onDelete: 'CASCADE' },
      type: { type: 'varchar(20)', notNull: true, check: "type IN ('deposit', 'withdrawal', 'transfer')" },
      amount: { type: 'numeric(15, 2)', notNull: true },
      date: { type: 'timestamp', default: pgm.func('current_timestamp') },
      target_account_id: { type: 'integer', references: 'accounts(account_id)', onDelete: 'SET NULL' },
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true }
  });

  pgm.createTable('statements', {
      statement_id: 'id',
      account_id: { type: 'integer', notNull: true, references: 'accounts(account_id)', onDelete: 'CASCADE' },
      month: { type: 'integer', notNull: true },
      year: { type: 'integer', notNull: true },
      pdf_path: { type: 'varchar(255)', notNull: true },
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp'), notNull: true }
  });
};
