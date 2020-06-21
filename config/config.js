const env = process.env.NODE_ENV; // 'dev' or 'test'

const standart = {
  SALT: 10,
  // MONGODB_URI: 'mongodb+srv://VitaliyHr:rZtZ4wS5D8ETAlxC@cluster0-uuhtj.mongodb.net/test_exersise',
  MONGODB_URI: 'mongodb://localhost:27017/testexersise',
  SESSION_SECRET: 'some value',
  LOGIN: 'hryhorivvetal@gmail.com',
  PASS: 'Cqwertyuiop2002',
  SITE_URI: 'http://localhost:3000',
  PORT: '3000',
  SITE_MOUNT: '/api',
  PSQL_USER: 'me',
  PSQL_PORT: 5432,
  PSQL_HOST: 'localhost',
  PSQL_PASS: 12345678,
  PSQL_DATABASE: 'testexersise',
};

const test = {
  SALT: 10,
  MONGODB_URI: 'mongodb://localhost:27017/TestTest',
  SESSION_SECRET: 'some value',
  LOGIN: 'hryhorivvetal@gmail.com',
  PASS: 'Cqwertyuiop2002',
  SITE_URI: 'http://localhost:3000',
  PORT: '3000',
  SITE_MOUNT: '/api',
  PSQL_USER: 'me',
  PSQL_PORT: 5432,
  PSQL_HOST: 'localhost',
  PSQL_PASS: 12345678,
  PSQL_DATABASE: 'testexersise',
};

const production = {
  SALT: process.env.SALT,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  LOGIN: process.env.LOGIN,
  PASS: process.env.PASS,
  SITE_URI: process.env.SITE_URI,
  PORT: process.env.PORT,
  SITE_MOUNT: process.env.SITE_MOUNT,
  PSQL_USER: process.env.PSQL_USER,
  PSQL_PORT: process.env.PSQL_PORT,
  PSQL_HOST: process.env.PSQL_HOST,
  PSQL_PASS: process.env.PSQL_PASS,
  PSQL_DATABASE: process.env.PSQL_DATABASE,
};

const config = {
  default: standart,
  test,
  production,
};

module.exports = config[env];
