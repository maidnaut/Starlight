exports.login = function (req, res) {
    var db = require('../inc/db.js');
    var crypto = require('crypto');

    var POST = {};
    if (req.method == 'POST') {
        req.on('data', function (data) {
            data = data.toString();
            data = data.split('&');
            for (var i = 0; i < data.length; i++) {
                var _data = data[i].split("=");
                POST[_data[0]] = _data[1];
            }
            var email = POST['email'];
            var password = POST['password'];
            var password = crypto.createHash('ripemd160').update(password).digest('hex');

            var sql = "SELECT id, email, password FROM s_users WHERE email = '" + email + "' AND password = '" + password + "'";

            if (email && password) {
                console.log("Got both password and email")
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result.length > 0) {
                        console.log("Found a user");
                        if ((result[0].email == email) && (result[0].password == password)) {
                            console.log("what the fuck")
                            req.session.userid = result[0].id;
                            req.session.save();

                            sql = "UPDATE s_users SET session = '"+req.session.id+"' WHERE email = '"+email+"'"
                            db.query(sql, function (err, result) {
                                if (err) throw err;
                                res.redirect("/login/success");
                            });
                        }
                        else {
                            console.log("Incorrect creds");
                            res.redirect("/login");
                        }
                    } else {
                        console.log("No user found");
                        res.redirect("/login");
                    }
                });
            } else {
                console.log("No email & password");
                res.redirect("/login");
            }
        })
    }
}

exports.register = function (req, res) {
    var db = require('../inc/db.js');
    var crypto = require('crypto');

    var POST = {};
    if (req.method == 'POST') {
        req.on('data', function (data) {
            data = data.toString();
            data = data.split('&');
            for (var i = 0; i < data.length; i++) {
                var _data = data[i].split("=");
                POST[_data[0]] = _data[1];
            }
            var email = POST['email'];
            var username = POST['username'];
            var ident = POST['username'];
            var password = POST['password'];
            var password2 = POST['password2'];

            if (password == password2) {
                var password = crypto.createHash('ripemd160').update(password).digest('hex');

                var sql = "INSERT INTO s_users (email,username,ident,password) VALUES('" + email + "', '" + username + "', '" + ident + "', '" + password + "')";

                db.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
            }
        })
    }
}