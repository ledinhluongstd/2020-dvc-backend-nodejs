function regexText(str) {
  str = str != undefined ? str : '';
  str = str.toLowerCase();
  str = str.replace('.', '\\.');
  str = str.replace('*', '\\*');
  str = str.replace('?', '\\?');
  str = str.replace('(', '\\(');
  str = str.replace(')', '\\)');
  str = str.replace('{', '\\{');
  str = str.replace('}', '\\}');
  str = str.replace('[', '\\[');
  str = str.replace(']', '\\]');
  str = str.replace('$', '\\$');
  str = str.replace('%', '\\%');
  str = str.replace('+', '(.{1})');

  str = str.replace(
    /a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,
    '(a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)'
  );
  str = str.replace(/e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, '(e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)');
  str = str.replace(/i|ì|í|ị|ỉ|ĩ/g, '(i|ì|í|ị|ỉ|ĩ)');
  str = str.replace(
    /o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,
    '(o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)'
  );
  str = str.replace(/u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, '(u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)');
  str = str.replace(/y|ỳ|ý|ỵ|ỷ|ỹ/g, '(y|ỳ|ý|ỵ|ỷ|ỹ)');
  str = str.replace(/d|đ/g, '(d|đ)');

  return { $regex: '(?i).*' + str + '.*' };
}
export { regexText }
