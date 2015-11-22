var express = require('express');
var router = express.Router();
var controller = require('../controllers/main');
var contactmodule = require('../controllers/contact');

/* GET home page. */
router.get('/', controller.index);
router.get('/facce', controller.faces);
router.get('/contact', contactmodule.contact);
router.post('/contact', contactmodule.mailme);

module.exports = router;
