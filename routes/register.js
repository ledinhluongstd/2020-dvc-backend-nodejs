import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../controller/register'

let mwLog = require('../middlewares/log');
let mwJWT = require('../middlewares/jwt');

let router = express.Router();

router.use(bodyParser.json());

router.post('/check-account', mwLog.generateLogApi, controller.checkAccount);

router.post('/create', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.create);

router.post('/get-otp', mwLog.generateLogApi, controller.getOtp);

router.post('/verify-otp', mwLog.generateLogApi, controller.verifyOtp);

module.exports = router;