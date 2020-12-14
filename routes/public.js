import express from 'express'
import bodyParser from 'body-parser'

let DanhMucRouter = require('./public/DanhMuc');
let LoaiDanhMucRouter = require('./public/LoaiDanhMuc');
let NhomDanhMucRouter = require('./public/NhomDanhMuc');
let ThuocTinhDanhMucRouter = require('./public/ThuocTinhDanhMuc');
let GSPRouter = require('./public/GSP');
let LinhVucRouter = require('./public/LinhVuc');

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let mwJson = require('../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/danh-muc', DanhMucRouter);
router.use('/loai-danh-muc', LoaiDanhMucRouter);
router.use('/nhom-danh-muc', NhomDanhMucRouter);
router.use('/thuoc-tinh-danh-muc', ThuocTinhDanhMucRouter);
router.use('/gsp', GSPRouter);
router.use('/linh-vuc', LinhVucRouter);

module.exports = router;