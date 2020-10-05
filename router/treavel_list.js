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
    var get_mid_col = querydata.mid_col;
    var get_city = querydata.c_city;
    var c_mid_col = (querydata.mid_col == undefined) ? "전체" : get_mid_col;
    var c_city = (querydata.c_city == undefined) ? "전체" : get_city;
    var fixedCategory = new Array(9).fill("");
    var fixedLocation = new Array(17).fill("");
    //새로 추가하는 부분.
    var name = querydata.Name;
    if(name == undefined){
        if (c_mid_col == "전체" && c_city == "전체") {
            querystring;
        }
        else if (c_mid_col != "전체" && c_city != "전체") {
            querystring += " where City = '" + c_city + "' and Mid_col = '" + c_mid_col + "'";
        }
        else if (c_mid_col != "전체" || c_city != "전체") {
            if (c_mid_col == "전체") {
                querystring += " where City = '" + c_city + "'";
            }
            else if (c_city == "전체") {
                querystring += " where Mid_col = '" + c_mid_col + "'";
            }
        }
    }
    else{
        querystring += " where Name like '%" + name + "%'";
    }

    mysqlcon.query(querystring,function(err, result){
        if(!err){
                console.log(querystring);
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
router.post('/',function (req, res) {
    var querydata = url.parse(req.url, true).query;
    var Idnum = querydata.Idnum;
    var Name = req.body.Name;

    res.redirect('../views/rooms.ejs?Name='+Name);


    })
module.exports= router;