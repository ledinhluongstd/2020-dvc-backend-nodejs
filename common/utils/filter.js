import util from 'util'
import * as utils from './index'
import { regexText } from './regex';

// connectmongo
let mwLog = require('../../middlewares/log');
let _configs = require('../../config/preferences');
let constRes = require('../../common/constants/response');
var mgClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mgUrl = util.format(
  _configs.mongodb.url_format,
  encodeURIComponent(_configs.mongodb.db_usr),
  encodeURIComponent(_configs.mongodb.db_pwd),
  _configs.mongodb.host,
  _configs.mongodb.port
);
var mgUrlNoAuth = util.format(
  _configs.mongodb.url_format_no_auth,
  _configs.mongodb.host_no_auth,
  _configs.mongodb.port
);


function getIsActiveItem(req) {
  if (!!req.tokenObj && !!req.tokenObj.roles && req.tokenObj.roles === _configs.super.roles) {
    return req.url
  } else {
    let query = req.url.replace('/?', '');
    query = new URLSearchParams(query)
    let filter = query.get('filter')
    let count = query.get('count')
    if (!count) return req.url
    if (filter) {
      filter = JSON.parse(filter)
      filter.isActive = true
      query.set('filter', JSON.stringify(filter))
    } else {
      filter = { isActive: true }
      query.set('filter', JSON.stringify(filter))
    }
    query = '/?' + query
    return query
  }
};

async function getDanhSachPhanCapDonVi(req) {
  if (!!req.tokenObj && !!req.tokenObj.roles && req.tokenObj.roles === _configs.super.roles) {
    return req.url
  } else {
    let { account } = req.tokenObj.usr
    let rhApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    let DonVi = await utils.Axios('get', rhApiUrl)
      .then(function (rhApiRes) {
        return rhApiRes.data._embedded[0].DonVi
      }).catch(function (rhApiErr) {
        return null
      })

    let query = req.url.replace('/?', '');
    query = new URLSearchParams(query)
    let filter = query.get('filter')
    let count = query.get('count')
    if (!count) return req.url
    if (filter) {
      filter = JSON.parse(filter)
      filter['isActive'] = true
      filter['codeTree'] = regexText(DonVi.codeTree)
      query.set('filter', JSON.stringify(filter))
    } else {
      filter = { isActive: true, codeTree: regexText(DonVi.codeTree || '') }
      query.set('filter', JSON.stringify(filter))
    }
    query = '/?' + query
    return query
  }
}

async function getDanhSachPhanCapNhomDanhMuc(req) {
  if (!!req.tokenObj && !!req.tokenObj.roles && req.tokenObj.roles === _configs.super.roles) {
    return req.url
  } else {
    let { account } = req.tokenObj.usr
    let rhApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    let DonVi = await utils.Axios('get', rhApiUrl)
      .then(function (rhApiRes) {
        return rhApiRes.data._embedded[0].DonVi
      }).catch(function (rhApiErr) {
        return null
      })

    let query = req.url.replace('/?', '');
    query = new URLSearchParams(query)
    let filter = query.get('filter')
    let count = query.get('count')
    if (!count) return req.url
    if (filter) {
      filter = JSON.parse(filter)
      filter['isActive'] = true
      filter['DonViCha.codeTree'] = regexText(DonVi.codeTree)
      // filter['codeTree'] = regexText(DonVi.codeTree)
      query.set('filter', JSON.stringify(filter))
    } else {
      filter = { isActive: true, 'DonViCha.codeTree': regexText(DonVi.codeTree || '') }
      query.set('filter', JSON.stringify(filter))
    }
    query = '/?' + query
    return query
  }
}

async function getDanhSachPhanCapDanhMuc(req) {
  if (!!req.tokenObj && !!req.tokenObj.roles && req.tokenObj.roles === _configs.super.roles) {
    return req.url
  } else {
    let { account } = req.tokenObj.usr
    let rhApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    let DonVi = await utils.Axios('get', rhApiUrl)
      .then(function (rhApiRes) {
        return rhApiRes.data._embedded[0].DonVi
      }).catch(function (rhApiErr) {
        return null
      })

    let query = req.url.replace('/?', '');
    query = new URLSearchParams(query)
    let filter = query.get('filter')
    let count = query.get('count')
    if (!count) return req.url
    if (filter) {
      filter = JSON.parse(filter)
      filter['isActive'] = true
      filter['DonViCha.codeTree'] = regexText(DonVi.codeTree)
      // filter['codeTree'] = regexText(DonVi.codeTree)
      query.set('filter', JSON.stringify(filter))
    } else {
      filter = { isActive: true, 'DonViCha.codeTree': regexText(DonVi.codeTree || '') }
      query.set('filter', JSON.stringify(filter))
    }
    query = '/?' + query
    return query
  }
}

async function getDanhSachPhanCapLinhVuc(req) {
  if (!!req.tokenObj && !!req.tokenObj.roles && req.tokenObj.roles === _configs.super.roles) {
    return req.url
  } else {
    let { account } = req.tokenObj.usr
    let rhApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    let DonVi = await utils.Axios('get', rhApiUrl)
      .then(function (rhApiRes) {
        return rhApiRes.data._embedded[0].DonVi
      }).catch(function (rhApiErr) {
        return null
      })

    let query = req.url.replace('/?', '');
    query = new URLSearchParams(query)
    let filter = query.get('filter')
    let count = query.get('count')
    if (!count) return req.url
    if (filter) {
      filter = JSON.parse(filter)
      filter['isActive'] = true
      filter['DonViCha.codeTree'] = regexText(DonVi.codeTree)
      // filter['codeTree'] = regexText(DonVi.codeTree)
      query.set('filter', JSON.stringify(filter))
    } else {
      filter = { isActive: true, 'DonViCha.codeTree': regexText(DonVi.codeTree || '') }
      query.set('filter', JSON.stringify(filter))
    }
    query = '/?' + query
    return query
  }
}

async function getDanhSachPhanCapUser(req) {
  if (!!req.tokenObj && !!req.tokenObj.roles && req.tokenObj.roles === _configs.super.roles) {
    return req.url
  } else {
    let { account } = req.tokenObj.usr
    let rhApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    let DonVi = await utils.Axios('get', rhApiUrl)
      .then(function (rhApiRes) {
        return rhApiRes.data._embedded[0].DonVi
      }).catch(function (rhApiErr) {
        return null
      })

    let query = req.url.replace('/?', '');
    query = new URLSearchParams(query)
    let filter = query.get('filter')
    let count = query.get('count')
    if (!count) return req.url
    if (filter) {
      filter = JSON.parse(filter)
      filter['isActive'] = true
      filter['DonVi.codeTree'] = regexText(DonVi.codeTree)
      // filter['codeTree'] = regexText(DonVi.codeTree)
      query.set('filter', JSON.stringify(filter))
    } else {
      filter = { isActive: true, 'DonVi.codeTree': regexText(DonVi.codeTree || '') }
      query.set('filter', JSON.stringify(filter))
    }
    query = '/?' + query
    return query
  }
}

async function updateMulti(table, filter, data) {
  let rhApiUrl = _configs.rh.dataUrl + "/" + table + "/*?filter=" + JSON.stringify(filter);
  let apiRes = await utils.Axios('patch', rhApiUrl, data)
    .then(function (rhApiRes) {
      return true
    }).catch(function (rhApiErr) {
      return false
    })
  return apiRes
}

async function checkIsExisted(table, key, value) {
  let rhApiUrl = _configs.rh.dataUrl + "/" + table + "?filter={" + key + ":'" + value + "'}";
  let apiRes = await utils.Axios('get', rhApiUrl)
    .then(function (rhApiRes) {
      return rhApiRes.data._embedded[0]
    }).catch(function (rhApiErr) {
      return false
    })
  return !!apiRes
}

async function updateMultiItemInArray(table, filter, data) {
  // let rhApiUrl = _configs.rh.dataUrl + "/" + table + "/*?filter=" + JSON.stringify(filter);
  // let apiRes = await utils.Axios('patch', rhApiUrl, data)
  //   .then(function (rhApiRes) {
  //     return true
  //   }).catch(function (rhApiErr) {
  //     return false
  //   })
  // return apiRes

  mgClient.connect(mgUrl, function (err, client) {
    if (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_DATABASE);
      res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
    } else {
      client.db(_configs.mongodb.db).collection(table).update(
        filter,
        {
          "$set": data
        },
        {
          "multi": true
        }
      )
    }
  })

  // db.getCollection('profiles').update(
  //   {
  //     'userId': '4360a380-1540-45d9-b902-200f2d346263',
  //     'skills.name': 'css'
  //   },
  //   {
  //     $set: { 'skills.$.proficiencyLevel': 5 }
  //   },
  //   {
  //     multi: true
  //   }
  // )
}
export {
  getIsActiveItem, getDanhSachPhanCapDonVi, getDanhSachPhanCapNhomDanhMuc, getDanhSachPhanCapDanhMuc,
  getDanhSachPhanCapLinhVuc, getDanhSachPhanCapUser, checkIsExisted, updateMulti, updateMultiItemInArray
}