import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../../controller/data/importExcel'

let mwJWT = require('../../middlewares/jwt');
let mwLog = require('../../middlewares/log');
let mwJson = require('../../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// router.get('/\*', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.getTable);

router.post('/nhom-danh-muc', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.postNhomDanhMuc);

router.post('/danh-muc', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.postDanhMuc);

// router.put('/:query', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.put);

// router.patch('/:query', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.patch);

// router.delete('/:query', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.deleteTable);

// router.lock('/:query', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.lock);

module.exports = router;