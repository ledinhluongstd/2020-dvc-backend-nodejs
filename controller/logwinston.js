import express from 'express'
import bodyParser from 'body-parser'
import logWinston from '../middlewares/logWinston';

let mwLog = require('../middlewares/log');
let constRes = require('../common/constants/response');

const options = {
  from: new Date() - (24 * 60 * 60 * 1000),
  until: new Date(),
  limit: 10,
  start: 0,
  order: 'desc',
  fields: ['message']
};

let router = express.Router();
router.use(bodyParser.json());

function demo(req, res) {
  logWinston.query(options, function (err, results) {
    if (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_BADREQUEST);
      res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
    }
    mwLog.generate(req, { status: 200, body: results });
    res.status(200).send(results);
  });
}

function get(req, res) {
  let { from, until, limit, start, order, fields } = req.query
  let option = {
    from: from,
    until: until,
    limit: limit,
    start: start,
    order: order,
    fields: [fields]
  }
  logWinston.query(option, function (err, results) {
    if (err) {
      mwLog.generate(req, constRes.RESPONSE_ERR_NOTFOUND);
      res.status(constRes.RESPONSE_ERR_NOTFOUND.status).send(constRes.RESPONSE_ERR_NOTFOUND.body);
    }
    mwLog.generate(req, { status: 200, body: results });
    res.status(200).send(results);
  });
}

export { demo, get }