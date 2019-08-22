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
        //check domain to determine org
        const { host } = req.headers;        
        const myHost = ['localhost:4000','decentralized.herokuapp.com'];

        if(myHost.join(',').toLowerCase().includes(host.toLowerCase())){
            /* blockchain default page */
            res.render('pages/default/', {
                title: 'Decentralized Citizen',
                layout: 'auth',
            });
        }else{
            /* specific organization front page */
            const path = host.split('-')[0];
            res.render(`pages/${path}`, {
                title: path.toUpperCase(),
                layout: 'auth',
            });
        }
    });

    app.get('/dashboard',checkUserAuth, function(req, res){
        //check domain to determine org
        const { host } = req.headers;        
        const myHost = ['localhost:4000','decentralized.herokuapp.com'];
        const { user } = req.session;

        if(myHost.join(',').toLowerCase().includes(host.toLowerCase())){
            /* blockchain default page */
            res.render('pages/default/dashboard', {
                title: 'Decentralized Citizen',
                user,
                layout: 'default',
            });
        }else{
            /* specific organization front page */
            const path = host.split('-')[0];
            res.render(`pages/${path}/dashboard`, {
                title: path.toUpperCase(),
                layout: 'default',
            });
        }
    });

    app.get('/staff', checkUserAuth, function(req, res){
        //check domain to determine org
        const { host } = req.headers;        
        const myHost = ['localhost:4000','decentralized.herokuapp.com'];
        const { user } = req.session;

        if(myHost.join(',').toLowerCase().includes(host.toLowerCase())){
            /* blockchain default page */
            res.render('pages/default/staff', {
                title: 'Decentralized Citizen',
                user,
                layout: 'default',
            });
        }else{
            /* specific organization front page */
            const path = host.split('-')[0];
            res.render(`pages/${path}/staff`, {
                title: path.toUpperCase(),
                layout: 'default',
            });
        }
    });

    app.get('/register',checkUserAuth, function(req, res){
        //check domain to determine org
        const { host } = req.headers;        
        const myHost = ['localhost:4000','decentralized.herokuapp.com'];
        const { user } = req.session;

        if(myHost.join(',').toLowerCase().includes(host.toLowerCase())){
            /* blockchain default page */
            res.render('pages/default/register', {
                title: 'Decentralized Citizen',
                user,
                layout: 'default',
            });
        }else{
            /* specific organization front page */
            const path = host.split('-')[0];
            res.render(`pages/${path}/register`, {
                title: path.toUpperCase(),
                user,
                layout: 'default',
            });
        }
    });

    app.get('/manage_citizen',checkUserAuth, function(req, res){
        //check domain to determine org
        const { host } = req.headers;        
        const myHost = ['localhost:4000','decentralized.herokuapp.com'];
        const { user } = req.session;

        if(myHost.join(',').toLowerCase().includes(host.toLowerCase())){
            /* blockchain default page */
            res.render('pages/default/manage', {
                title: 'Decentralized Citizen',
                user,
                layout: 'default',
            });
        }else{
            /* specific organization front page */
            const path = host.split('-')[0];
            res.render(`pages/${path}/manage`, {
                title: path.toUpperCase(),
                user,
                layout: 'default',
            });
        }
    });

    app.get('/my_nodes',checkUserAuth, function(req, res){
        //check domain to determine org
        const { host } = req.headers;        
        const myHost = ['localhost:4000','decentralized.herokuapp.com'];
        const { user } = req.session;

        if(myHost.join(',').toLowerCase().includes(host.toLowerCase())){
            /* blockchain default page */
            res.render('pages/default/my_nodes', {
                title: 'Decentralized Citizen',
                user,
                layout: 'default',
            });
        }else{
            /* specific organization front page */
            const path = host.split('-')[0];
            res.render(`pages/${path}/my_nodes`, {
                title: path.toUpperCase(),
                user,
                layout: 'default',
            });
        }
    });

    app.get('/all_nodes',checkUserAuth, function(req, res){
        //check domain to determine org
        const { host } = req.headers;        
        const myHost = ['localhost:4000','decentralized.herokuapp.com'];
        const { user } = req.session;

        if(myHost.join(',').toLowerCase().includes(host.toLowerCase())){
            /* blockchain default page */
            res.render('pages/default/all_nodes', {
                title: 'Decentralized Citizen',
                user,
                layout: 'default',
            });
        }else{
            /* specific organization front page */
            const path = host.split('-')[0];
            res.render(`pages/${path}/all_nodes`, {
                title: path.toUpperCase(),
                user,
                layout: 'default',
            });
        }
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