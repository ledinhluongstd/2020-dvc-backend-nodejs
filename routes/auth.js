import express from 'express'
import bodyParser from 'body-parser';
import * as controller from '../controller/auth'

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');

let router = express.Router();
router.use(bodyParser.json());

router.post('/signin', mwLog.generateLogApi, controller.signin);

router.get('/signout', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.signout);

router.get('/refresh-token', mwJWT.decodeAuthorization, mwLog.generateLogApi, controller.refreshToken);

module.exports = router;