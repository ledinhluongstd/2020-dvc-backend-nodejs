import express from 'express'
import bodyParser from 'body-parser'
import util from 'util'

let _aggr = require('../../model/aggrs/thongke');
let mwLog = require('../../middlewares/log');
let _configs = require('../../config/preferences');
let constRes = require('../../common/constants/response');
let constStatistics = require('../../common/constants/statistics');

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

function countCounterStatistics(req, res) {
  let { TuNgay, ToiNgay } = req.query
  if (!TuNgay || !ToiNgay) {
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
    return
  }
  let LoaiThongKe = constStatistics.STATISTICS_TYPE.COUNTER_STATISTICS
  mgClient.connect(mgUrl, function (err, client) {
    if (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    } else {
      client.db(_configs.mongodb.db).collection('tbThongKe').aggregate(
        _aggr.countCounterStatistics(LoaiThongKe, TuNgay, ToiNgay)
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

function countCategorySearchStatistics(req, res) {
  let { TuNgay, ToiNgay } = req.query
  if (!TuNgay || !ToiNgay) {
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
    return
  }
  let LoaiThongKe = constStatistics.STATISTICS_TYPE.CATEGORY_SEARCH_STATISTICS
  mgClient.connect(mgUrl, function (err, client) {
    if (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    } else {
      client.db(_configs.mongodb.db).collection('tbThongKe').aggregate(
        _aggr.countCategorySearchStatistics(LoaiThongKe, TuNgay, ToiNgay)
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

function countPublicCategorySearchStatistics(req, res) {
  let { TuNgay, ToiNgay } = req.query
  if (!TuNgay || !ToiNgay) {
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
    return
  }
  let LoaiThongKe = constStatistics.STATISTICS_TYPE.PUBLIC_CATEGORY_SEARCH_STATISTICS
  mgClient.connect(mgUrl, function (err, client) {
    if (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    } else {
      client.db(_configs.mongodb.db).collection('tbThongKe').aggregate(
        _aggr.countPublicCategorySearchStatistics(LoaiThongKe, TuNgay, ToiNgay)
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

export { countCounterStatistics, countCategorySearchStatistics, countPublicCategorySearchStatistics }