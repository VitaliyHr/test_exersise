import log4js from './loggerConfig';

const logger = log4js.getLogger('error');

export default (err, req, res, next) => {
  if (!err) {
    return next();
  }
  logger.error(err);
  return next();
};