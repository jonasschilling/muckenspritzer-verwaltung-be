var express = require('express');
var router = express.Router();
const haesController = require('../controller/haes.controller');


router.get('/all', haesController.getAllHaeser);
router.get('/muck/all', haesController.getAllMuckHaeser);
router.get('/spritzer/all', haesController.getAllSpritzerHaeser);
router.get('/muck/:haesnummer', haesController.getMuckHaesByHaesnummer);
router.get('/spritzer/:haesnummer', haesController.getSpritzerHaesByHaesnummer);
router.get('/muck/:haesnummer/history', haesController.getMuckHaesHistoryByHaesnummer);
router.get('/spritzer/:haesnummer/history', haesController.getSpritzerHaesHistoryByHaesnummer);
router.get('/get/:haesID', haesController.getHaesByID);
router.get('/maxhaesnummer', haesController.getMaxHaesnummer);
router.post('/add', haesController.addHaes);

module.exports = router;