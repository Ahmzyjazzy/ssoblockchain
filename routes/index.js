'use strict';

const checkUserAuth = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.role == "staff") {
            next();
        } else if (req.session.user.role == "admim") {
            next();
        } else {
            next();
        }
    } else {
        res.redirect("/");
    }
}

module.exports = function (app, helpers) {

    app.get('/', function (req, res) {
        res.render('pages/', {
            title: 'Decentralized Citizen',
            layout: 'auth',
        });
    });

    app.get('/report',checkUserAuth, function(req, res){
        const { user } = req.session;      
        res.render('pages/report', {
            title: `Report | ${user.code.toUpperCase()}`,
            user,
            layout: 'default',
        });
    });

    app.get('/staff', checkUserAuth, function(req, res){
        const { user } = req.session;
        res.render('pages/staff', {
            title: `Staff | ${user.code.toUpperCase()}`,
            user,
            layout: 'default',
        });
    });

    app.get('/register',checkUserAuth, function(req, res){
        const { user } = req.session;
        res.render('pages/register', {
            title: `Register | ${user.code.toUpperCase()}`,
            user,
            layout: 'default',
        });
    });

    app.get('/manage_citizen',checkUserAuth, function(req, res){
        const { user } = req.session;
        res.render('pages/manage', {
            title: `Manage | ${user.code.toUpperCase()}`,
            user,
            layout: 'default',
        });
    });

    app.get('/my_nodes',checkUserAuth, function(req, res){
        const { user } = req.session;
        res.render('pages/my_nodes', {
            title: `My Nodes | ${user.code.toUpperCase()}`,
            user,
            layout: 'default',
        });
    });

    app.all('/logout', (req, res) => {
        delete req.session.user;
        req.session.destroy();
        res.redirect("/");
    });

    /* fallback to 404 when page not found */
    app.get('*', function (req, res) {
        res.render('404', {
            title: '404',
            layout: 'default'
        });
    });
}