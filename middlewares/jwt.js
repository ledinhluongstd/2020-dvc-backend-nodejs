import jwt from 'jsonwebtoken'
import { Base64 } from 'js-base64';
import { TIME_REFRESH_TOKEN } from '../config/setup';

let globalConfig = require('../config/preferences');
let constRes = require('../common/constants/response');
let mwLog = require('./log');

let mwJWT = {
  generate: function (payloads) {
    let token = jwt.sign(payloads, globalConfig.jwt.secret, {
      issuer: globalConfig.jwt.iss,
      audience: globalConfig.jwt.aud,
      expiresIn: '1h'
    });
    return token;
  },

  verify: function (token, req) {
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

  decode: function (token) {
    let decode = undefined;
    try {
      decode = jwt.decode(token, globalConfig.jwt.secret, {
        issuer: globalConfig.jwt.iss,
        audience: globalConfig.jwt.aud
      });
    } catch (err) {
    }
    return decode;
  },

  decodeAuthorization: (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      var token = req.headers.authorization.split(' ')[1];
      req.tokenObj = jwt.decode(token);
      if (!req.tokenObj) {
        mwLog.generate(req, constRes.RESPONSE_ERR_NOTAUTHORIZED);
        res.status(constRes.RESPONSE_ERR_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_NOTAUTHORIZED.body);
        return;
      } else {
        next();
      }
    } else {
      mwLog.generate(req, constRes.RESPONSE_ERR_NOTAUTHORIZED);
      res.status(constRes.RESPONSE_ERR_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_NOTAUTHORIZED.body);
      return;
    }
  },

  checkApiAuthorization: function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == "Bearer") {
      let token = req.headers.authorization.split(' ')[1];
      let permission = req.headers.permission
      let tokenObj = mwJWT.verify(token, req);
      permission = JSON.parse(Base64.decode(permission))
      req.tokenObj = tokenObj
      req.permissionObj = permission
      if (!req.tokenObj) {
        mwLog.generate(req, constRes.RESPONSE_ERR_NOTAUTHORIZED);
        res.status(constRes.RESPONSE_ERR_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_NOTAUTHORIZED.body);
        return;
      } else {
        if (permission === globalConfig.super.roles) {
          next();
        } else {
          let checkPermission = 0
          permission.ChucNang.forEach((item) => {
            if (req.originalUrl.includes(item.Ma) && item.HanhDong[req.method] && checkPermission === 0) {
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
      }
    } else {
      mwLog.generate(req, constRes.RESPONSE_ERR_NOTAUTHORIZED);
      res.status(constRes.RESPONSE_ERR_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_NOTAUTHORIZED.body);
      return;
    }
  },

  checkReportAuthorization: function (req, res, next) {
    if (req.query && req.query.token) {
      let token = req.query.token;
      req.tokenObj = mwJWT.verify(token, req);
      if (!req.tokenObj) {
        mwLog.generate(req, constRes.RESPONSE_ERR_NOTAUTHORIZED);
        res.status(constRes.RESPONSE_ERR_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_NOTAUTHORIZED.body);
        return;
      } else {
        next();
      }
    } else {
      mwLog.generate(req, constRes.RESPONSE_ERR_NOTAUTHORIZED);
      res.status(constRes.RESPONSE_ERR_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_NOTAUTHORIZED.body);
      return;
    }
  },
}

module.exports = mwJWT;