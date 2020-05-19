const env = process.env.NODE_ENV; // 'dev' or 'test'

const standart = {
  SALT: 10,
  MONGODB_URI: 'mongodb+srv://VitaliyHr:rZtZ4wS5D8ETAlxC@cluster0-uuhtj.mongodb.net/test_exersise',
  SESSION_SECRET: 'some value',
  LOGIN: 'hryhorivvetal@gmail.com',
  PASS: 'Cqwertyuiop2002',
  SITE_URI: 'http://localhost:3000',
  PORT: '3000',
  SITE_MOUNT: '/api',
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
};

const config = {
  default: standart,
  test,
  production,
};

module.exports = config[env];
