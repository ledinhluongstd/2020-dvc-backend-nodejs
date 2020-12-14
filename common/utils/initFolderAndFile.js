import bcrypt from 'bcryptjs';
import _configs from '../../config/preferences'
let fs = require('fs');
let dir = './media_files';

function initFolderAndFile() {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export { initFolderAndFile }