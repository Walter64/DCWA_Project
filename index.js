// import express framework
var express = require('express');

// import functionality from various files
var mySQLDAO = require('./mySQLDAO');
var myMongoDAO = require('./mongoDAO');

// import ejs
var ejs = require('ejs');

// assign expess functionality to app variable
var app = express();

// import body-parser
var bodyParser = require('body-parser');

// parse the bodies of all incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

// import express-validator
const { body, validationResult, check } = require('express-validator');

// alert express.js that view engine is ejs
app.set('view engine', 'ejs');

// import promise-myslq
var mysql = require('promise-mysql');

// get request on root, homePage
app.get('/', (req, res) => {    
    res.render("homePage");
});

// get request on /countries from clicking ListCounries link on homepage
// calls getCountries in mySQLDAO.js file, render countries.ejs, populate table with database date
app.get('/countries', (req, res) => {
    mySQLDAO.getCountries()
            .then((result) => {
                res.render('countries', { country: result }); 
            })
            .catch((error) => {
                res.send(error);
            })    
});

// get request on /countries from clicking List Cities link on homepage
// calls getCities in mySQLDAO.js file, render cities.ejs, populate table with database date
app.get('/cities', (req,res) => {
    mySQLDAO.getCities()
            .then((result) => {
                res.render('cities', { cities: result });
            })
            .catch((error) => {
                res.send(error);
            })
});

// NOTE: code is not working yet...... need to add second paramater???
app.get('/allDetails/:cty_code/:city.co_code', (req, res) => {
    var co_code = req.params.city.co_code
    mySQLDAO.getCityDetails(req.params.cty_code, co_code)
        .then((result) => {
            res.render("allDetails", {city: result });
        })
        .catch((error) => {
            res.send(error);
        })
})

// post request, which includes middleware validation
app.post('/addCountry',
[
    check('co_code').isLength({min:3, max:3}).withMessage("Country code must have exactly 3 characters"),
    check('co_name').isLength({min:3}).withMessage("Country name must have at least 3 characters")
],
 (req, res) => {   
    var errors = validationResult(req); // if error found
    if(!errors.isEmpty()){
        res.render("addCountry", {errors:errors.errors, co_code:req.body.co_code, co_name:req.body.co_name, co_details:req.body.co_details});        
    }
    else{
        mySQLDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
        .then((result) => {
            res.redirect('/countries');
        })
        .catch((error) => {
            res.send(error);
        })
    }
});

// get request on /addCountry to render page
app.get('/addCountry', (req, res) => {
    res.render("addCountry");
});

// get request on /delete, to delete country from database/web table
app.get('/delete/:co_code', (req, res) => {
    mySQLDAO.deleteCountry(req.params.co_code)
            .then((result) => {
                res.redirect('/countries');
            })
            .catch((error) => {
                res.send(error);
            })
});

// update country details, post request to add a new head of state...code not working yet...
app.post('/update:co_code', (req, res) => {
    mySQLDAO.upDateCountry(req.params.co_code)
        .then((result) => {
            res.redirect('/countries');
        })
        .catch((error) => {
            res.send(error);
        })
})

// == MongoDB requests

app.get('/headOfState', (req, res) => {
    myMongoDAO.getHeadsOfState()
        .then((documents) => {
            res.render('headsOfState', { heads: documents });
        })
        .catch((error) => {
            res.send(error);
        })
});

// get request on /addHeadOfState, to render page
app.get('/addHeadOfState', (req, res) => {
    res.render('addHeadOfState');    
});

// post request to add a new head of state
app.post('/addHeadOfState', (req, res) => {
    myMongoDAO.addHeadOfState(req.body.id, req.body.name)
        .then((result) => {
            res.redirect('/headOfState');
        })
        .catch((error) => {
            res.send(error);
        })
})

// listenting on port 3000
app.listen(3000, () => {
    console.log("Listenting on port 3000...");
});

