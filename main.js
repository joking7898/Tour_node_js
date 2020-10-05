// main.js로 실행시 현재 index.ejs는 잘 받아 와짐.
// 다른 페이지 구동시 can not found 현상 일어남.

var express = require('express');
var app = express();

//=================== router  import ====================
// var starter_router = require('./router/starter.js')


var Register_user = require('./router/Register_user.js')
app.use('/Register/Register_user.ejs',Register_user);

var Register_logout = require('./router/Register_logout.js')
app.use('/Register/logout',Register_logout);

var Register_login = require('./router/Register_login.js')
app.use('/Register/Login.ejs',Register_login);

var treavel_list = require('./router/treavel_list.js')
app.use('/views/rooms.ejs',treavel_list);

var index_router = require('./router/index.js')
app.use('/views/index.ejs',index_router );

var Single_travel = require('./router/Single_travel.js')
app.use('/views/rooms-single.ejs',Single_travel);

var Register_router = require('./router/Register_user.js')
app.use('/Register',Register_router );

var about_router = require('./router/about.js')
app.use('/views/about.ejs',about_router );

var blog_router = require('./router/blog.js')
app.use('/views/blog.ejs',blog_router );

var contact_router = require('./router/contact.js')
app.use('/views/contact.ejs',contact_router );

var alter_router = require('./router/alter.js')
app.use('/views/alter.ejs',alter_router );


//====================================================

app.use('/views', express.static(__dirname + '/public'));
app.use('/Register', express.static(__dirname + '/Republic'));
app.use('/views/image', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.redirect('./views/index.ejs')
})

app.listen(3000, function(){
    console.log('port 3000 listening');
});
