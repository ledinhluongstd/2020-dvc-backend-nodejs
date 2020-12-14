import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../../controller/aggrs/logDVC'

let mwJWT = require('../../middlewares/jwt');
let mwLog = require('../../middlewares/log');
let mwJson = require('../../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/thong-ke-theo-thoi-gian', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
  controller.countSuccessOrErrorByTime);

router.get('/thong-ke-dich-vu-theo-thoi-gian', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
  controller.statisticalSuccessOrErrorServiceByTime);

router.get('/thong-ke-don-vi-theo-thoi-gian', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
  controller.statisticalSuccessOrErrorUnitByTime);

router.get('/thong-ke-ung-dung-theo-thoi-gian', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
  controller.statisticalSuccessOrErrorDVUngDungByTime);

router.get('/top-don-vi-thanh-cong', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
  controller.countTopSuccessUnit);

router.get('/top-dich-vu-thanh-cong', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
  controller.countTopSuccessSerrvice);

module.exports = router;