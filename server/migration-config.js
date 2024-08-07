require('dotenv').config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  migrationsDirectory: 'server/migrations',
  driver: 'pg',
  direction: 'up'
};
