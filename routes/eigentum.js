var express = require('express');
var router = express.Router();
const eigentumController = require('../controller/eigentum.controller');


router.post('/add', eigentumController.addEigentum);

module.exports = router;