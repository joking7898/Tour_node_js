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

//db 연결
var dbConfig = require('./dbconfig');
var mysqlcon = mysql.createConnection(dbConfig);
//db연결 테스트 만약 에러가 있을경우 err내용 log 콘솔에 찍힘.
mysqlcon.connect(function(err){
    if(err){
        console.log("error with connecting to database: " + err);
    }
})

router.get('/', function (req, res) {
    var tryagain = req.query.tryagain
    var succses = req.query.succses

    res.render('../Register/Login.ejs',
        {
            tryagain: tryagain != undefined,
            succses: succses != undefined,
        }
    );
})

router.post('/', function (req, res) {
    var id = req.body.id;
    var password = req.body.your_pass;
    mysqlcon.query("select * from userinfo where id = ? and password = ?", [id, password],
                     function (err, results) {
        if (!err && results[0] != undefined) {
            session.user = {
                "id": results[0].id,
                "password": results[0].password
            }
            res.redirect("../views/index.ejs?#");
        }
        else {
            res.redirect("../views/Register/Login.ejs?tryagain=true");
            console.log('Error while performing Query in login.', err);
        }
    })
});


module.exports=router;