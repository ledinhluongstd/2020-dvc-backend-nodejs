import express from 'express'
import bodyParser from 'body-parser'

let GSPRouter = require('./gsp/index');

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let mwJson = require('../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/', GSPRouter);

module.exports = router;