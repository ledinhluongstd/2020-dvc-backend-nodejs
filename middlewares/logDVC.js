import axios from 'axios'
import * as svCommon from '../common/utils/token'
import * as utils from '../common/utils'
import { regexText } from '../common/utils/regex';

// const constRes = require('../common/constants/response');
const globalConfig = require('../config/preferences');
let _configs = require('../config/preferences');

const dvcLog = {
  generate: async function (req, res) {
    if (!req.tokenObj) return // không lưu log khi kiểm thử
    // let dvkn = await 
    let dvknApiUrl = _configs.rh.dataUrl + "/tbDVC?filter={'Url.Ma':'" + req.originalUrl + "'}";
    let dvkn = await utils.Axios('get', dvknApiUrl)
      .then(function (dvknApiRes) {
        if (dvknApiRes.status == 200 && dvknApiRes.data._returned) {
          let dvknResponse = (dvknApiRes.data && dvknApiRes.data._embedded ? dvknApiRes.data._embedded[0] : null)
          return dvknResponse
        }
      })
      .catch(function (err) {
        return null
      })

    // let unit = await 
    let unitApiUrl = _configs.rh.dataUrl + "/tbDonVi?filter={code:'" + req.tokenObj.DV.code + "'}";
    let unit = await utils.Axios('get', unitApiUrl)
      .then(function (unitApiRes) {
        if (unitApiRes.status == 200 && unitApiRes.data._returned) {
          let unitResponse = (unitApiRes.data && unitApiRes.data._embedded ? unitApiRes.data._embedded[0] : null)
          return unitResponse
        }
      })
      .catch(function (err) {
        return null
      })

    // let dvud= await
    let dvudApiUrl = _configs.rh.dataUrl + "/tbUngDung?filter={code:'" + req.tokenObj.DVUD.code + "'}";
    let dvud = await utils.Axios('get', dvudApiUrl)
      .then(function (dvudApiRes) {
        if (dvudApiRes.status == 200 && dvudApiRes.data._returned) {
          let dvudResponse = (dvudApiRes.data && dvudApiRes.data._embedded ? dvudApiRes.data._embedded[0] : null)
          delete dvudResponse.DichVuCungCap
          return dvudResponse
        }
      })
      .catch(function (err) {
        return null
      })

    let logObj = {
      unit: unit, // thông tin đơn vị
      ip: req.ip, // địa chỉ ip
      dvud: dvud,// thông  tin csdl/httt (ứng dụng cung cấp)
      service: { // thông tin dịch vụ được gọi
        Url: req.originalUrl,
        dvkn: dvkn,
      },
      request: {
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        timestamp: req.timestamp,
        headers: req.headers,
        cookies: req.cookies ? req.cookies : null,
        body: req.body ? req.body : null,
        // data: req
      },
      response: {
        status: res.status ? res.status : null,
        message: res.message ? res.message : null,
        headers: res.headers ? res.headers : null,
        body: res.body ? res.body : null,
        cookies: res.cookies ? res.cookies : null,
        timestamp: Date.now(),
        // data: res
      },
      isActive: true,
      createdAt: Date.now()
    };
    logObj.total_time = logObj.response.timestamp - logObj.request.timestamp;
    let rhLogUrl = globalConfig.rh.dataUrl + '/tbLogDVC';
    axios.post(rhLogUrl, logObj, {
      headers: {
        'Authorization': 'Basic ' + svCommon.getAccessToken(),
        'Content-Type': 'application/json',
        'Accept-Charset': 'UTF-8'
      }
    }).then(function (rhLogRes) {
    }).catch(function (rhLogErr) {
    });
  }
}

module.exports = dvcLog;