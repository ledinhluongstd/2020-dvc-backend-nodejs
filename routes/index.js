import express from 'express'
import moment from 'moment'
import bodyParser from 'body-parser'

let usersRouter = require('./users');
let authRouter = require('./auth');
let dataRouter = require('./data');
let mediaRouter = require('./media');
let statisticRouter = require('./statistic');
let generalRouter = require('./general');
let logwinstonRouter = require('./logwinston');
let gmapRouter = require('./gmap');
let nextcloudRouter = require('./nextcloud');
let publicRouter = require('./public');
let aggrsRouter = require('./aggrs');
let gspRouter = require('./gsp');
let dvcRouter = require('./dvc');

let mwDecodeApi = require('../middlewares/apiDecoder');
let mwJson = require('../middlewares/json');

let router = express.Router();
router.use(bodyParser.json());

router.use(mwDecodeApi.decodeApi, function (req, res, next) {
  next()
});

router.use('/auth', authRouter);
router.use('/users', mwJson.checkJson, usersRouter);
router.use('/data', dataRouter);
router.use('/statistic', statisticRouter);
router.use('/general', generalRouter);
router.use('/media', mediaRouter);
router.use('/logwinston', logwinstonRouter);
router.use('/gmap', gmapRouter);
router.use('/nextcloud', nextcloudRouter);
// THỐNG KÊ AGGRS
router.use('/aggrs', aggrsRouter);
// DỊCH VỤ CHO BÊN THỨ 3
router.use('/public', publicRouter);
// DỊCH VỤ CUNG CẤP TỪ KHO CSDL
router.use('/gsp', gspRouter);
// DỊCH VỤ CÔNG
router.use('/dvc', dvcRouter);

// // demo mongo connect
// let mongoRouter = require('./mongo');
// router.use('/mongo', mongoRouter);


module.exports = router;
