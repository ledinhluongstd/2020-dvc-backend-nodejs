import jwt from 'jsonwebtoken'
import { Base64 } from 'js-base64';
import { TIME_REFRESH_TOKEN } from '../config/setup';

let globalConfig = require('../config/preferences');
let constRes = require('../common/constants/response');
let mwLog = require('./log');

let mwDVC = {
  verify: function (token) { // cần kiểm tra token có tồn tại hay không
    var decode = false;
    try {
      decode = jwt.verify(token, globalConfig.jwt.secret, {
        issuer: globalConfig.jwt.iss,
        audience: globalConfig.jwt.aud
      });
    } catch (err) {
      return false;
    }
    return decode;
  },
  checkDonViAuthorization: function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == "Bearer") {
      let apiToken = req.headers.authorization.split(' ')[1];
      req.apiToken = apiToken
      next();
    } else {
      mwLog.generate(req, constRes.RESPONSE_ERR_UNIT_NOTAUTHORIZED);
      res.status(constRes.RESPONSE_ERR_UNIT_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_UNIT_NOTAUTHORIZED.body);
      return;
    }
  },
  checkDVCAuthorization: function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == "Bearer") {
      let token = req.headers.authorization.split(' ')[1];
      let tokenObj = mwDVC.verify(token);
      req.tokenObj = tokenObj
      if (!req.tokenObj) {
        mwLog.generate(req, constRes.RESPONSE_ERR_NOTAUTHORIZED);
        res.status(constRes.RESPONSE_ERR_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_NOTAUTHORIZED.body);
        return;
      } else {
        let checkPermission = 0
        tokenObj.DVKN.forEach((item) => {
          if (req.originalUrl.includes(item.Url) && checkPermission === 0) {
            checkPermission++;
            next()
          }
        })
        if (!checkPermission) {
          mwLog.generate(req, constRes.RESPONSE_ERR_PERMISTION);
          res.status(constRes.RESPONSE_ERR_PERMISTION.status).send(constRes.RESPONSE_ERR_PERMISTION.body);
          return
        }
      }
    } else {
      mwLog.generate(req, constRes.RESPONSE_ERR_UNIT_NOTAUTHORIZED);
      res.status(constRes.RESPONSE_ERR_UNIT_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_UNIT_NOTAUTHORIZED.body);
      return;
    }
  }
}

module.exports = mwDVC;