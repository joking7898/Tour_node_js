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

router.get('/',function (req,res){
    var querydata = url.parse(req.url, true).query;
    var Idnum = querydata.Idnum;
    mysqlcon.query("select * from dbnwe.tour where Idnum = ? ;",[Idnum],
    function(err,result) {
        if(!err){
            // console.log(result[0].Name)
            mysqlcon.query("select description from dbnwe.description where Name = ? ;",[result[0].Name],
                function(err,descriptions){
                    res.render('../views/alter.ejs',{
                        result:result,
                        descriptions:descriptions,
                        Idnum : Idnum  
                    })
                });
        }
    });
}) 

router.post('/',function (req,res){
    var querydata = url.parse(req.url, true).query;
    var Idnum = querydata.Idnum;
    var name = req.body.name;
    var tel = req.body.tel;
    var address = req.body.address;
    var disc = req.body.disc;
    var sql = 'update dbnwe.tour set Name=?,Tel=?,Address=? where Idnum=?;'
    mysqlcon.query(sql,[name,tel,address,Idnum],function(err,result) {
        if(!err){
            console.log(sql)
            var sql2='update dbnwe.description set description=?where Name=?;'
            mysqlcon.query(sql2,[disc,name],function(err,descriptions){
                    if(!err){
                        res.redirect('../views/rooms-single.ejs?Idnum='+Idnum);
                    }
                });
        }
    });

})

module.exports=router;