import bcrypt from 'bcryptjs';
import _configs from '../../config/preferences'

function getAccessToken() {
  return Buffer.from(_configs.mongodb.usr + ':' + _configs.mongodb.pwd, 'utf8').toString('base64');
}

function comparePassword(plainText, encrypedPassword) {
  return bcrypt.compareSync(plainText, encrypedPassword);
}

function encryptPassword(palinText) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(palinText, salt);
}

function checkSuperAccount(account, pwd) {
  if (account === _configs.super.usr && !pwd)
    return true
  if (account === _configs.super.usr && comparePassword(pwd, encryptPassword(_configs.super.usr)))
    return true
  return false
}

export { getAccessToken, comparePassword, encryptPassword, checkSuperAccount }