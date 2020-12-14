import jwt from 'jsonwebtoken'
import { Base64 } from 'js-base64';
import { TIME_REFRESH_TOKEN } from '../config/setup';
import * as utils from '../common/utils'
let ObjectID = require('mongodb').ObjectID
let _configs = require('../config/preferences');
let globalConfig = require('../config/preferences');
let constRes = require('../common/constants/response');
let mwLog = require('./log');

let mwSTT = {
  generate: function (payloads) {
    try {
      let rhApiUrl = _configs.rh.dataUrl + '/tbThongKe';
      payloads.createdAt = new Date().getTime();
      payloads.code = new ObjectID().toHexString()
      payloads.isActive = true
      utils.Axios('post', rhApiUrl, payloads)
        .then(function (rhApiRes) {
          // mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
        }).catch(function (rhApiErr) {
          // mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
        })
    } catch (e) {
      console.log(e)
    }
  },
}

module.exports = mwSTT;