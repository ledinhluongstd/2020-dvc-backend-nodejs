import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../controller/data'

let aggrsDanhMucRouter = require('./aggrs/danhmuc');
let aggrsNhomDanhMucRouter = require('./aggrs/nhomdanhmuc');
let aggrsDonViRouter = require('./aggrs/donvi');
let aggrsUserRouter = require('./aggrs/user');
let aggrsThongKeRouter = require('./aggrs/thongke');
let aggrsLinhVucRouter = require('./aggrs/linhvuc');
let aggrsLogDVCRouter = require('./aggrs/logDVC');

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let mwJson = require('../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/danh-muc', aggrsDanhMucRouter);
router.use('/nhom-danh-muc', aggrsNhomDanhMucRouter);
router.use('/don-vi', aggrsDonViRouter);
router.use('/user', aggrsUserRouter);
router.use('/thong-ke', aggrsThongKeRouter);
router.use('/linh-vuc', aggrsLinhVucRouter);
router.use('/log-dvc', aggrsLogDVCRouter);

module.exports = router;