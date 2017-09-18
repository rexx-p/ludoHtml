var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', function(req, res, next) {
    res.sendfile('./public/ludo.html');
});

module.exports = router;
