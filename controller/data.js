import express from 'express'
import bodyParser from 'body-parser'
import * as utils from '../common/utils'

let ObjectID = require('mongodb').ObjectID
let _configs = require('../config/preferences');
let constRes = require('../common/constants/response');
let moduleApi = require('../common/constants/moduleApi');
let mwLog = require('../middlewares/log');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function get(req, res) {
  let account = req.tokenObj.usr.account
  // if (!utils.checkSuperAccount(account)) {// chỉ SuperAccount
  //   mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
  //   res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  //   return
  // }
  let rhApiRes = {
    data: {
      _embedded: moduleApi.CONTROLER,
      _id: _configs.mongodb.db,
      _size: moduleApi.CONTROLER.length,
      _total_pages: 1,
      _returned: moduleApi.CONTROLER.length
    },
    status: 200
  }
  mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
  res.status(rhApiRes.status).send(rhApiRes.data);
}

export { get }