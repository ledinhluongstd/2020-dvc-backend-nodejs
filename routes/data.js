import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../controller/data'

// let tbChucNangRouter = require('./data/tbChucNang');
// let tbDanhMucRouter = require('./data/tbDanhMuc');
// let tbDanhSachDemoRouter = require('./data/tbDanhSachDemo');
// let tbDonViHanhChinhRouter = require('./data/tbDonViHanhChinh');
// let tbEformRouter = require('./data/tbEform');
// let tbLinhVucRouter = require('./data/tbLinhVuc');
// let tbNhomQuyenChucNangRouter = require('./data/tbNhomQuyenChucNang');
// let tbNhomDanhMucRouter = require('./data/tbNhomDanhMuc');
// let tbDMDCQGRouter = require('./data/tbDMDCQG');
// let tbThongTinEformRouter = require('./data/tbThongTinEform');
// let tbThuocTinhDanhMucRouter = require('./data/tbThuocTinhDanhMuc');
let tbDanhMucUngDungRouter = require('./data/tbDanhMucUngDung');
let tbDonViRouter = require('./data/tbDonVi');
let tbLogRouter = require('./data/tbLog');
let tbLogApiRouter = require('./data/tbLogApi');
let tbLogDVCRouter = require('./data/tbLogDVC');
let tbMenuRouter = require('./data/tbMenu');
let tbNhomQuyenRouter = require('./data/tbNhomQuyen');
let tbNhomQuyenNguoiDungRouter = require('./data/tbNhomQuyenNguoiDung');
let tbThongTinUngDungRouter = require('./data/tbThongTinUngDung');
let tbUsersRouter = require('./data/tbUsers');
let tbYKienDongGopRouter = require('./data/tbYKienDongGop');
let tbThongKeRouter = require('./data/tbThongKe');
let tbDVCRouter = require('./data/tbDVC');
let tbUngDungRouter = require('./data/tbUngDung');
let tbUngDungDVCRouter = require('./data/tbUngDungDVC');
let tbCauHinhKetNoiRouter = require('./data/tbCauHinhKetNoi');
let tbCauHinhHeThongRouter = require('./data/tbCauHinhHeThong');

let importExcelRouter = require('./data/importExcel');

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let mwJson = require('../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// router.use('/tbChucNang', tbChucNangRouter);
// router.use('/tbDanhMuc', tbDanhMucRouter);
// router.use('/tbDanhSachDemo', tbDanhSachDemoRouter);
// router.use('/tbDonViHanhChinh', tbDonViHanhChinhRouter);
// router.use('/tbEform', tbEformRouter);
// router.use('/tbNhomQuyenChucNang', tbNhomQuyenChucNangRouter);
// router.use('/tbLinhVuc', tbLinhVucRouter);
// router.use('/tbNhomDanhMuc', tbNhomDanhMucRouter);
// router.use('/tbDMDCQG', tbDMDCQGRouter);
// router.use('/tbThuocTinhDanhMuc', tbThuocTinhDanhMucRouter);
// router.use('/tbThongTinEform', tbThongTinEformRouter);
router.use('/tbDanhMucUngDung', tbDanhMucUngDungRouter);
router.use('/tbDonVi', tbDonViRouter);
router.use('/tbLog', tbLogRouter);
router.use('/tbLogApi', tbLogApiRouter);
router.use('/tbLogDVC', tbLogDVCRouter);
router.use('/tbMenu', tbMenuRouter);
router.use('/tbNhomQuyen', tbNhomQuyenRouter);
router.use('/tbNhomQuyenNguoiDung', tbNhomQuyenNguoiDungRouter);
router.use('/tbThongTinUngDung', tbThongTinUngDungRouter);
router.use('/tbUsers', tbUsersRouter);
router.use('/tbYKienDongGop', tbYKienDongGopRouter);
router.use('/tbThongKe', tbThongKeRouter);
router.use('/tbDVC', tbDVCRouter);
router.use('/tbUngDung', tbUngDungRouter);
// router.use('/tbUngDungDVC', tbUngDungDVCRouter);
router.use('/tbCauHinhKetNoi', tbCauHinhKetNoiRouter);
router.use('/tbCauHinhHeThong', tbCauHinhHeThongRouter);

router.use('/import-excel', importExcelRouter);

router.get('/', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.get);

// router.get('/:clt\*', mwJWT.checkApiAuthorization, mwLog.generateLogApi,controller.getTable);

// router.post('/:clt', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.post);

// router.put('/:clt/:query', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.put);

// router.patch('/:clt/:query', mwJson.checkJson, mwJWT.checkApiAuthorization, mwLog.generateLogApi,controller.patch);

// router.delete('/:clt/:query', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.deleteTable);

// router.lock('/:clt/:query', mwJWT.checkApiAuthorization, mwLog.generateLogApi, controller.lock);

module.exports = router;