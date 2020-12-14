import express from 'express'
import bodyParser from 'body-parser'
import path from 'path';

let mwLog = require('../middlewares/log');
let constRes = require('../common/constants/response');

const baocaomau = {
  master: {
    KinhGui: "LÊ ĐÌNH LƯƠNG",
    ChiTiet1: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    ChiTiet2: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",

  },
  details: [
    { Ten: 'Lương', Tuoi: 30, ChucDanh: 'DEV' },
    { Ten: 'Thực', Tuoi: 26, ChucDanh: 'DEV' },
    { Ten: 'Thành', Tuoi: 26, ChucDanh: 'DEV' },
    { Ten: 'Nam', Tuoi: 26, ChucDanh: 'DEV' },
    { Ten: 'Đăng', Tuoi: 26, ChucDanh: 'DEV' },
    { Ten: 'Quân', Tuoi: 26, ChucDanh: 'DEV' },
    { Ten: 'Đại', Tuoi: 26, ChucDanh: 'DEV' },
  ]
}

let router = express.Router();
router.use(bodyParser.json());

function baoCaoMau(req, res){
  res.status(200).send(baocaomau);
}

function reportFileName(req, res){
  try {
    return res.sendFile(path.join(__dirname, '../report_files', req.params.file_name))
  } catch (err) {
    mwLog.generate(req, constRes.RESPONSE_ERR_NOTFOUND);
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  }
}

function designFileName(req, res){
  try {
    return res.sendFile(path.join(__dirname, '../report_files', req.params.file_name))
  } catch (err) {
    mwLog.generate(req, constRes.RESPONSE_ERR_NOTFOUND);
    res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
  }
}

export {designFileName, reportFileName, baoCaoMau}