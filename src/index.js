import express from 'express';
import { connect } from 'mongoose';
import fileUpload from 'express-fileupload';
import { join } from 'path';
import session from 'express-session';
import compression from 'compression';
import pool from './middlewares/pgconfig';

// import { trigger, table, funct } from './models/books';
import Router from './routes/index';
import log4js from './middlewares/loggerconfig';
import {
  MONGODB_URI, SESSION_SECRET, SITE_MOUNT, PORT,
} from '../config/config';

const SessionStore = require('connect-mongodb-session')({ session });

const app = express();

const logger = log4js.getLogger();
const errLogger = log4js.getLogger('error');


const store = new SessionStore({
  collection: 'sessions',
  uri: MONGODB_URI,
});

app.use(express.static(join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(fileUpload());
app.use(express.json());
app.use(log4js.connectLogger(errLogger));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  store,
}));

app.use(SITE_MOUNT, Router.CreateRouter());

app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).json({ error: 'Page not found' });
  }
});

async function start() {
  try {
    await connect(MONGODB_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await pool.connect();

    // try {
    //   await pool.query(table);
    //   await pool.query(funct);
    //   await pool.query(trigger);
    // } catch (err) {
    //   const error = `Failed to create table. ${err}`;
    //   throw error;
    // }

    app.listen(PORT, () => {
      logger.info(`Server is alive on ${PORT}`);
      app.emit('AppStarted');
    });
  } catch (e) {
    const error = new Error(`Failed to connect to DB.${e}`);
    errLogger.fatal(error.message);
    setTimeout(() => process.exit(1), 1500);
  }
}

start();

export default app;
