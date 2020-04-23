var express = require('express')
var router = express.Router();
var mysql = require('mysql');
var ejs = require('ejs');
var app = express();
var fs = require('fs')
var url = require('url')
var bodyparser = require('body-parser')
var passport = require('passport');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
router.use(bodyparser.urlencoded({ extended: false }))


router.get("Register/logout", function (req, res) {
    session.user.id = 'dummy'
    session.user.password = ''
    res.redirect("../views/index.ejs")
})


module.exports=router;