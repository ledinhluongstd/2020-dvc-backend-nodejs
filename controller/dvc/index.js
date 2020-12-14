import express from 'express'
import bodyParser from 'body-parser'
import * as utils from '../../common/utils'
import { getIsActiveItem } from '../../common/utils/filter';
import hat from '../../common/utils/hat'

let ObjectID = require('mongodb').ObjectID
let _configs = require('../../config/preferences');
let constRes = require('../../common/constants/response');
let mwLog = require('../../middlewares/log');
let mwJWT = require('../../middlewares/jwt');
let dvcLog = require('../../middlewares/logDVC');
let services = require('../../common/constants/servicesDVC');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

async function getAllServices(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + '/tbDVCBackend' + req.url.replace("/all-services", "")
  utils.Axios('get', rhApiUrl)//method, url, data
    .then(function (rhApiRes) {
      mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
      res.status(rhApiRes.status).send(rhApiRes.data);
    }).catch(function (rhApiErr) {
      try {
        mwLog.generate(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
        res.status(rhApiErr.response.status).send(rhApiErr.response.data);
      } catch (e) {
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      }
    })
}

async function generateApiToken(req, res) {
  let rhApiRes = {
    data: {
      key: hat()
    },
    status: 200
  }
  mwLog.generate(req, { status: rhApiRes.status, body: rhApiRes.data });
  res.status(rhApiRes.status).send(rhApiRes.data);
}

async function getToken(req, res) {
  try {
    let apiToken = req.apiToken
    let rhApiUrl = _configs.rh.dataUrl + "/tbCauHinhKetNoi?filter={ KichHoat: true, Ma:'" + apiToken + "'}";
    let cauHinhKetNoiRes = await utils.Axios('get', rhApiUrl)//method, url, data
      .then(function (nfApiRes) {
        return nfApiRes
      }).catch(function (nfApiErr) {
        try {
          dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
          res.status(nfApiErr.response.status).send(nfApiErr.response.data);
        } catch (e) {
          res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        }
      })
    let cauHinhKetNoi = cauHinhKetNoiRes.data._embedded[0]
    if (!cauHinhKetNoi) { // không có hoặc không tồn tại
      res.status(constRes.RESPONSE_ERR_SETTING_NO_ACTIVE.status).send(constRes.RESPONSE_ERR_SETTING_NO_ACTIVE.body);
      return
    } else {
      if (!cauHinhKetNoi.DonVi.KichHoat) { // đơn vị không kích hoạt
        res.status(constRes.RESPONSE_ERR_UNIT_NO_ACTIVE.status).send(constRes.RESPONSE_ERR_UNIT_NO_ACTIVE.body);
        return
      }
      if (!cauHinhKetNoi.DichVuUngDung.KichHoat) { // dịch vụ không kích hoạt
        res.status(constRes.RESPONSE_ERR_CSDL_HTTT_NO_ACTIVE.status).send(constRes.RESPONSE_ERR_CSDL_HTTT_NO_ACTIVE.body);
        return
      }
      let auth = {
        DVUD: {// dịch vụ ứng dụng
          Ma: cauHinhKetNoi.DichVuUngDung.Ma,
          code: cauHinhKetNoi.DichVuUngDung.code
        },
        DV: { // đơn vị
          Ma: cauHinhKetNoi.DonVi.Ma,
          code: cauHinhKetNoi.DonVi.code
        },
        DVKN: [] // dịch vụ kết nối
      }
      cauHinhKetNoi.DichVuUngDung.DichVuCungCap.map((item, index) => {
        if (item.KichHoat)
          auth.DVKN.push(
            {
              Ma: item.Ma,
              Url: item.Url.Ma,
              code: item.code
            }
          )
      })
      let jwttoken = {
        access_token: mwJWT.generate(auth),
        token_type: 'Bearer',
        expires_in: 3600
      }
      res.status(cauHinhKetNoiRes.status).send(jwttoken);
    }
  } catch (e) {
    res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
  }
}

async function checkOfficialProgram(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + "/tbCauHinhHeThong?filter={Ma:'KET_NOI_CHINH_THUC'}";
  let ttdn = await utils.Axios('get', rhApiUrl)
    .then(function (rhApiRes) {
      if (rhApiRes.status == 200 && rhApiRes.data._returned) {
        let check = rhApiRes.data._embedded[0];
        return check.GiaTri
      } else {
        return false
      }
    }).catch(function (nfApiErr) {
      return false
    })
  return ttdn
}

async function one(req, res) {
  let { mscd } = req.body
  if (!mscd) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        // let rhApiUrl = services.API['15.0']
        // let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
        //   .then(function (nfApiRes) {
        //     return nfApiRes
        //   }).catch(function (nfApiErr) {
        //     try {
        //       dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
        //       res.status(nfApiErr.response.status).send(nfApiErr.response.data);
        //     } catch (e) {
        //       res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        //     }
        //   })
        let response = {
          "MESSAGE": "Hệ thống thông tin công dân đang chạy thử nghiệm vui lòng chuyển qua chế độ chạy thử nghiệm",// HỌ TÊN
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      } else { // chạy demo
        let response = {
          "HO_TEN_CONG_DAN": "NGUYỄN VĂN LINH",// HỌ TÊN
          "MSCD": "038092556541",
          "CHUC_VU": "NHÀ BÁO"
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function two(req, res) {
  let { mscd } = req.body
  if (!mscd) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        // let rhApiUrl = services.API['15.0']
        // let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
        //   .then(function (nfApiRes) {
        //     return nfApiRes
        //   }).catch(function (nfApiErr) {
        //     try {
        //       dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
        //       res.status(nfApiErr.response.status).send(nfApiErr.response.data);
        //     } catch (e) {
        //       res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        //     }
        //   })
        let response = {
          "MESSAGE": "Hệ thống thông tin công dân đang chạy thử nghiệm vui lòng chuyển qua chế độ chạy thử nghiệm",// HỌ TÊN
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      } else { // chạy demo
        let response = {
          "HO_TEN_CONG_DAN": "NGUYỄN VĂN LINH",// HỌ TÊN
          "MSCD": "038092556541",
          "CHUC_VU": "NHÀ BÁO",
          "CO_QUAN": { "NAME": "ĐÀI TRUYỀN HÌNH ABC", "ID": "DTH_ABC" },
          "QUOC_TICH": { "NAME": "VIỆT NAM", "ID": "VIET_NAM" },
          "SO_HO_CHIEU": "SHC_ABCXYZ",
          "NAM_SINH": "1979"
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function three(req, res) {
  let { mscd } = req.body
  if (!mscd) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        // let rhApiUrl = services.API['15.0']
        // let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
        //   .then(function (nfApiRes) {
        //     return nfApiRes
        //   }).catch(function (nfApiErr) {
        //     try {
        //       dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
        //       res.status(nfApiErr.response.status).send(nfApiErr.response.data);
        //     } catch (e) {
        //       res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        //     }
        //   })
        let response = {
          "MESSAGE": "Hệ thống thông tin công dân đang chạy thử nghiệm vui lòng chuyển qua chế độ chạy thử nghiệm",// HỌ TÊN
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      } else { // chạy demo
        let response = {
          "HO_TEN_CONG_DAN": "NGUYỄN VĂN LINH",
          "MSCD": "038092556541",
          "CHUC_VU": "NHÀ BÁO",
          "CO_QUAN": { "NAME": "ĐÀI TRUYỀN HÌNH ABC", "ID": "DTH_ABC" },
          "QUOC_TICH": { "NAME": "VIỆT NAM", "ID": "VIET_NAM" },
          "SO_HO_CHIEU": "SHC_ABCXYZ",
          "NAM_SINH": "1979"
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function four(req, res) {
  let { mscd, msdn } = req.body
  if (!mscd || !msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        // let rhApiUrl = services.API['15.0']
        // let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
        //   .then(function (nfApiRes) {
        //     return nfApiRes
        //   }).catch(function (nfApiErr) {
        //     try {
        //       dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
        //       res.status(nfApiErr.response.status).send(nfApiErr.response.data);
        //     } catch (e) {
        //       res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        //     }
        //   })
        let response = {
          "MESSAGE": "Hệ thống thông tin đang chạy thử nghiệm vui lòng chuyển qua chế độ chạy thử nghiệm",// HỌ TÊN
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      } else { // chạy demo
        let response = {
          "DU_LIEU_CONG_DAN": {
            "HO_TEN_CONG_DAN": "NGUYỄN VĂN LINH",// HỌ TÊN
            "MSCD": "038092556541",
            "CHUC_VU": "NHÀ BÁO",
            "CO_QUAN": { "NAME": "ĐÀI TRUYỀN HÌNH ABC", "ID": "DTH_ABC" },
            "QUOC_TICH": { "NAME": "VIỆT NAM", "ID": "VIET_NAM" },
            "SO_HO_CHIEU": "SHC_ABCXYZ",
            "NAM_SINH": "1979",
          },
          "DU_LIEU_DOANH_NGHIEP": {
            "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
            "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
              "CityID": 81,
              "CityName": "Hà Nội",
              "DistrictID": 1044,
              "DistrictName": "Quận Hà Đông",
              "WardID": 12215,
              "WardName": "Phường Mộ Lao",
              "StreetID": null,
              "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
              "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
            },
            "PHONE": "0245684525",// Điện thoại
            "FAX": "04.39876181",// Fax
            "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
            "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số

            "NHA_CUNG_CAP_DV_KET_NOI": "VIETTEL",
            "DIA_CHI_DAT_MAY_CHU": "HÀ NỘI"
          }
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function five(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['5.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function six(req, res) {
  let { mscd } = req.body
  if (!mscd) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        // let rhApiUrl = services.API['15.0']
        // let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
        //   .then(function (nfApiRes) {
        //     return nfApiRes
        //   }).catch(function (nfApiErr) {
        //     try {
        //       dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
        //       res.status(nfApiErr.response.status).send(nfApiErr.response.data);
        //     } catch (e) {
        //       res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        //     }
        //   })
        let response = {
          "MESSAGE": "Hệ thống thông tin đang chạy thử nghiệm vui lòng chuyển qua chế độ chạy thử nghiệm",// HỌ TÊN
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      } else { // chạy demo
        let response = {
          "HO_TEN_CONG_DAN": "NGUYỄN VĂN LINH",// HỌ TÊN
          "MSCD": "038092556541",
          "GIOI_TINH": "NAM",
          "NGAY_SINH": "20/11/1979",
          "DAN_TOC": "KINH",
          "TON_GIAO": "KHÔNG",
          "QUE_QUAN": "ĐÔNG SƠN - NAM ĐỊNH",
          "HKTT": "ĐÔNG SƠN - NAM ĐỊNH",
          "NGAY_VAO_DANG": "19/10/2000",
          "NGHE_NGHIEP": "BÁC SỸ",
          "NOI_DK_KCB": "Y TẾ ĐÔNG SƠN - NAM ĐỊNH",
          "QUOC_TICH": { "NAME": "VIỆT NAM", "ID": "VIET_NAM" },
          "SO_HO_CHIEU": "SHC_ABCXYZ",
          "NAM_SINH": "1979",
          "THOI_GIAN_TU_TRAN": "",
          "THOI_GIAN_THAM_GIA_DAN_CONG": ""
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function seven(req, res) {
  let { mscd } = req.body
  if (!mscd) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        // let rhApiUrl = services.API['15.0']
        // let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
        //   .then(function (nfApiRes) {
        //     return nfApiRes
        //   }).catch(function (nfApiErr) {
        //     try {
        //       dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
        //       res.status(nfApiErr.response.status).send(nfApiErr.response.data);
        //     } catch (e) {
        //       res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        //     }
        //   })
        let response = {
          "MESSAGE": "Hệ thống thông tin đang chạy thử nghiệm vui lòng chuyển qua chế độ chạy thử nghiệm",// HỌ TÊN
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      } else { // chạy demo
        let response = {
          "HO_TEN_CONG_DAN": "NGUYỄN VĂN LINH",// HỌ TÊN
          "BI_DANH": "NGUYỄN VĂN LINH",
          "MSCD": "038092556541",
          "DOI_TUONG": "QUÂN NHÂN",
          "GIOI_TINH": "NAM",
          "NGAY_SINH": "20/11/1979",
          "DAN_TOC": "KINH",
          "TON_GIAO": "KHÔNG",
          "QUE_QUAN": "ĐÔNG SƠN - NAM ĐỊNH",
          "HKTT": "ĐÔNG SƠN - NAM ĐỊNH",
          "NGAY_VAO_DANG": "19/10/2000",
          "NGAY_NHAP_NGU": "19/10/2000",
          "NGAY_XUAT_NGU": "",
          "NGAY_TAI_NGU": "",
          "NGHE_NGHIEP": "CƠ KHÍ",
          "NOI_DK_KCB": "Y TẾ ĐÔNG SƠN - NAM ĐỊNH",
          "QUOC_TICH": { "NAME": "VIỆT NAM", "ID": "VIET_NAM" },
          "SO_HO_CHIEU": "SHC_ABCXYZ",
          "NAM_SINH": "1979",
          "CAC_CHE_DO_DANG_HUONG": [{
            "TEN": "BẢO HIỂM XÃ HỘI",
            "MA": "BHXH"
          }],
          "CAC_GIAY_TO_CON_GIU": [
            {
              "TEN": "BẢO HIỂM XÃ HỘI",
              "MA": "BHXH"
            }
          ]
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function eight(req, res) {
  let { mscd } = req.body
  if (!mscd) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        // let rhApiUrl = services.API['15.0']
        // let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
        //   .then(function (nfApiRes) {
        //     return nfApiRes
        //   }).catch(function (nfApiErr) {
        //     try {
        //       dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
        //       res.status(nfApiErr.response.status).send(nfApiErr.response.data);
        //     } catch (e) {
        //       res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        //     }
        //   })
        let response = {
          "MESSAGE": "Hệ thống thông tin đang chạy thử nghiệm vui lòng chuyển qua chế độ chạy thử nghiệm",// HỌ TÊN
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      } else { // chạy demo
        let response = {
          "HO_TEN_CONG_DAN": "NGUYỄN VĂN LINH",// HỌ TÊN
          "BI_DANH": "NGUYỄN VĂN LINH",
          "MSCD": "038092556541",
          "DOI_TUONG": "QUÂN NHÂN",
          "GIOI_TINH": "NAM",
          "NGAY_SINH": "20/11/1979",
          "DAN_TOC": "KINH",
          "TON_GIAO": "KHÔNG",
          "QUE_QUAN": "ĐÔNG SƠN - NAM ĐỊNH",
          "HKTT": "ĐÔNG SƠN - NAM ĐỊNH",
          "NGAY_VAO_DANG": "19/10/2000",
          "NGAY_NHAP_NGU": "19/10/2000",
          "NGAY_XUAT_NGU": "",
          "NGAY_TAI_NGU": "",
          "NGHE_NGHIEP": "CƠ KHÍ",
          "NOI_DK_KCB": "Y TẾ ĐÔNG SƠN - NAM ĐỊNH",
          "QUOC_TICH": { "NAME": "VIỆT NAM", "ID": "VIET_NAM" },
          "SO_HO_CHIEU": "SHC_ABCXYZ",
          "NAM_SINH": "1979",
          "CAC_CHE_DO_DANG_HUONG": [{
            "TEN": "BẢO HIỂM XÃ HỘI",
            "MA": "BHXH"
          }],
          "CAC_GIAY_TO_CON_GIU": [
            {
              "TEN": "BẢO HIỂM XÃ HỘI",
              "MA": "BHXH"
            }
          ]
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function nine(req, res) {
  let { mscd } = req.body
  if (!mscd) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        // let rhApiUrl = services.API['15.0']
        // let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
        //   .then(function (nfApiRes) {
        //     return nfApiRes
        //   }).catch(function (nfApiErr) {
        //     try {
        //       dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
        //       res.status(nfApiErr.response.status).send(nfApiErr.response.data);
        //     } catch (e) {
        //       res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        //     }
        //   })
        let response = {
          "MESSAGE": "Hệ thống thông tin đang chạy thử nghiệm vui lòng chuyển qua chế độ chạy thử nghiệm",// HỌ TÊN
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      } else { // chạy demo
        let response = {
          "TT_CONG_DAN_CHE_DO_MOT_LAN": {
            "HO_TEN_CONG_DAN": "NGUYỄN VĂN LINH",// HỌ TÊN
            "BI_DANH": "NGUYỄN VĂN LINH",
            "MSCD": "038092556541",
            "DOI_TUONG": "QUÂN NHÂN",
            "GIOI_TINH": "NAM",
            "NGAY_SINH": "20/11/1979",
            "DAN_TOC": "KINH",
            "TON_GIAO": "KHÔNG",
            "QUE_QUAN": "ĐÔNG SƠN - NAM ĐỊNH",
            "HKTT": "ĐÔNG SƠN - NAM ĐỊNH",
            "NGAY_VAO_DANG": "19/10/2000",
            "NGAY_NHAP_NGU": "19/10/2000",
            "DIA_BAN_CHIEN_DAU": "HƯƠNG KHÊ - HÀ TĨNH",
            "NGAY_XUAT_NGU": "",
            "NGAY_TAI_NGU": "",
            "NGHE_NGHIEP": "CƠ KHÍ",
            "NOI_DK_KCB": "Y TẾ ĐÔNG SƠN - NAM ĐỊNH",
            "QUOC_TICH": { "NAME": "VIỆT NAM", "ID": "VIET_NAM" },
            "SO_HO_CHIEU": "SHC_ABCXYZ",
            "NAM_SINH": "1979",
            "CAC_CHE_DO_DANG_HUONG": [{
              "TEN": "BẢO HIỂM XÃ HỘI",
              "MA": "BHXH"
            }],
            "CAC_GIAY_TO_CON_GIU": [
              {
                "TEN": "BẢO HIỂM XÃ HỘI",
                "MA": "BHXH"
              }
            ]
          },
          "GIAY_UY_QUYEN": {
            "HO_TEN_CONG_DAN": "NGUYỄN VĂN CHIẾN",// HỌ TÊN//Tên
            "NGAY_SINH": "20/11/1999",// Ngày tháng năm sinh
            "HO_KHAU": "ĐÔNG SƠN - NAM ĐỊNH",// Hộ khẩu
            "NGHE_NGHIEP": "CƠ KHÍ",// Nghề nghiệp
            "QUAN_HE_VOI_DOI_TUONG": "CON",// Quan hệ với đối tượng
            "HO_TEN_NGUOI_UY_QUYEN": "NGUYỄN VĂN LINH",
          }
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function ten(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['10.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "NGUOI_DAI_DIEN": "NGUYỄN VĂN LINH",
          "MSCD": "1542546854",
          "CHUC_VU": "GIÁM ĐỐC",
          "GIOI_TINH": "NAM",
          "QUOC_TICH": "VIỆT NAM"
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function eleven(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['11.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "NGUOI_DAI_DIEN": "NGUYỄN VĂN LINH",
          "MSCD": "1542546854",
          "CHUC_VU": "GIÁM ĐỐC",
          "GIOI_TINH": "NAM",
          "QUOC_TICH": "VIỆT NAM"
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function twelve(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['12.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "NGUOI_DAI_DIEN": "NGUYỄN VĂN LINH",
          "MSCD": "1542546854",
          "CHUC_VU": "GIÁM ĐỐC",
          "GIOI_TINH": "NAM",
          "QUOC_TICH": "VIỆT NAM"
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function thirteen(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['13.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "NGUOI_DAI_DIEN": "NGUYỄN VĂN LINH",
          "MSCD": "1542546854",
          "CHUC_VU": "GIÁM ĐỐC",
          "GIOI_TINH": "NAM",
          "QUOC_TICH": "VIỆT NAM"
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function fourteen(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['14.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM", // Tên doanh nghiệp đề nghị cấp phép (viết bằng tiếng Việt)
          "NAME_F": "VIET NAM OPEN SOURCE DEVELOPMENT JOINT STOCK COMPANY",// Tên doanh nghiệp viết bằng tiếng nước ngoài (nếu có)
          "SHORT_NAME": "VINADES., JSC",// Tên doanh nghiệp viết tắt (nếu có)
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "EMAIL": "congtyvinades@vinades.com",// Email
          "WEBSITE": "https://www.vinades.vn/",// Website
          "GIAY_CHUNG_NHAN": "0103043946"// Giấy chứng nhận đăng ký doanh nghiệp/Giấy chứng nhận đăng ký đầu tư/giấy tờ khác có giá trị tương đương
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function fifteen(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['15.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "DANH_SACH_CAC_VAT_LIEU_NO_CN": [
            { TEN: 'Thuốc nổ Amonit (AĐ1)' },
            { TEN: 'Thuốc nổ nhũ tương (NT14 - WR)' },
            { TEN: 'Thuốc nổ nhũ tương NT-13' },
            { TEN: 'Thuốc nổ nhũ tương P113' },
            { TEN: 'Thuốc nổ nhũ tương EE-31' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 05' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 06' },
          ]// Danh sách và số lượng các chủng loại vật liệu nổ công nghiệp
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function sixteen(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['16.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "DANH_SACH_CAC_VAT_LIEU_NO_CN": [
            { TEN: 'Thuốc nổ Amonit (AĐ1)' },
            { TEN: 'Thuốc nổ nhũ tương (NT14 - WR)' },
            { TEN: 'Thuốc nổ nhũ tương NT-13' },
            { TEN: 'Thuốc nổ nhũ tương P113' },
            { TEN: 'Thuốc nổ nhũ tương EE-31' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 05' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 06' },
          ]// Danh sách và số lượng các chủng loại vật liệu nổ công nghiệp
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function seventeen(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['17.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "DANH_SACH_CAC_VAT_LIEU_NO_CN": [
            { TEN: 'Thuốc nổ Amonit (AĐ1)' },
            { TEN: 'Thuốc nổ nhũ tương (NT14 - WR)' },
            { TEN: 'Thuốc nổ nhũ tương NT-13' },
            { TEN: 'Thuốc nổ nhũ tương P113' },
            { TEN: 'Thuốc nổ nhũ tương EE-31' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 05' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 06' },
          ]// Danh sách và số lượng các chủng loại vật liệu nổ công nghiệp
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function eighteen(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['18.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "DANH_SACH_CAC_VAT_LIEU_NO_CN": [
            { TEN: 'Thuốc nổ Amonit (AĐ1)' },
            { TEN: 'Thuốc nổ nhũ tương (NT14 - WR)' },
            { TEN: 'Thuốc nổ nhũ tương NT-13' },
            { TEN: 'Thuốc nổ nhũ tương P113' },
            { TEN: 'Thuốc nổ nhũ tương EE-31' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 05' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 06' },
          ]// Danh sách và số lượng các chủng loại vật liệu nổ công nghiệp
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function nineteen(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['19.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "DANH_SACH_CAC_VAT_LIEU_NO_CN": [
            { TEN: 'Thuốc nổ Amonit (AĐ1)' },
            { TEN: 'Thuốc nổ nhũ tương (NT14 - WR)' },
            { TEN: 'Thuốc nổ nhũ tương NT-13' },
            { TEN: 'Thuốc nổ nhũ tương P113' },
            { TEN: 'Thuốc nổ nhũ tương EE-31' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 05' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 06' },
          ]// Danh sách và số lượng các chủng loại vật liệu nổ công nghiệp
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

async function twenty(req, res) {
  let { msdn } = req.body
  if (!msdn) {
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  } else {
    try {
      let check = await checkOfficialProgram()
      if (check) { // chạy chính thức
        let rhApiUrl = services.API['20.0']
        let ttdn = await utils.Axios('post', rhApiUrl, { msdn: msdn })
          .then(function (nfApiRes) {
            return nfApiRes
          }).catch(function (nfApiErr) {
            try {
              dvcLog.generate(req, { status: nfApiErr.response.status, body: nfApiErr.response.data });
              res.status(nfApiErr.response.status).send(nfApiErr.response.data);
              return null
            } catch (e) {
              dvcLog.generate(req, { status: constRes.RESPONSE_ERR_DATABASE.status, body: constRes.RESPONSE_ERR_DATABASE.body });
              res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
              return null
            }
          })
        if (!ttdn) return
        dvcLog.generate(req, { status: 200, body: ttdn.data });
        res.status(200).send(ttdn.data);
      } else { // chạy demo
        let response = {
          "NAME": "CÔNG TY CỔ PHẦN PHÁT TRIỂN NGUỒN MỞ VIỆT NAM",// Tên cơ quan, đơn vị, tổ chức, doanh nghiệp đề nghị cấp Giấy phép sử dụng vật liệu nổ công nghiệp
          "DIA_CHI_TRU_SO_CHINH": {// Địa chỉ trụ sở chính
            "CityID": 81,
            "CityName": "Hà Nội",
            "DistrictID": 1044,
            "DistrictName": "Quận Hà Đông",
            "WardID": 12215,
            "WardName": "Phường Mộ Lao",
            "StreetID": null,
            "StreetNumber": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen",
            "AddressFullText": "Số nhà A8, tập thể nhà máy Dệt, Ao Sen, Phường Mộ Lao, Quận Hà Đông, Thành phố Hà Nội, Việt Nam"
          },
          "PHONE": "0245684525",// Điện thoại
          "FAX": "04.39876181",// Fax
          "GIAY_PHEP_THANH_LAP": "GPTLS0991191",// Quyết định hoặc giấy phép thành lập số
          "GIAY_CHUNG_NHAN_DANG_KY_DOANH_NGHIEP": "GCNDKDNS0010101",// Giấy chứng nhận đăng ký doanh nghiệp số
          "DANH_SACH_CAC_VAT_LIEU_NO_CN": [
            { TEN: 'Thuốc nổ Amonit (AĐ1)' },
            { TEN: 'Thuốc nổ nhũ tương (NT14 - WR)' },
            { TEN: 'Thuốc nổ nhũ tương NT-13' },
            { TEN: 'Thuốc nổ nhũ tương P113' },
            { TEN: 'Thuốc nổ nhũ tương EE-31' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 05' },
            { TEN: 'Thuốc nổ nhũ tương rời NTR 06' },
          ]// Danh sách và số lượng các chủng loại vật liệu nổ công nghiệp
        }
        dvcLog.generate(req, { status: 200, body: response });
        res.status(200).send(response);
      }
    } catch (e) {
      console.log(e)
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    }
  }
}

export {
  getAllServices, generateApiToken, getToken,
  one, two, three, four, five, six, seven, eight, nine, ten,
  eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty
}