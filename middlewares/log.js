import axios from 'axios'
import * as svCommon from '../common/utils/token'
import logWinston from './logWinston';

// const constRes = require('../common/constants/response');
const globalConfig = require('../config/preferences');

const mwLog = {
   generate: function (req, res) {
      let logObj = {
         user: {
            account: req.tokenObj && req.tokenObj.sub ? req.tokenObj.sub : '',
            ip: req.ip,
         },
         request: {
            method: req.method,
            url: req.url,
            originalUrl: req.originalUrl,
            timestamp: req.timestamp,
            headers: req.headers,
            cookies: req.cookies ? req.cookies : null,
            body: req.body ? req.body : null
         },
         response: {
            status: res.status ? res.status : null,
            message: res.message ? res.message : null,
            headers: res.headers ? res.headers : null,
            body: res.body ? res.body : null,
            cookies: res.cookies ? res.cookies : null,
            timestamp: Date.now()
         },
         isActive: true,
         createdAt: Date.now()
      };
      logObj.total_time = logObj.response.timestamp - logObj.request.timestamp;

      let rhLogUrl = globalConfig.rh.dataUrl + '/tbLogs';
      axios.post(rhLogUrl, logObj, {
         headers: {
            'Authorization': 'Basic ' + svCommon.getAccessToken(),
            'Content-Type': 'application/json',
            'Accept-Charset': 'UTF-8'
         }
      }).then(function (rhLogRes) {
      }).catch(function (rhLogErr) {
      });

      //logwinston
      // logWinston.response(logObj)
      //end logwinston

   },

   generateLogApi: function (req, res, next) {
      let rhLogUrl = globalConfig.rh.dataUrl + '/tbLogApi';
      let logObj = {
         user: {
            account: req.tokenObj && req.tokenObj.sub ? req.tokenObj.sub : '',
            ip: req.ip,
         },
         request: {
            method: req.method,
            url: req.url,
            originalUrl: req.originalUrl,
            timestamp: req.timestamp,
            headers: req.headers,
            cookies: req.cookies ? req.cookies : null,
            body: req.body ? req.body : null,
            type: "LOG_API"
         },
         isActive: true,
         createdAt: Date.now()
      };

      axios.post(rhLogUrl, logObj, {
         headers: {
            'Authorization': 'Basic ' + svCommon.getAccessToken(),
            'Content-Type': 'application/json',
            'Accept-Charset': 'UTF-8'
         }
      }).then(function (rhLogRes) {
      }).catch(function (rhLogErr) {
      });
      next()
   },
   generateLogDMDCQGApi: function (req, res, next) {
      let rhLogUrl = globalConfig.rh.dataUrl + '/tbLogApi';
      let logObj = {
         user: {
            account: req.tokenObj && req.tokenObj.sub ? req.tokenObj.sub : '',
            ip: req.ip,
         },
         request: {
            method: req.method,
            url: req.url,
            originalUrl: req.originalUrl,
            timestamp: req.timestamp,
            headers: req.headers,
            cookies: req.cookies ? req.cookies : null,
            body: req.body ? req.body : null,
            type: "LOG_DMDCQG"
         },
         isActive: true,
         createdAt: Date.now()
      };

      axios.post(rhLogUrl, logObj, {
         headers: {
            'Authorization': 'Basic ' + svCommon.getAccessToken(),
            'Content-Type': 'application/json',
            'Accept-Charset': 'UTF-8'
         }
      }).then(function (rhLogRes) {
      }).catch(function (rhLogErr) {
      });
      next()
   }
}

module.exports = mwLog;