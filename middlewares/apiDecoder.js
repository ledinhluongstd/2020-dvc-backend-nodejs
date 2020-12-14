import jwt from 'jsonwebtoken'
import { Base64 } from 'js-base64';
let globalConfig = require('../config/preferences');
let constRes = require('../common/constants/response');
let mwLog = require('./log');

let mwDecodeApi = {
  decodeApi: (req, res, next) => {
    next()
  },
}

module.exports = mwDecodeApi;