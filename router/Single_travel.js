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

// select * from review where AttractionId = ?;\

router.get('/',function (req, res) {
    var user_id = session.user.id ? session.user.id : 'dummy'
    var querydata = url.parse(req.url, true).query;
    var Idnum = querydata.Idnum;
    
    // console.log(Name);
        mysqlcon.query("select * from dbnwe.tour where Idnum = ? ;\
                        select * from dbnwe.review where tour_id = ? ;", [Idnum ,Idnum],
        function (err, results) {
        if (!err) {
            // console.log(results);
            res.render('../views/rooms-single.ejs', {
                dberr:querydata.dberr!=null,
                results: results[0],
                reviews: results[1],
                loggedin: session.user.id != null && session.user.id != 'dummy',
                user_id: session.user.id,
                Idnum: Idnum,
                loginfirst:querydata.loginfirst!=null
            });
        }
        else {
            console.log('Error while performing Query.', err);
        }
    })
})
router.post('/',function (req, res) {
    var Idnum = querydata.Idnum;
    var rating = $("#star_rating option").index($("#star_rating option:selected"));
    var input = document.getElementById("comment").value;
    var user_id = session.user.id ? session.user.id : 'dummy'

    mysqlcon.query("insert into dbnwe.review (user_id,rate,review,tour_id) values(?,?,?,?);" , [user_id,rating,input,Idnum] ,
            function(err,results){
                if (error) {
                    console.log("데이터베이스 입력 에러...");
                    res.redirect('../views/rooms-single.ejs?Idnum='+Idnum+'&dberr=ture');
                    throw error;
                }
        }
    )
    res.redirect('../views/rooms-single.ejs');
})

module.exports=router;