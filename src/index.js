import express from 'express';
import { connect } from 'mongoose';
import fileUpload from 'express-fileupload';
import { join } from 'path';
import session from 'express-session';
import compression from 'compression';
import config from 'config';

import Router from './routes/index';
import log4js from './middlewares/loggerConfig';

const SessionStore = require('connect-mongodb-session')({ session });

const app = express();

const logger = log4js.getLogger();
const errLogger = log4js.getLogger('error');


const store = new SessionStore({
  collection: 'sessions',
  uri: config.get('MONGODB_URI'),
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
  secret: config.get('SESSION_SECRET'),
  store,
}));

app.use(config.get('SITE_MOUNT'), Router.CreateRouter());

async function start() {
  try {
    await connect(config.get('MONGODB_URI'), {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const PORT = config.get('PORT');
    app.listen(PORT, () => {
      logger.info(`Server is alive on ${PORT}`);
      app.emit('AppStarted');
    });
  } catch (e) {
    const error = `Failed to connect to mongoDB.${e}`;
    errLogger.fatal(error);
    process.exit(1);
  }
}

start();

export default app;
