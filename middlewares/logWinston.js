import winston from 'winston';

const myCustomLevels = {
  levels: {
    request: 0,
    response: 1,
    error: 2,
  },
  colors: {
    request: 'blue',
    response: 'green',
    error: 'yellow',
  }
};

winston.addColors(myCustomLevels.colors);

const logWinston = winston.createLogger({
  levels: myCustomLevels.levels,
  level: 'error', // log với các error: 2, response: 1, request: 0
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logWinston/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logWinston/response.log', level: 'response' }),
    new winston.transports.File({ filename: 'logWinston/request.log', level: 'request' }),
  ],
});

module.exports = logWinston;
