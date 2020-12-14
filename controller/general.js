import express from 'express'
import bodyParser from 'body-parser'
import * as utils from '../common/utils'

let mwLog = require('../middlewares/log');
let _configs = require('../config/preferences');
let constRes = require('../common/constants/response');

let router = express.Router();
router.use(bodyParser.json());

function menu(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + '/tbMenu'
  console.log(rhApiUrl)
  utils.Axios('get', rhApiUrl)
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
}

function nhomQuyen(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + '/tbNhomQuyen'
  utils.Axios('get', rhApiUrl)
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
}

function danhMucUngDung(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + '/tbDanhMucUngDung'
  utils.Axios('get', rhApiUrl)
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
}

export { menu, nhomQuyen, danhMucUngDung }