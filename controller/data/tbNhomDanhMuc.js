// import express from 'express'
// import bodyParser from 'body-parser'
// import * as utils from '../../common/utils'
// import { getIsActiveItem, getDanhSachPhanCapNhomDanhMuc, checkIsExisted, updateMulti } from '../../common/utils/filter';

// let ObjectID = require('mongodb').ObjectID
// let _configs = require('../../config/preferences');
// let constRes = require('../../common/constants/response');
// let moduleApi = require('../../common/constants/moduleApi');
// let mwLog = require('../../middlewares/log');
// let mwSTT = require('../../middlewares/statistics');
// let constStatistics = require('../../common/constants/statistics');

// let router = express.Router();
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());


// function getTable(req, res) {
//   let rhApiUrl = _configs.rh.dataUrl + '/tbNhomDanhMuc' + getIsActiveItem(req);

//   mwSTT.generate({ // lưu thống kê danh mục
//     LoaiThongKe: constStatistics.STATISTICS_TYPE.CATEGORY_SEARCH_STATISTICS
//   })

//   utils.Axios('get', rhApiUrl)//method, url, data
//     .then(function (rhApiRes) {
//       mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
//       res.status(rhApiRes.status).send(rhApiRes.data);
//     }).catch(function (rhApiErr) {
//       try {
//         mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
//         res.status(rhApiErr.response.status).send(rhApiErr.response.data);
//       } catch (e) {
//         res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
//       }
//     })
// }

// async function post(req, res) {
//   //Kiểm tra dữ liệu với Mã đã tồn tại hay chưa
//   let checkIsEx = await checkIsExisted('tbNhomDanhMuc', 'Ma', req.body.Ma)
//   if (checkIsEx) {
//     mwLog.generate(req, { status: constRes.RESPONSE_ERR_CODE_EXITSTED.status, body: constRes.RESPONSE_ERR_CODE_EXITSTED.body });
//     res.status(constRes.RESPONSE_ERR_CODE_EXITSTED.status).send(constRes.RESPONSE_ERR_CODE_EXITSTED.body);
//     return
//   }//Hết kiểm tra
//   req.body.createdAt = new Date().getTime();
//   req.body.createdBy = req.tokenObj.usr.account;
//   req.body.code = new ObjectID().toHexString()
//   req.body.isActive = true
//   if (req.body.NhomDanhMucCha) {
//     req.body.codeTree = `${req.body.NhomDanhMucCha.codeTree || ""}.${req.body.Ma}`
//   } else {
//     req.body.codeTree = req.body.Ma
//   }
//   // return
//   let rhApiUrl = _configs.rh.dataUrl + '/tbNhomDanhMuc' + req.url;
//   utils.Axios('post', rhApiUrl, req.body)//method, url, data
//     .then(function (rhApiRes) {
//       if (rhApiRes.headers.location) {
//         rhApiRes.data = {
//           newId: rhApiRes.headers.location.substr(rhApiRes.headers.location.lastIndexOf('/') + 1)
//         };
//       }
//       mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
//       res.status(rhApiRes.status).send(rhApiRes.data);
//     }).catch(function (rhApiErr) {
//       try {
//         mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
//         res.status(rhApiErr.response.status).send(rhApiErr.response.data);
//       } catch (e) {
//         res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
//       }
//     })
// }

// function put(req, res) {
//   req.body.modifiedAt = new Date().getTime();
//   req.body.modifiedBy = req.tokenObj.usr.account;
//   let rhApiUrl = _configs.rh.dataUrl + '/tbNhomDanhMuc' + req.url;
//   utils.Axios('put', rhApiUrl, req.body)//method, url, data
//     .then(function (rhApiRes) {
//       mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
//       res.status(rhApiRes.status).send(rhApiRes.data);
//     }).catch(function (rhApiErr) {
//       try {
//         mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
//         res.status(rhApiErr.response.status).send(rhApiErr.response.data);
//       } catch (e) {
//         res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
//       }
//     })
// }

// function patch(req, res) {
//   req.body.modifiedAt = new Date().getTime();
//   req.body.modifiedBy = req.tokenObj.usr.account;
//   let rhApiUrl = _configs.rh.dataUrl + '/tbNhomDanhMuc' + req.url;
//   let body = JSON.parse(JSON.stringify(req.body))
//   delete req.body.code
//   utils.Axios('patch', rhApiUrl, req.body)//method, url, data
//     .then(async function (rhApiRes) {
//       //update multi
//       await updateMulti('tbDanhMuc', { 'NhomDanhMuc.code': body.code }, { NhomDanhMuc: body })
//       await updateMulti('tbNhomDanhMuc', { 'NhomDanhMucCha.code': body.code }, { NhomDanhMucCha: body })
//       //hết update multi
//       mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
//       res.status(rhApiRes.status).send(rhApiRes.data);
//     }).catch(function (rhApiErr) {
//       try {
//         mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
//         res.status(rhApiErr.response.status).send(rhApiErr.response.data);
//       } catch (e) {
//         res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
//       }
//     })
// }

// function deleteTable(req, res) {
//   let rhApiUrl = _configs.rh.dataUrl + '/tbNhomDanhMuc' + req.url;
//   utils.Axios('patch', rhApiUrl, { isActive: false, KichHoat: false })//method, url, data
//     .then(function (rhApiRes) {
//       mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
//       res.status(rhApiRes.status).send(rhApiRes.data);
//     }).catch(function (rhApiErr) {
//       try {
//         mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
//         res.status(rhApiErr.response.status).send(rhApiErr.response.data);
//       } catch (e) {
//         res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
//       }
//     })
// }

// function lock(req, res) {
//   let rhApiUrl = _configs.rh.dataUrl + '/tbNhomDanhMuc' + req.url;
//   utils.Axios('get', rhApiUrl)//method, url, data
//     .then(function (rhApiRes) {
//       utils.Axios('patch', rhApiUrl, { isActive: false, KichHoat: false })//method, url, data
//         .then(function (dataApiRes) {
//           mwLog.generate(req, { status: dataApiRes.status, body: dataApiRes.data });
//           res.status(dataApiRes.status).send(dataApiRes.data);
//         }).catch(function (rhApiErr) {
//           try {
//             mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
//             res.status(rhApiErr.response.status).send(rhApiErr.response.data);
//           } catch (e) {
//             res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
//           }
//         })
//     }).catch(function (rhApiErr) {
//       try {
//         mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
//         res.status(rhApiErr.response.status).send(rhApiErr.response.data);
//       } catch (e) {
//         res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
//       }
//     })
// }

// export { getTable, post, patch, put, deleteTable, lock }