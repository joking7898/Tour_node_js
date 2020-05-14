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
// switch (mid_col) {
    //     case '전체':
    //         fixedCategory[0] = 'selected';
    //         break;
    //     case '역사관광지':
    //         fixedCategory[1] = 'selected';
    //         break;
    //     case '체험관광지':
    //         fixedCategory[2] = 'selected';
    //         break;
    //     case '산업관광지':
    //         fixedCategory[3] = 'selected';
    //         break;
    //     case '자연관광지':
    //         fixedCategory[4] = 'selected';
    //         break;
    //     case '건축/조형물':
    //         fixedCategory[5] = 'selected';
    //         break;
    //     case '휴향관광지':
    //         fixedCategory[6] = 'selected';
    //         break;
    //     case '문화시설':
    //         fixedCategory[7] = 'selected';
    //         break;
    //     case '관광자원':
    //         fixedCategory[8] = 'selected';
    //         break;                            
    // }
    // switch (c_city) {
    //     case '전체':
    //         fixedLocation[0] = 'selected';
    //         break;
    //     case '서울':
    //         fixedLocation[1] = 'selected';
    //         break;
    //     case '인천':
    //         fixedLocation[2] = 'selected';
    //         break;
    //     case '경기':
    //         fixedLocation[3] = 'selected';
    //         break;
    //     case '대구':
    //         fixedLocation[4] = 'selected';
    //         break;
    //     case '부산':
    //         fixedLocation[5] = 'selected';
    //         break;
    //     case '울산':
    //         fixedLocation[6] = 'selected';
    //         break;
    //     case '강원':
    //         fixedLocation[7] = 'selected';
    //         break;
    //     case '충북':
    //         fixedLocation[8] = 'selected';
    //         break;
    //     case '충남':
    //         fixedLocation[9] = 'selected';
    //         break;
    //     case '경남':
    //         fixedLocation[10] = 'selected';
    //         break;
    //     case '경북':
    //         fixedLocation[11] = 'selected';
    //         break;
    //     case '전북':
    //         fixedLocation[12] = 'selected';
    //         break;
    //     case '전남':
    //         fixedLocation[13] = 'selected';
    //         break;
    //     case '전남':
    //         fixedLocation[14] = 'selected';
    //         break;
    //     case '광주':
    //         fixedLocation[15] = 'selected';
    //         break;
    //     case '제주':
    //         fixedLocation[16] = 'selected';
    //         break;
    // }
module.exports= router;