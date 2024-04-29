var express = require('express');
var router = express.Router();
const mitgliederController = require('../controller/mitglied.controller');


router.get('/all', mitgliederController.getAllMitglieder);
router.get('/all/haes', mitgliederController.getAllMitgliederHaesEigentuemer);
router.get('/', mitgliederController.getMitgliedByMitgliedInformation);
router.get('/:mitgliedsnummer', mitgliederController.getMitgliedByMitgliedsnummer);
router.get('/haes', mitgliederController.getHaesEigentumByMitgliedInformation);
router.post('/add', mitgliederController.addMitglied);

module.exports = router;
