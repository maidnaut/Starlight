// Constants
    const express = require('express');
    const session = require('express-session');
    const cookieParser = require("cookie-parser");
    const ejs = require('ejs');
    const fs = require('fs');
    const db = require('./starlight/inc/db.js');
    const func = require('./starlight/inc/functions.js');

    const router = express.Router();
    const app = express();
    const port = 81;

    app.use(express.json());

// Sessions
    const time = 1000000 * 60 * 60 * 24;
    app.use(session({
        secret: "apeironi",
        saveUninitialized: true,
        cookie: { maxAge: time },
        resave: false
    }));
    app.use(cookieParser());

// EJS Views
    app.set('view engine', 'ejs');
    app.set('views', './starlight/views');
    app.use(express.static(__dirname + '/starlight/static')); // Include CSS
    app.use('/views', express.static('header.ejs')); // Include header.

    // redirect to the homepage
    app.get('/', function (req, res) {
        res.redirect('/home');
    });

    app.get('*', function (req, res) {
        url = req.url.split('/').filter(Boolean);

        switch (url[0]) {
            case "home":
                res.render('home/home', {title: 'Home', session: req.session});
                break;

            case "register":
                if (url[1] == "success") {
                    res.render('register/success', { title: 'Register', session: req.session });
                } else {
                    res.render('register/register', { title: 'Register', session: req.session });
                }
                break;

            case "login":
                if (url[1] == "success") {
                    res.render('login/success', { title: 'Login', session: req.session });
                } else {
                    res.render('login/login', { title: 'Login', session: req.session });
                }
                break;

            case "logout":
                req.session.destroy(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(session.id);
                    }
                });
                res.redirect("/home");
                break;

            case "notifications":
                res.render('notifications/notifications', { title: 'Notifications', session: req.session });
                break;

            case "top":
                res.render('top/top', { title: 'Top Posts', session: req.session });
                break;

            case "explore":
                res.render('explore/explore', { title: 'Explore', session: req.session });
                break;

            case "docs":
                if (url[1] == "roadmap") {
                    res.render('docs/roadmap', { title: 'Roadmap', session: req.session });
                } else {
                    res.render('docs/about', { title: 'About', session: req.session });
                }
                break;

            default:
                // Find a user
                db.query('select * from s_users where ident="'+url+'"', function (err, rows, fields) {
                    if (err) throw err;
                    if (rows != "") {
                        res.render('users/user', { title: 'rows[0].username', session: req.session, data: rows[0] });
                    } else {
                        // Default to 404
                        res.render('globals/404', { title: '404', session: req.session });
                    }
                });
                
                break;
        }
    });

    app.post("/login", function async(req, res) {
        func.login(req, res);
    });

    app.post("/register", function async(req, res) {
        func.register(req, res);
        res.redirect("/register/success");
    });

// Turn on the server
    app.listen(port, function () {
        console.log(`Starlight running on port ${port}!`);
    });