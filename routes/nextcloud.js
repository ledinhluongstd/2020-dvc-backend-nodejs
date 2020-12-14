import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../controller/nextcloud'

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');

let router = express.Router();
router.use(bodyParser.json());

router.route('/')
  .post(//mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
    controller.postFile)

router.route('/demo')
  .get(//mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
    controller.demo)

router.route('/request-token')
  .get(//mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
    controller.getRequestToken)

router.route('/:file_name')
  .get(//mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
    controller.getFile)



module.exports = router;