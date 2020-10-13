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
var dbConfig = require('../dbconfig');
var mysqlcon = mysql.createConnection(dbConfig);
//db연결 테스트 만약 에러가 있을경우 err내용 log 콘솔에 찍힘.
mysqlcon.connect(function(err){
    if(err){
        console.log("error with connecting to database: " + err);
    }
})

router.get('/', function (req, res) {
    var insertagain = req.query.insertagain
    var blank = req.query.blank
    var passagain = req.query.passagain
    var idagain = req.query.idagain

    res.render('../Register/Register_user.ejs',
        {
            insertagain: insertagain != undefined,
            blank: blank != undefined,
            passagain: passagain != undefined,
            idagain: idagain != undefined
        }
    );
})

//회원가입 sql문 구분.
router.post("/", function (req, res, next) {
    console.log(req.body);
    var id = req.body.id;
    var pass = req.body.pass;
    var repass = req.body.re_pass;
    var email = req.body.email;
    var sql = 'SELECT * FROM userinfo WHERE id=?';
    if (id == '' || pass == '' || repass == '' || email == '') {
        res.redirect("../Register/Register_user.ejs?blank=true");
    }
    else {
        mysqlcon.query(sql, [id], function (err, results) {
            if (err) {
                res.redirect("../Register/Register_user.ejs?insertagain=true");
                console.log(err);
            }

            if (results.length == 0) {
                if (pass == repass) {
                    mysqlcon.query(
                        `INSERT INTO userinfo (user_id, email, password, auth) VALUES (?,?,?,?)`,
                        [req.body.id, req.body.email, req.body.pass, 'user'],
                        function (error, result) {
                            if (error) {
                                res.redirect("../Register/Register_user.ejs?insertagain=true");
                                console.log("데이터베이스 입력 에러...");
                                throw error;
                            }
                        }
                    )
                    res.redirect("../Register/Login.ejs?succses=true")
                }
                else {
                    console.log('pw 맞지않음.');
                    res.redirect("../Register/Register_user.ejs?passagain=true");
                }
            }
            else {
                console.log('id중복');
                res.redirect("../Register/Register_user.ejs?idagain=true");
            }
        })
    }
})

module.exports=router;