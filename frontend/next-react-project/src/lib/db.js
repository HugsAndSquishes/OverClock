import { Pool } from 'pg';

// TODO: put in .env file
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'overclock_database',
  password: 'test',
  port: 5432,
});

const query = (text, params) => pool.query(text, params);

export default { query };