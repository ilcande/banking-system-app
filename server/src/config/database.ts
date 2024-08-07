const { Client } = require("pg");
require('dotenv').config(); // Load environment variables from .env file

let client;

// Connect to the database
client = new Client({ connectionString: process.env.DATABASE_URL })

// Export the client
module.exports = client;
