import express from 'express'
import bodyParser from 'body-parser'
import * as utils from '../../common/utils'
import { getIsActiveItem } from '../../common/utils/filter';
import { isObjEmpty } from '../../common/utils/object';

let ObjectID = require('mongodb').ObjectID
let _configs = require('../../config/preferences');
let constRes = require('../../common/constants/response');
let moduleApi = require('../../common/constants/moduleApi');
let mwLog = require('../../middlewares/log');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function postNhomDanhMuc(req, res) {
  req.body.createdAt = new Date().getTime();
  req.body.createdBy = req.tokenObj.usr.account;
  req.body.code = new ObjectID().toHexString()
  req.body.isActive = true
  let rhApiUrl = _configs.rh.dataUrl + '/tbNhomDanhMuc' + req.url;
  utils.Axios('post', rhApiUrl, req.body)//method, url, data
    .then(function (rhApiRes) {
      if (rhApiRes.headers.location) {
        rhApiRes.data = {
          newId: rhApiRes.headers.location.substr(rhApiRes.headers.location.lastIndexOf('/') + 1)
        };
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

function postDanhMuc(req, res) {
  if (isObjEmpty(req.body)) {
    mwLog.generate(req, { status: constRes.RESPONSE_ERR_FORMAT_JSON.body, body: constRes.RESPONSE_ERR_FORMAT_JSON.body });
    res.status(constRes.RESPONSE_ERR_FORMAT_JSON.body).send(constRes.RESPONSE_ERR_FORMAT_JSON.body);
    return
  }
  try {
    req.body.map((item, index) => {
      req.body[index].createdAt = new Date().getTime();
      req.body[index].createdBy = req.tokenObj.usr.account;
      req.body[index].code = new ObjectID().toHexString()
      req.body[index].isActive = true
      req.body[index].PheDuyet = 1
    })

    let rhApiUrl = _configs.rh.dataUrl + '/tbDanhMuc'
    utils.Axios('post', rhApiUrl, req.body)//method, url, data
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
  } catch (e) {
    console.log(e)
  }
}

export { postDanhMuc, postNhomDanhMuc }