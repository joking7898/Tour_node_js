var express = require('express')
var router = express.Router();
var bodyparser = require('body-parser')
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
router.use(bodyparser.urlencoded({ extended: false }))

//modify.ejs 관련 설정.
router.get('/', function (req, res) {
    var passagain = req.query.passagain
    var insertpassagain = req.query.insertpassagain
    res.render('../Register/Modify.ejs',
        {
            passagain: passagain != undefined,
            insertpassagain: insertpassagain != undefined
        }
    );
})

router.post("/", function (req, res) {
    console.log(req.body.new_pass)
    console.log(req.body.re_pass)
    if (!(req.body.new_pass == req.body.re_pass)) {
        res.redirect("../Modify.ejs?passagain=true")
    }
    if (!(req.body.pass == session.user.password)) {
        res.redirect("../Modify.ejs?insertpassagain=true")
    }
    if (req.body.pass == session.user.password) {
        if (req.body.choice == "확인") {

            if (req.body.new_pass != req.body.re_pass) {
                res.redirect("../Modify.ejs?insertpassagain=true")
            }
            mysqlcon.query("update user set password = ? where user_id=?",
                         [req.body.new_pass, session.user.id], function (err, results) {
                if (err)
                    console.log("DB query error : ", err)

                res.redirect("../views/index.ejs?change=true")
            })
        }
        else if (req.body.choice == '회원 탈퇴') {
            mysqlcon.query("delete from userinfo where user_id=?", [session.user.id], function (err, results) {
                if (err)
                    console.log("DB query error : ", err)
                else {
                    session.user.id = 'dummy'
                    session.user.password = ''
                    res.redirect("../views/index.ejs?outchange=true")
                }
            })
        }
    }

})

module.exports=router;