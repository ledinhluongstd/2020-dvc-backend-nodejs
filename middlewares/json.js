import jwt from 'jsonwebtoken'
import { Base64 } from 'js-base64';
let globalConfig = require('../config/preferences');
let constRes = require('../common/constants/response');
let mwLog = require('./log');

let mwJson = {
  checkJson: (req, res, next) => {
    // Check if request payload content-type matches json, because body-parser does not check for content types
    if (!req.is('json')) {
      mwLog.generate(req, constRes.RESPONSE_ERR_FORMAT_JSON);
      res.status(constRes.RESPONSE_ERR_FORMAT_JSON.status).send(constRes.RESPONSE_ERR_FORMAT_JSON.body);
      return
    } else {
      next();
    }
  },
}

module.exports = mwJson;