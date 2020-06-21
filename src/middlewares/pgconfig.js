import { Pool } from 'pg';
import {
  PSQL_DATABASE,
  PSQL_USER,
  PSQL_PORT,
  PSQL_HOST,
  PSQL_PASS,
} from '../../config/config';

const pool = new Pool({
  user: PSQL_USER,
  port: PSQL_PORT,
  host: PSQL_HOST,
  database: PSQL_DATABASE,
  password: PSQL_PASS,
});

export default pool;
