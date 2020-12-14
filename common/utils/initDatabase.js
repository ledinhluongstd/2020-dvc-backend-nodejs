import bcrypt from 'bcryptjs';
import _configs from '../../config/preferences'
import * as utils from './index'

let { COLLECTIONS } = require('../constants/listCollection');

function initDatabase() {
  Object.keys(COLLECTIONS).map(async function (key, index) {
    let isExisted = await checkCltIsExisted(key)
    if (isExisted) {// nếu đã tồn tại bảng dữ liệu thì kiểm tra dữ liệu trong bảng đã tồn tại chưa và thêm chúng

    } else {
      let ctl = await insertClt(key)
      if (ctl && COLLECTIONS[key].length) {
        COLLECTIONS[key].map(async (item, index) => {
          await insertDocuments(item, key)
        })
      }
    }
  });
}

async function checkCltIsExisted(collectionName) {
  let rhApiUrl = _configs.rh.dataUrl + '/' + collectionName
  let boolean = await utils.Axios('get', rhApiUrl)//method, url, data
    .then(function (rhApiRes) {
      return true
    }).catch(function (rhApiErr) {
      return false
    })
  return boolean
}

async function insertClt(collectionName) {
  let rhApiUrl = _configs.rh.dataUrl + '/' + collectionName
  let boolean = await utils.Axios('put', rhApiUrl)//method, url, data
    .then(function (rhApiRes) {
      return true
    }).catch(function (rhApiErr) {
      return false
    })
  return boolean
}

async function insertDocuments(document, collectionName) {
  let rhApiUrl = _configs.rh.dataUrl + '/' + collectionName
  let boolean = await utils.Axios('post', rhApiUrl, document)//method, url, data
    .then(function (rhApiRes) {
      return true
    }).catch(function (rhApiErr) {
      return false
    })
  return boolean
}

export { initDatabase }