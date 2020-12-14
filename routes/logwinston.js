import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../controller/logwinston'

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');

let router = express.Router();
router.use(bodyParser.json());

router.get('/demo', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.demo);

router.get('/', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.get);

module.exports = router;