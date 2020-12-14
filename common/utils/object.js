function isObjEmpty(obj) {
  if (!obj) return !obj;
  return Object.getOwnPropertyNames(obj).length === 0;
};

export { isObjEmpty }