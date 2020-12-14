import express from 'express'
import bodyParser from 'body-parser'
import * as utils from '../common/utils'

let mwLog = require('../middlewares/log');
let _configs = require('../config/preferences');
let constRes = require('../common/constants/response');

let router = express.Router();
router.use(bodyParser.json());

function gmap(req, res) {
  let gmapApiUrl = _configs.gmap.url + req.url + `&key=${_configs.gmap.key}`;
  utils.Axios2('get', gmapApiUrl)//method, url, data
    .then(function (gmapApiRes) {
      mwLog.generate(req, { status: gmapApiRes.status, body: gmapApiRes.data });
      res.status(gmapApiRes.status).send(gmapApiRes.data);
    }).catch(function (rhApiErr) {
      try {
        mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
        res.status(rhApiErr.response.status).send(rhApiErr.response.data);
      } catch (e) {
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      }
    })
}

export { gmap }