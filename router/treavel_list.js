var express = require('express')
var router = express.Router();
var mysql = require('mysql');
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
//로그인 부분 
session.user = {
    id: 'dummy',
    password: ''
}
router.use(passport.initialize());
router.use(passport.session());

mysqlcon.connect(function (err) {
})

//rooms.ejs 관련 페이지
router.get('/',function(req,res){
    var querystring ="SELECT * FROM dbnwe.tour";
    var querydata = url.parse(req.url, true).query;
    var unregistering = req.query.unregistering
    var registering = req.query.registering
    // var category = (querydata.category == undefined) ? "전체" : querydata.category;
    // var location = (querydata.location == undefined) ? "전체" : querydata.location;
    mysqlcon.query(querystring,function(err, result){
        if(!err){
            res.render('../views/rooms.ejs',{
                loggedin: session.user.id != null && session.user.id != 'dummy',
                user_id: session.user.id,
                pageNum: (req.query.page) ? req.query.page : 1,
                results:result
            });
        }
        else{
            console.log(err);
        }
    })
});

module.exports= router;