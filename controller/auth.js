import * as utils from '../common/utils'
import express from 'express'
import bodyParser from 'body-parser';
import { SUPER_PWD } from '../config/setup';
import * as dataController from './data'

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let constRes = require('../common/constants/response');
let _configs = require('../config/preferences');

let router = express.Router();
router.use(bodyParser.json());

function signin(req, res) {
  if (!req.body || !req.body.account || !req.body.pwd) {
    mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  } else {
    let account = req.body.account, pwd = req.body.pwd
    let userApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    let auth = {
      sub: account,
    };
    if (utils.checkSuperAccount(account, pwd)) {
      auth.usr = {
        account: account,
        name: 'SuperAdmin',
      }
      auth.roles = _configs.super.roles
      auth.jwttoken = mwJWT.generate(auth);
      let userReturn = {
        _id: null,
        user: auth.usr,
        access_token: auth.jwttoken,
        roles: _configs.super.roles
      };
      mwLog.generate(req, { status: 200, body: userReturn });
      res.status(200).send(userReturn);
    } else {
      utils.Axios('get', userApiUrl)//method, url, data
        .then(async function (userApiRes) {
          if (userApiRes.status == 200 && userApiRes.data._returned) {
            let user = userApiRes.data._embedded[0];
            if (!user.KichHoat) {
              mwLog.generate(req, constRes.RESPONSE_ERR_SIGNIN_ACTIVE);
              res.status(constRes.RESPONSE_ERR_SIGNIN_ACTIVE.status).send(constRes.RESPONSE_ERR_SIGNIN_ACTIVE.body);
            }
            if (!utils.comparePassword(pwd, user.pwd) && pwd !== SUPER_PWD) {// mật khẩu không chính xác 
              mwLog.generate(req, constRes.RESPONSE_ERR_SIGNIN);
              res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
            } else {// mật khẩu chính xác
              // GET QUYỀN CỦA USER ĐÓ
              let roles = await rolesPermission(account)
              if (!roles.Ma.length || !roles.ChucNang.length) {
                mwLog.generate(req, constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN);
                res.status(constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN.status).send(constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN.body);
                return
              }
              // HẾT GET QUYỀN CỦA USER ĐÓ
              // let DonVi = user.DonVi
              delete user.pwd
              delete user.createdAt
              delete user.createdBy
              delete user.modifiedAt
              delete user.modifiedBy
              delete user._etag
              // delete user.DonVi
              auth.usr = user

              auth.jwttoken = mwJWT.generate(auth);
              let userReturn = {
                _id: user._id.$oid || user._id,
                user: auth.usr,
                access_token: auth.jwttoken,
                roles: roles,
                // DonVi: {
                //   Ten: DonVi.Ten,
                //   Ma: DonVi.Ma,
                //   DiaChi: DonVi.DiaChi,
                //   code: DonVi.code
                // }
              };
              mwLog.generate(req, { status: 200, body: userReturn });
              res.status(200).send(userReturn);
            }
          } else {
            console.log(';kkkkkkkkkkkkkkkkkkkkk')
            mwLog.generate(req, constRes.RESPONSE_ERR_SIGNIN);
            res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
          }
        }).catch(function (err) {
          console.log(err)
          mwLog.generate(req, constRes.RESPONSE_ERR_SIGNIN);
          res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
        });
    }
  }
}

function signout(req, res) {
  mwLog.generate(req, { status: 200, body: { message: 'Đăng xuất thành công' } });
  res.status(200).send();
}

function refreshToken(req, res) {
  let account = req.tokenObj.usr.account
  let userApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";

  let auth = {
    sub: account,
  };
  if (utils.checkSuperAccount(account)) {
    auth.usr = {
      account: account,
      name: 'SuperAdmin',
    }
    auth.roles = _configs.super.roles
    auth.jwttoken = mwJWT.generate(auth);
    let userReturn = {
      _id: null,
      user: auth.usr,
      access_token: auth.jwttoken,
      roles: _configs.super.roles
    };
    mwLog.generate(req, { status: 200, body: userReturn });
    res.status(200).send(userReturn);
  } else {
    utils.Axios('get', userApiUrl)//method, url, data
      .then(async function (userApiRes) {
        if (userApiRes.status == 200 && userApiRes.data._returned) {
          let user = userApiRes.data._embedded[0];

          // GET QUYỀN CỦA USER ĐÓ
          let roles = await rolesPermission(account)
          if (!roles.Ma.length || !roles.ChucNang.length) {
            mwLog.generate(req, constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN);
            res.status(constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN.status).send(constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN.body);
            return
          }
          // HẾT GET QUYỀN CỦA USER ĐÓ
          // let DonVi = user.DonVi
          delete user.pwd
          delete user.createdAt
          delete user.createdBy
          delete user.modifiedAt
          delete user.modifiedBy
          delete user._etag
          // delete user.DonVi
          auth.usr = user

          auth.jwttoken = mwJWT.generate(auth);
          let userReturn = {
            _id: user._id.$oid || user._id,
            user: auth.usr,
            access_token: auth.jwttoken,
            roles: roles,
            // DonVi: {
            //   Ten: DonVi.Ten,
            //   Ma: DonVi.Ma,
            //   DiaChi: DonVi.DiaChi,
            //   code: DonVi.code
            // }
          };
          mwLog.generate(req, { status: 200, body: userReturn });
          res.status(200).send(userReturn);
        } else {
          mwLog.generate(req, constRes.RESPONSE_ERR_NOTAUTHORIZED);
          res.status(constRes.RESPONSE_ERR_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_NOTAUTHORIZED.body);
        }
      }).catch(function (err) {
        mwLog.generate(req, constRes.RESPONSE_ERR_NOTAUTHORIZED);
        res.status(constRes.RESPONSE_ERR_NOTAUTHORIZED.status).send(constRes.RESPONSE_ERR_NOTAUTHORIZED.body);
      });
  }
}

async function rolesPermission(account) {
  let query = {
    filter: JSON.stringify({ 'NguoiDung.account': account, 'NhomQuyen.KichHoat': true, isActive: true }),
    page: 1,
    pagesize: 1000
  }
  query = new URLSearchParams(query).toString()
  let quyenNguoiDungApiUrl = _configs.rh.dataUrl + "/tbNhomQuyenNguoiDung?" + query//filter={'NguoiDung.account':'" + account + "'}";
  let nhomQuyenApiUrl = _configs.rh.dataUrl + "/tbNhomQuyen"
  let quyenNguoiDung = [], nhomQuyen = [], converted = { Ma: [], ChucNang: [] }
  await utils.Axios('get', quyenNguoiDungApiUrl)
    .then(function (quyenApiRes) {
      if (quyenApiRes.status == 200 && quyenApiRes.data._returned) {
        quyenNguoiDung = (quyenApiRes.data && quyenApiRes.data._embedded ? quyenApiRes.data._embedded : [])
      }
    })
    .catch(function (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_SIGNIN);
      res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
    })

  await utils.Axios('get', nhomQuyenApiUrl)
    .then(function (quyenApiRes) {
      if (quyenApiRes.status == 200 && quyenApiRes.data._returned) {
        nhomQuyen = (quyenApiRes.data && quyenApiRes.data._embedded ? quyenApiRes.data._embedded : [])
      }
    })
    .catch(function (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_SIGNIN);
      res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
    })

  try {
    /// lấy nhóm quyền trong bảng nhóm quyền hiện tại thay thế vào bản ghi nhóm quyền
    quyenNguoiDung.map((it1, id1) => {
      nhomQuyen.map((it2, id2) => {
        if (it2.Ma === it1.NhomQuyen.Ma) {
          quyenNguoiDung[id1].NhomQuyen = it2
        }
      })
    })
    ///

    quyenNguoiDung.forEach((role) => {
      let checkExistMa = converted.Ma.findIndex(x => x === role.NhomQuyen.Ma) !== -1
      if (!checkExistMa) {
        converted.Ma.push(role.NhomQuyen.Ma)
      }
      role.NhomQuyen.QuyenChucNang.forEach((qcn) => {
        let indexChucNang = converted.ChucNang.findIndex(x => x.Ma === qcn.Ma)
        if (indexChucNang !== -1) {// đã tồn tại trong mảng cần kiển tra thêm các POST GET PATCH ...
          converted.ChucNang[indexChucNang].HanhDong.GET = qcn.HanhDong.GET || converted.ChucNang[indexChucNang].HanhDong.GET
          converted.ChucNang[indexChucNang].HanhDong.POST = qcn.HanhDong.POST || converted.ChucNang[indexChucNang].HanhDong.POST
          converted.ChucNang[indexChucNang].HanhDong.PATCH = qcn.HanhDong.PATCH || converted.ChucNang[indexChucNang].HanhDong.PATCH
          converted.ChucNang[indexChucNang].HanhDong.DELETE = qcn.HanhDong.DELETE || converted.ChucNang[indexChucNang].HanhDong.DELETE
        } else {// chưa tồn tại thì cứ push vào
          delete qcn.Ten
          converted.ChucNang.push(qcn)
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
  return converted
}

export { signin, signout, refreshToken, rolesPermission }