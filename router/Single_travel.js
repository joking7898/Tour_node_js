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

router.get('/',function(req, res) {
    var user_id = session.user.id ? session.user.id : 'dummy'
    var querydata = url.parse(req.url, true).query;
    var Idnum = querydata.Idnum;
    var values;
    // console.log(Name);
        mysqlcon.query("select * from dbnwe.tour where Idnum = ? ;\
                        select * from dbnwe.review where tour_id = ? ;\
                        select auth from dbnwe.userinfo where id = ?;", [Idnum ,Idnum,user_id],
        function (err, results) {
            if (!err){
                mysqlcon.query("select description from dbnwe.description where Name = ? ;",[results[0][0].Name],
                function(err,descriptions){
                    if(!err){
                        mysqlcon.query("select * from dbnwe.pictures where Name = ? ;",[results[0][0].Name],
                        function(err,pictures){
                            if (!err) {
                                res.render('../views/rooms-single.ejs', {
                                    dberr:querydata.dberr!=null,
                                    pictures :pictures,
                                    results: results[0],
                                    reviews: results[1],
                                    auth: results[2],
                                    descriptions : descriptions,
                                    loggedin: session.user.id != null && session.user.id != 'dummy',
                                    user_id: session.user.id,
                                    Idnum: Idnum,
                                    loginfirst:querydata.loginfirst!=null,
                                });
                            }
                            // console.log(results); 
                            else {
                                console.log('Error while performing Query.', err);
                            }
                        })
                    }
                    else {
                        console.log('Error while performing Query.', err);
                    } 
                })
            }
            // console.log(results); 
            else {
            console.log('Error while performing Query.', err);
         }
        } 
    )})

router.post('/',function (req, res) {
    var querydata = url.parse(req.url, true).query;
    var Idnum = querydata.Idnum;
    // 별점 관련 부분 수정예정.
    var stars = req.body.star_rating;
    var description = req.body.description;
    var user_id = session.user.id ? session.user.id : 'dummy'
    var Name = req.body.Name;
    if(Name != null){
        res.redirect('../views/rooms.ejs?Name='+Name);
    }
    else{
        console.log(stars);
        mysqlcon.query('insert into dbnwe.review (user_id,rate,review,tour_id) values(?,?,?,?);' , [user_id,stars,description,Idnum] ,
                function(err,results){
                    if (!err) {
                        res.redirect('../views/rooms-single.ejs?Idnum='+Idnum);
                    }
                    else {
                        console.log("데이터베이스 입력 에러...");
                        res.redirect('../views/rooms-single.ejs?Idnum='+Idnum+'&dberr=ture');
                        throw error;
                    }
                })
        }
    })
    

module.exports=router;