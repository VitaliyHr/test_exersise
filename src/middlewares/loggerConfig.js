import log4js from 'log4js';


log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    file: { type: 'file', filename: './logs/server.log', encoding: 'utf-8' },
  },
  categories: {
    default: { appenders: ['file', 'out'], level: 'debug' },
    error: { appenders: ['file', 'out'], level: 'error' },
  },
});
export default log4js;
