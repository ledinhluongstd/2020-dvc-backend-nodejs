import { getAccessToken } from './token'
import axios from 'axios'
function Axios(method, url, data) {
  return axios({
    method: method,
    url: url,
    data: data,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
      'Authorization': 'Basic ' + getAccessToken(),
    },
    timeout: 5000
  })
};

function Axios2(method, url, data) {
  return axios({
    method: method,
    url: url,
    data: data,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 5000
  })
};
export { Axios, Axios2 }