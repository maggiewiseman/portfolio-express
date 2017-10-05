const express = require('express');
const cookieParser = require('cookie-parser');
const basicAuth = require('basic-auth');
const secrets = require('./secrets.json');
const descriptions = require('./descriptions.json');
const hb = require('express-handlebars');
const dirListArray = require('./dirList').getDirList();
const app = express();

//cofigure handlebars
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.engine('handlebars', hb({defaultLayout: 'main'}));

//this allows use to get access to data that comes in via a POST request
app.use(require('body-parser').urlencoded({
    extended: false
}));

//this allows us to check for cookies
app.use(cookieParser());

app.get('/', (req, res) => {
    clearActive();
    console.log(dirListArray);
    res.render('welcome', {"projects" : descriptions.projects});
});
//when users come to this url, they automatically see the cookie page
//users are redirected here when they don't have authCookie
app.get('/cookie', function(req, res){
    res.render('cookie');
});

//method that handles a post request from the cookie page.  Users will either have said ok to cookes or not.
//if they say ok, then redirect them to the path in the path cookie or /hello if they don't have a path.
//if they do not say okay
app.post('/cookie', (req, res) =>{
    //set cookies if they clicked ok
    console.log('post event!');
    if(req.body.checkbox == "on" ){
        res.cookie('authCookie', 'chocolate_chip');
        //redirect somewhere:
        if (req.cookies['path']){
            res.redirect(req.cookies['path']);
        } else {
            res.redirect('/');
        }
    } else {
        clearActive();
        res.render('cookie', {"projects" : descriptions.projects});
    }

});

//using basic auth for this project so when user asks for carousel she should be asked to authenticate.
//app.use('/carousel', auth);

app.use(checkCookies);

app.get('/:projectName/description', (req, res, next) => {

    console.log('projectName', req.params.projectName);
    var projectName = req.params.projectName;
    clearActive();
    if(descriptions.projects[projectName]){
        descriptions.projects[projectName].active = true;
        res.render('desc', {
            "projects" : descriptions.projects,
            "project" : descriptions.projects[projectName]
        });
    } else {
        next();
    }
});

//this sets the directory to which all static files will be served from
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/projects'));

app.use((req,res) => {
    console.error('File Not Found, 404');
    clearActive();
    res.status(404);
    res.render('404', {"projects" : descriptions.projects});
});

app.listen(process.env.PORT || 8080, () => {
    console.log('Listening on 8080.');
});

function checkCookies(req, res, next){
    //set the authCookie exists, then they have allowed cookies
    if(req.cookies['authCookie'] === 'chocolate_chip'){
        next();
    } else {
        //they have not allowed cookies, they will be redirected to the cookie page, but get their target URL so they can be routed there when they do accept cookies. It is weird to use cookies before they've allowed, but it only lasts for 20 sec...
        if(req.url != '/cookie'){
            res.cookie('path', req.url, {
                maxAge: 20000,
                httpOnly: true //makes it so other scripts can't mess w your cookies
            });
        }
        console.log('check cookies failed');
        res.redirect('/cookie');
    }
}

function auth(req, res, next){
    var creds = basicAuth(req);
    if (!creds || creds.name != secrets.expressBasicAuth.username || creds.pass != secrets.expressBasicAuth.password) {
        res.setHeader('WWW-Authenticate', 'Basic realm=www');
        res.sendStatus(401);
    } else {
        next();
    }
}

function clearActive() {
    for(var key in descriptions.projects) {
        console.log('clearing active', key);
        //console.log('key.active', key.active);
        //console.log('key["active"]', key["active"]);
        for(var child in descriptions.projects[key]){
            console.log('child key', child);
        }
        if(descriptions.projects[key].active) {

            console.log("before", key.active);
            descriptions.projects[key].active = false;
            console.log("after", key.active);
        }
    }
}
