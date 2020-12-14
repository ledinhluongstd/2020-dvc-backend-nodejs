import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../../controller/aggrs/thongke'

let mwJWT = require('../../middlewares/jwt');
let mwLog = require('../../middlewares/log');
let mwJson = require('../../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/luot-truy-cap\*', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
  controller.countCounterStatistics); // thống kê số lượt truy cập website

router.get('/tim-kiem-danh-muc\*', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
  controller.countCategorySearchStatistics); // thống kê số lượt truy cập website

router.get('/khach-tim-kiem-danh-muc\*', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
  controller.countPublicCategorySearchStatistics); // thống kê số lượt truy cập website

// router.post('/', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.post);

// router.put('/:query', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.put);

// router.patch('/:query', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.patch);

// router.delete('/:query', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.deleteTable);

// router.lock('/:query', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.lock);

module.exports = router;