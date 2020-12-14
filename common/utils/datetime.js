import moment from 'moment';

function timestamp2DateString(timestamp, format = "DD/MM/YYYY") {
  // if (timestamp === '01/01/1970') return;
  // timestamp = timestamp ? timestamp : moment().timestampOf();
  // if (jQuery.isPlainObject(timestamp) && timestamp.$numberLong) {
  //   timestamp = timestamp.$numberLong;
  //   if (timestamp.length > 14) timestamp = timestamp.substring(0, timestamp.length - 3);
  //   timestamp = parseFloat(timestamp);
  // }
  //timestamp = jQuery.isPlainObject(timestamp)?parseFloat(timestamp.$numberLong):timestamp;
  // if (jQuery.type(timestamp) == 'string') {
  //   if (timestamp.match(/[ /-]/g) && timestamp.substr(0, 1) !== '-') {
  //     return timestamp;
  //   }
  //   timestamp = parseFloat(timestamp);
  // }
  return moment(timestamp).format(format);
};

export {
  timestamp2DateString
};