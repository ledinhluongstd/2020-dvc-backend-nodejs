import express from 'express'
import bodyParser from 'body-parser'

let DVCRouter = require('./dvc/index');

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let mwJson = require('../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/', DVCRouter);

module.exports = router;