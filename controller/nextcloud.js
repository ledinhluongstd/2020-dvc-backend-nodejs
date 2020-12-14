import express from 'express'
import bodyParser from 'body-parser'
import * as utils from '../common/utils'
import nextClient from '../common/utils/nextcloud'
let htmlToJson = require('html-to-json')

let mwLog = require('../middlewares/log');
let _configs = require('../config/preferences');
let constRes = require('../common/constants/response');

let router = express.Router();
router.use(bodyParser.json());

async function demo(req, res) {
  // let folder = await nextClient.getFolder("/eform");
  // let file = await folder.getFile("1.doc");
  let folder = await nextClient.getFolder(_configs.nextcloud.folder);
  let file = await folder.getFile(_configs.nextcloud.filedemo);
  if (file) {
    mwLog.generate(req, file);
    res.status(200).send(file);
  } else {
    mwLog.generate(req, constRes.RESPONSE_ERR_NOTFOUND);
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  }
}

async function postFile(req, res) {
  let folder = await nextClient.getFolder("/eform");
  let file = await folder.createFile("1243.txt");
  if (file) {
    mwLog.generate(req, file);
    res.status(200).send(file);
  } else {
    mwLog.generate(req, constRes.RESPONSE_ERR_NOTFOUND);
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  }
}

async function getFile(req, res) {
  let file_name = req.params.file_name
  let folder = await nextClient.getFolder("/eform");
  let file = await folder.getFile(file_name);
  if (file) {
    mwLog.generate(req, file);
    res.status(200).send(file);
  } else {
    mwLog.generate(req, constRes.RESPONSE_ERR_NOTFOUND);
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  }
}

async function getRequestToken(req, res) {
  try {
    let html = await utils.Axios2('get', _configs.nextcloud.url)
    let json = await htmlToJson.parse(html.data, {
      head: function (doc) {
        return doc.find('head');
      }
    }).then(function (result) {
      return result.head
    });
    let response = json['0'].attribs['data-requesttoken']
    mwLog.generate(req, { requesttoken: response });
    res.status(200).send({ requesttoken: response });
  } catch (e) {
    mwLog.generate(req, constRes.RESPONSE_ERR_NOTFOUND);
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  }
}


export { demo, postFile, getFile, getRequestToken }