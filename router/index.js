var express = require('express')
var router = express.Router();
var passport = require('passport');
var session = require('express-session');
var mysql = require('mysql');
var session = require('express-session');
//db 연결
var dbConfig = require('../dbconfig');
var mysqlcon = mysql.createConnection(dbConfig);
//db연결 테스트 만약 에러가 있을경우 err내용 log 콘솔에 찍힘.
mysqlcon.connect(function(err){
    if(err){
        console.log("error with connecting to database: " + err);
    }
})

//로그인 부분 
session.user = {
    id: 'dummy',
    password: ''
}

router.use(passport.initialize());
router.use(passport.session());
mysqlcon.connect(function (err) {
})

//index.ejs 관련 페이지 설정.
router.get('/', function(req,res) {
    // Small_col의 분류로 개수를 확인하고 small_col에 대해 count한 개수대로 내림차순으로 출력요청.
    var querystring ="SELECT Small_col, COUNT(*) as counts FROM dbnwe.tour  GROUP BY Small_col ORDER BY counts DESC;";
    mysqlcon.query(querystring,function(err, result){
        if(!err){
            res.render('../views/index.ejs',{
                loggedin: session.user.id != null && session.user.id != 'dummy',
                user_id: session.user.id,
                results:result
            });
        }
        else{
            console.log(err);
        }
    })
});

module.exports= router;