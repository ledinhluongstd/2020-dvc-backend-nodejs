import * as utils from '../common/utils'
import express from 'express'
import bodyParser from 'body-parser';

let mwLog = require('../middlewares/log');
let constRes = require('../common/constants/response');
let _configs = require('../config/preferences');

let router = express.Router();
router.use(bodyParser.json());


function changeProfile(req, res) {
  let account = req.tokenObj.usr.account
  let idUsr = req.tokenObj.usr._id.$oid
  let query = req.params.query

  let userApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";

  if (utils.checkSuperAccount(account) && idUsr === query) {
    mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  } else {

    utils.Axios('get', userApiUrl)//method, url, data
      .then(function (userApiRes) {
        if (userApiRes.status == 200 && userApiRes.data._returned) {
          let user = userApiRes.data._embedded[0];
          let idUser = user._id.$oid || user._id
          let rhApiUrl = _configs.rh.dataUrl + "/tbUsers/" + query

          if (idUser !== query) {
            mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
            res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
          }

          if (req.body.cur_pwd && utils.comparePassword(req.body.cur_pwd, user.pwd)) {
            req.body.pwd = utils.encryptPassword(req.body.new_pwd)
          }

          req.body.modifiedAt = new Date().getTime();
          req.body.modifiedBy = req.tokenObj.usr.account;

          delete req.body.cur_pwd
          delete req.body.new_pwd
          delete req.body.re_new_pwd
          delete req.body.account
          delete req.body.code

          utils.Axios('patch', rhApiUrl, req.body)
            .then(function (rhApiRes) {
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
        } else {
          mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
          res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
        }
      }).catch(function (err) {
        mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
        res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
      });
  }
}

function update(req, res) {
  req.body.modifiedAt = new Date().getTime();
  req.body.modifiedBy = req.tokenObj.usr.account;
  if (req.body.pwd)
    req.body.pwd = utils.encryptPassword(req.body.pwd)

  let rhApiUrl = _configs.rh.dataUrl + "/tbUsers/" + req.params.query

  delete req.body.code

  utils.Axios('patch', rhApiUrl, req.body)//method, url, data
    .then(function (rhApiRes) {
      mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
      res.status(rhApiRes.status).send(rhApiRes.data);
    }).catch(function (err) {
      try {
        mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
        res.status(rhApiErr.response.status).send(rhApiErr.response.data);
      } catch (e) {
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      }
    })
}

export { changeProfile, update }
