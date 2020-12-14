import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../controller/general'

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');

let router = express.Router();
router.use(bodyParser.json());

//mwJWT.checkApiAuthorization, mwLog.generateLogApi,
router.get('/menu', controller.menu);
router.get('/nhom-quyen', controller.nhomQuyen);
router.get('/danh-muc-ung-dung', controller.danhMucUngDung);


module.exports = router;
