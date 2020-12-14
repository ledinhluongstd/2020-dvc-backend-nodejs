import express from 'express'
import bodyParser from 'body-parser'
import util from 'util'

let _aggr = require('../model/aggrs/test');
let mwLog = require('../middlewares/log');
let _configs = require('../config/preferences');
let constRes = require('../common/constants/response');

// connectmongo
var mgClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mgUrl = util.format(
  _configs.mongodb.url_format,
  encodeURIComponent(_configs.mongodb.db_usr),
  encodeURIComponent(_configs.mongodb.db_pwd),
  _configs.mongodb.host,
  _configs.mongodb.port
);
var mgUrlNoAuth = util.format(
  _configs.mongodb.url_format_no_auth,
  _configs.mongodb.host_no_auth,
  _configs.mongodb.port
);

let router = express.Router();
router.use(bodyParser.json());

function demo(req, res) {
  if (!req.params.account) {
    mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  }
  else {
    mgClient.connect(mgUrl, function (err, client) {
      if (err) {
        mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      } else {
        var cltAccounts = client.db(_configs.mongodb.db).collection('tbUsers');
        cltAccounts.findOne({ account: req.params.account }, function (cltAccErr, cltAccRes) {
          client.close();
          if (cltAccErr) {
            mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
            res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
          } else {
            if (!cltAccRes || !Object.keys(cltAccRes).length) {
              var result = {
                status: 200,
                body: {
                  account_existed: false,
                  message: 'Tài khoản chưa tồn tại'
                }
              }
              mwLog.generate(req, result);
              res.status(result.status).send(result.body);
            } else {
              var result = {
                status: 200,
                body: cltAccRes
              }
              mwLog.generate(req, result);
              res.status(result.status).send(result.body);
            }
          }
        });
      }
    })
  }
}

function test(req, res) {
  // if (!req.params.account) {
  //   mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
  //   res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  // }
  // else {
  mgClient.connect(mgUrl, function (err, client) {
    if (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    } else {
      var userid = new ObjectID("59ea1178e7309c1230ab157a"); // admin
      client.db(_configs.mongodb.db).collection('test').aggregate(
        _aggr.aggrCountByDay()
        // _aggr.aggrA(1487546349000, 1)
        // [
        // { "$match": { "ThoiGian": { $gt: 1487546349000 } } },
        // { "$sort": { "ThoiGian": 1 } },
        // { "$match": { "_id": userid } },
        // { "$match": { "_id": { $ne: userid } } },
        // { "$unwind": "$friends" },
        // { "$match": { "isActive": true } }
        // ]
      ).toArray().then(function (v) {
        // for (let j = 0; j < v.length; j++) v[j].ThoiGian = timestamp2DateString(v[j].ThoiGian);
        mwLog.generate(req, v);
        res.status(200).send({ size: v.length, data: v });
      }, function (e) {
        mwLog.generate(req, e);
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      })
    }
  })
  // }
}


export { demo, test }