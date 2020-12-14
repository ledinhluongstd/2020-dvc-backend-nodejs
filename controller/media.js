import fs from 'fs'
import path from 'path'

let mwLog = require('../middlewares/log');
let _configs = require('../config/preferences');
let constRes = require('../common/constants/response');

function upload(req, res) {
  let media_files = {
    videos: [],
    images: [],
    documents: [],
  };
  let types = ['videos', 'images', 'documents'];
  console.log(req.files)
  types.forEach(type => {
    if (req.files[type] && req.files[type].length) {
      for (let i = 0; i < req.files[type].length; i++) {
        let f = req.files[type][i];
        let fObj = {
          createdAt: new Date().getTime(),
          createdBy: req.tokenObj ? req.tokenObj.usr.account : 'test-post-man',
          originalname: f.originalname,
          filename: f.filename,
          type: f.mimetype,
          size: f.size,
          nextid: 228,
          nextfolder: _configs.nextcloud.folder
        };
        let fileCategory = f.mimetype.startsWith('image') ? 'images' : (f.mimetype.startsWith('video') ? 'videos' : 'documents');
        media_files[fileCategory].push(fObj);
      }
    }
  });
  mwLog.generate(req, { status: 200, body: { media_files } });
  res.status(200).send(media_files);
}

function download(req, res) {
  let filepath = _configs.multer.storage_path
    + req.query.q;
  res.sendFile(filepath, { root: path.join(__dirname, '../') }, function (err) {
    if (err) {
      res.status(404).send();
    }
  });
}

function file(req, res) {
  let filepath = 'media_files/'
    + req.query.q;
  res.sendFile(filepath, { root: path.join(__dirname, '../') }, function (err) {
    if (err) {
      res.status(404).send();
    }
  });
}

function video(req, res) {
  var mimetype = req.query.m;
  if (!mimetype) {
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
    return
  }
  var path = 'media_files/' + req.query.q;
  var stat = fs.statSync(path);
  var fileSize = stat.size;
  var range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1

    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': mimetype
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': mimetype
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
}

export { upload, download, file, video }