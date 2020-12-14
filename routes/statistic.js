import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../controller/statistic'

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');

let router = express.Router();
router.use(bodyParser.json());

router.get('/bao-cao-mau', mwJWT.checkReportAuthorization, mwLog.generateLogApi, controller.baoCaoMau);

router.get('/report/:file_name', mwLog.generateLogApi, controller.reportFileName);

router.get('/design/:file_name', mwLog.generateLogApi, controller.designFileName);

module.exports = router;