import express from 'express'
import bodyParser from 'body-parser'
import * as utils from '../../common/utils'
import { getIsActiveItem } from '../../common/utils/filter';

let ObjectID = require('mongodb').ObjectID
let _configs = require('../../config/preferences');
let constRes = require('../../common/constants/response');
let moduleApi = require('../../common/constants/moduleApi');
let mwLog = require('../../middlewares/log');
let mwSTT = require('../../middlewares/statistics');
let constStatistics = require('../../common/constants/statistics');
let gspUtils = require('../../common/utils/gspUtils');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

async function getTable(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + req.url
  utils.Axios('get', rhApiUrl)//method, url, data
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
async function gsp(req, res) {

  let gspResp = await gspUtils.callGSPService(req.body);
  if (gspResp) {
    res.status(200).send(gspResp);
  } else {
    res.status(400).send();
  }
}

export { getTable, gsp }