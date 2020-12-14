import express from 'express'
import bodyParser from 'body-parser'
import util from 'util'

let _aggr = require('../../model/aggrs/nhomdanhmuc');
let mwLog = require('../../middlewares/log');
let _configs = require('../../config/preferences');
let constRes = require('../../common/constants/response');

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

function test(req, res) {
  mgClient.connect(mgUrl, function (err, client) {
    if (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    } else {
      client.db(_configs.mongodb.db).collection('tbNhomDanhMuc').aggregate(
        _aggr.countDashboard()
      ).toArray().then(function (v) {
        mwLog.generate(req, v);
        res.status(200).send({ size: v.length, data: v });
      }, function (e) {
        mwLog.generate(req, e);
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      })
    }
  })
}


export { test }