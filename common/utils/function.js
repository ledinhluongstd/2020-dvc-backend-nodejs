
import bcrypt from 'bcryptjs';
import _configs from '../../config/preferences'

function isEmpty(obj) {
  if (!obj) return !obj;
  return Object.getOwnPropertyNames(obj).length === 0;
}

export { isEmpty }