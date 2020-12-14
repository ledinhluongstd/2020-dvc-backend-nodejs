import express from 'express'
import bodyParser from 'body-parser';
import * as controller from '../controller/users'

let registerRouter = require('./register');

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let mwJson = require('../middlewares/json');

let router = express.Router();
router.use(bodyParser.json());

router.use('/register', registerRouter);

router.patch('/change-profile/:query', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.changeProfile);

router.patch('/update/:query', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.update);

module.exports = router;
