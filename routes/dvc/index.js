import express from 'express'
import bodyParser from 'body-parser'
import * as controller from '../../controller/dvc/index'

let mwJWT = require('../../middlewares/jwt');
let mwDVC = require('../../middlewares/dvc');
let mwLog = require('../../middlewares/log');
let mwJson = require('../../middlewares/json');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/all-services', //mwJWT.checkApiAuthorization, 
  controller.getAllServices);
router.get('/generate-api-token', //mwJWT.checkApiAuthorization, 
  controller.generateApiToken);
router.get('/token', mwDVC.checkDonViAuthorization,
  controller.getToken);

router.post('/dvc-dap-ung-uc-one', mwDVC.checkDVCAuthorization, controller.one);
router.post('/dvc-dap-ung-uc-two', mwDVC.checkDVCAuthorization, controller.two);
router.post('/dvc-dap-ung-uc-three', mwDVC.checkDVCAuthorization, controller.three);
router.post('/dvc-dap-ung-uc-four', mwDVC.checkDVCAuthorization, controller.four);
router.post('/dvc-dap-ung-uc-five', mwDVC.checkDVCAuthorization, controller.five);
router.post('/dvc-dap-ung-uc-six', mwDVC.checkDVCAuthorization, controller.six);
router.post('/dvc-dap-ung-uc-seven', mwDVC.checkDVCAuthorization, controller.seven);
router.post('/dvc-dap-ung-uc-eight', mwDVC.checkDVCAuthorization, controller.eight);
router.post('/dvc-dap-ung-uc-nine', mwDVC.checkDVCAuthorization, controller.nine);
router.post('/dvc-dap-ung-uc-ten', mwDVC.checkDVCAuthorization, controller.ten);
router.post('/dvc-dap-ung-uc-eleven', mwDVC.checkDVCAuthorization, controller.eleven);
router.post('/dvc-dap-ung-uc-twelve', mwDVC.checkDVCAuthorization, controller.twelve);
router.post('/dvc-dap-ung-uc-thirteen', mwDVC.checkDVCAuthorization, controller.thirteen);
router.post('/dvc-dap-ung-uc-fourteen', mwDVC.checkDVCAuthorization, controller.fourteen);
router.post('/dvc-dap-ung-uc-fifteen', mwDVC.checkDVCAuthorization, controller.fifteen);//
router.post('/dvc-dap-ung-uc-sixteen', mwDVC.checkDVCAuthorization, controller.fifteen);//controller.sixteen);
router.post('/dvc-dap-ung-uc-seventeen', mwDVC.checkDVCAuthorization, controller.fifteen);// controller.seventeen);
router.post('/dvc-dap-ung-uc-eighteen', mwDVC.checkDVCAuthorization, controller.fifteen);//controller.eighteen);
router.post('/dvc-dap-ung-uc-nineteen', mwDVC.checkDVCAuthorization, controller.fifteen);//controller.nineteen);
router.post('/dvc-dap-ung-uc-twenty', mwDVC.checkDVCAuthorization, controller.fifteen);//controller.twenty);

// url kiểm thử
router.post('/dvc-dap-ung-uc-one-kiem-thu', controller.one);
router.post('/dvc-dap-ung-uc-two-kiem-thu', controller.two);
router.post('/dvc-dap-ung-uc-three-kiem-thu', controller.three);
router.post('/dvc-dap-ung-uc-four-kiem-thu', controller.four);
router.post('/dvc-dap-ung-uc-five-kiem-thu', controller.five);
router.post('/dvc-dap-ung-uc-six-kiem-thu', controller.six);
router.post('/dvc-dap-ung-uc-seven-kiem-thu', controller.seven);
router.post('/dvc-dap-ung-uc-eight-kiem-thu', controller.eight);
router.post('/dvc-dap-ung-uc-nine-kiem-thu', controller.nine);
router.post('/dvc-dap-ung-uc-ten-kiem-thu', controller.ten);
router.post('/dvc-dap-ung-uc-eleven-kiem-thu', controller.eleven);
router.post('/dvc-dap-ung-uc-twelve-kiem-thu', controller.twelve);
router.post('/dvc-dap-ung-uc-thirteen-kiem-thu', controller.thirteen);
router.post('/dvc-dap-ung-uc-fourteen-kiem-thu', controller.fourteen);
router.post('/dvc-dap-ung-uc-fifteen-kiem-thu', controller.fifteen);//
router.post('/dvc-dap-ung-uc-sixteen-kiem-thu', controller.fifteen);//controller.sixteen);
router.post('/dvc-dap-ung-uc-seventeen-kiem-thu', controller.fifteen);// controller.seventeen);
router.post('/dvc-dap-ung-uc-eighteen-kiem-thu', controller.fifteen);//controller.eighteen);
router.post('/dvc-dap-ung-uc-nineteen-kiem-thu', controller.fifteen);//controller.nineteen);
router.post('/dvc-dap-ung-uc-twenty-kiem-thu', controller.fifteen);//controller.twenty);
module.exports = router;