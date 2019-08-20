'use strict';
module.exports = function (app, helpers) {

    app.get('/', function (req, res) {
        //check domain to determine org
        const { host } = req.headers;        
        const myHost = ['localhost:4000','decentralized.herokuapp.com'];

        if(myHost.join(',').toLowerCase().includes(host.toLowerCase())){
            /* blockchain default page */
            res.render('pages/default/', {
                title: 'Decentralized Citizen',
                layout: 'default',
            });
        }else{
            /* sepcific organization front page */
            const path = host.split('-')[0];
            res.render(`pages/${path}`, {
                title: path.toUpperCase(),
                layout: 'default',
            });
        }
    });

    app.get('/dashboard', function(req, res){
        //check domain to determine org
        const { host } = req.headers;        
        const myHost = ['localhost:4000','decentralized.herokuapp.com'];

        if(myHost.join(',').toLowerCase().includes(host.toLowerCase())){
            /* blockchain default page */
            res.render('pages/default/dashboard', {
                title: 'Decentralized Citizen',
                layout: 'default',
            });
        }else{
            /* sepcific organization front page */
            const path = host.split('-')[0];
            res.render(`pages/${path}/dashboard`, {
                title: path.toUpperCase(),
                layout: 'default',
            });
        }
    });

    app.all('/logout', (req, res) => {
        delete req.session.user; // any of these works
        req.session.destroy(); // any of these works
        res.redirect('/');
    });


    
    // /* fallback to 404 when page not found */
    // app.get('*', function (req, res) {
    //     res.render('404', {
    //         title: '404',
    //         layout: 'default'
    //     });
    // });
}