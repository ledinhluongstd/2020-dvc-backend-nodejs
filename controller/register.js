import express from 'express'
import bodyParser from 'body-parser'
import * as utils from '../common/utils'

let ObjectID = require('mongodb').ObjectID
let _configs = require('../config/preferences');
let constRes = require('../common/constants/response');
let mwLog = require('../middlewares/log');

let router = express.Router();

router.use(bodyParser.json());

function checkAccount(req, res) {
  let account = req.body.account
  if (utils.isObjEmpty(account)) {
    mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  }
  else {
    let rhApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    utils.Axios('get', rhApiUrl)//method, url, data
      .then(function (userApiRes) {
        if (userApiRes.status == 200) {
          if (userApiRes.data._returned) {
            let result = {
              status: 200,
              body: {
                account_existed: true,
                message: 'Tài khoản đã tồn tại'
              }
            }
            mwLog.generate(req, result);
            res.status(result.status).send(result.body);
          } else {
            let result = {
              status: 200,
              body: {
                account_existed: false,
                message: 'Tài khoản chưa tồn tại'
              }
            }
            mwLog.generate(req, result);
            res.status(result.status).send(result.body);
          }
        } else {
          mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
          res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        }
      }).catch(function (rhApiErr) {
        mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      })
  }
}

function create(req, res) {
  let account = req.body.account, pwd = req.body.pwd
  if (utils.isObjEmpty(account) || utils.isObjEmpty(pwd)) {
    mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  } else {
    let rhApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    let usersApiUrl = _configs.rh.dataUrl + "/tbUsers";

    utils.Axios('get', rhApiUrl)//method, url, data
      .then(function (userApiRes) {
        if (userApiRes.status == 200) {
          if (userApiRes.data._returned) {
            let result = {
              status: 400,
              body: {
                account_existed: true,
                message: 'Tài khoản đã tồn tại'
              }
            }
            mwLog.generate(req, result);
            res.status(result.status).send(result.body);
          } else {
            req.body.createdAt = new Date().getTime();
            req.body.createdBy = account;
            req.body.isActive = true;
            req.body.pwd = utils.encryptPassword(pwd)
            req.body.code = new ObjectID().toHexString()

            utils.Axios('post', usersApiUrl, req.body)//method, url, data
              .then(function (rhApiRes) {
                if (rhApiRes.headers.location) {
                  delete req.body.pwd
                  rhApiRes.data = req.body;
                }
                mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
                res.status(rhApiRes.status).send(rhApiRes.data);
              }).catch(function (rhApiErr) {
                try {
                  mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
                  res.status(rhApiErr.response.status).send(rhApiErr.response.data);
                } catch (e) {
                  res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
                }
              })
          }
        } else {
          mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
          res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        }
      }).catch(function (rhApiErr) {
        mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      })
  }
}

function getOtp(req, res) {
  // if (!req.body.account) {
  //   mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
  //   res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  // }
  // else {
  //   //check if exist verify code for this id?
  //   redisClient.get('register_info:' + req.body.account, function (redisErr, redisRes) {
  //     if (redisRes) {
  //       //verify info existed => validate code timer
  //       let cacheObj = JSON.parse(redisRes);
  //       let oldToken = cacheObj.token;

  //       cacheObj.token = speakeasy.totp({
  //         secret: cacheObj.secret.ascii,
  //         algorithm: 'sha256',
  //         step: 180
  //       });

  //       //update cache if token is regenerated
  //       if (cacheObj.token !== oldToken) {
  //         redisClient.setex('register_info:' + req.body.account, 3600, JSON.stringify(cacheObj));
  //       }

  //       //resend token to mobile/email

  //       mwLog.generate(req, { status: 200, body: cacheObj });
  //       res.status(200).send(cacheObj);
  //     } else {
  //       //verify info not exist
  //       let obj = {
  //         id: req.body.account,
  //         // generated: +moment(),
  //         // expired: +(monent().add(3, 'm')),
  //         secret: speakeasy.generateSecret({ length: 32 }),
  //       };
  //       obj.token = speakeasy.totp({
  //         secret: obj.secret.ascii,
  //         algorithm: 'sha256',
  //         step: 180
  //       });

  //       //save token info to cache
  //       redisClient.setex('register_info:' + req.body.account, 3600, JSON.stringify(obj));

  //       //send token to mobile/email

  //       mwLog.generate(req, { status: 200, body: obj });
  //       res.status(200).send(obj);
  //     }
  //   });
  // }
}

function verifyOtp(req, res) {
  // if (!req.body.account || !req.body.token) {
  //   mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
  //   res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  // }
  // else {
  //   redisClient.get('register_info:' + req.body.account, function (redisErr, redisRes) {
  //     if (redisRes) {
  //       let cacheObj = JSON.parse(redisRes);

  //       let tokenValid = speakeasy.totp.verify({
  //         secret: cacheObj.secret.ascii,
  //         algorithm: 'sha256',
  //         step: 180,
  //         token: req.body.token
  //       });

  //       if (!tokenValid) {
  //         mwLog.generate(req, {
  //           status: 200, body: {
  //             token_verified: false,
  //             message: 'Mã xác thực không hợp lệ'
  //           }
  //         });
  //         res.status(200).send({
  //           token_verified: false,
  //           message: 'Mã xác thực không hợp lệ'
  //         });
  //       } else {
  //         cacheObj.token_verified = true;
  //         redisClient.setex('register_info:' + req.body.account, 3600, JSON.stringify(cacheObj));

  //         mwLog.generate(req, {
  //           status: 200, body: {
  //             token_verified: true,
  //             message: 'Mã xác thực hợp lệ'
  //           }
  //         });
  //         res.status(200).send({
  //           token_verified: true,
  //           message: 'Mã xác thực hợp lệ'
  //         });
  //       }
  //     } else {
  //       mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
  //       res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  //     }
  //   });
  // }
}

export { checkAccount, create, getOtp, verifyOtp }