var express = require('express');
var router = express.Router();
const veranstaltungController = require('../controller/veranstaltung.controller');

router.get('/all', veranstaltungController.getAllVeranstaltungen);
router.get('/get/:veranstaltungsID', veranstaltungController.getVeranstaltungInformationByID);
router.post('/add', veranstaltungController.addVeranstaltung);

module.exports = router;