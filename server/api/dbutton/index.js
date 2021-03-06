'use strict';

var express = require('express');
var controller = require('./dbutton.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);

module.exports = router;
