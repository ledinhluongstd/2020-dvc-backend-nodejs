var axios = require('axios');
var qs = require('querystring');
let _configs = require('../../config/preferences');


const getGSPToken = (tokenUrl, consumerKey, secretKey) => {
  let combinedKey = consumerKey + ':' + secretKey;
  let base64CombinedKey = new Buffer(combinedKey).toString('base64');
  return axios.post(tokenUrl, qs.stringify({
    'grant_type': 'client_credentials'
  }), {
    headers: {
      Authorization: 'Basic ' + base64CombinedKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

module.exports = {
  callGSPService: async ({
    method,
    svcUrl,
    body = null,
    options = null
  }) => {
    try {
      let gspTokenResp = await getGSPToken(_configs.dmdcqg.url_get_token, _configs.dmdcqg.consumer_key, _configs.dmdcqg.consumer_ecret);
      if (gspTokenResp && gspTokenResp.data) {
        switch (method.toUpperCase()) {
          case 'GET':
            var svcResp = await axios.get(svcUrl, {
              headers: {
                Authorization: 'Bearer ' + gspTokenResp.data.access_token
              }
            });

            if (svcResp && svcResp.data) {
              return svcResp.data;
            } else {
              return null
            }
          default:
            var svcResp = await axios[method.toLowwerCase()](svcUrl, body, {
              headers: {
                Authorization: 'Bearer ' + gspTokenResp.data.access_token
              }
            });
            if (svcResp && svcResp.data) {
              return svcResp.data;
            } else {
              return null
            }
        }
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  },
}