import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../controller/gmap'

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');

let router = express.Router();
router.use(bodyParser.json());

router.get('/\*', mwJWT.checkApiAuthorization, mwLog.generateLogApi,controller.gmap);

module.exports = router;