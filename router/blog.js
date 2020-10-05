var express = require('express')
var mysql = require('mysql');
var url = require('url')
var bodyparser = require('body-parser')
var passport = require('passport');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const asyncify = require('express-asyncify');
var router = asyncify(express.Router());
router.use(bodyparser.urlencoded({ extended: false }))
router.use(passport.initialize());
router.use(passport.session());

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


mysqlcon.connect(function (err) {
})

router.get('/',function ( req,res ){
    res.render('../views/blog.ejs')
})

module.exports=router;