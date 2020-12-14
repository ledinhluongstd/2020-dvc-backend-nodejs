import express from 'express'
import multer from 'multer'
import path from 'path'
import * as controller from '../controller/media'
import { MAX_VIDEOS, MAX_IMAGES, MAX_DOCUMENTS } from '../config/setup'

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let router = express.Router();
let multerFields = [{ name: 'videos', maxCount: MAX_VIDEOS }, { name: 'images', maxCount: MAX_IMAGES }, { name: 'documents', maxCount: MAX_DOCUMENTS }];
let multerSettings = {
   storage: multer.diskStorage({
      destination: function (req, file, cb) {
         cb(null, path.join(__dirname, '../', 'media_files/'));
      },
      // filename: function (req, file, cb) {
      //    cb(null, req.timestamp + '_' + file.originalname);
      // },
      filename: function (req, file, cb) {
         var filename = file.originalname.replace(/[^a-zA-Z0-9-._ ]/g, '');
         cb(null, req.timestamp + '_' + filename);
       }
   }),
   fileFilter: function (req, file, cb) {
      cb(null, true);
   },
}
let multerUploader = multer(multerSettings).fields(multerFields);

router.post('/upload', //mwJWT.checkApiAuthorization, mwLog.generateLogApi, 
multerUploader, controller.upload);

router.get('/download', mwLog.generateLogApi, controller.download)

router.get('/file', mwLog.generateLogApi, controller.file);

router.get('/video', mwLog.generateLogApi, controller.video);

module.exports = router;