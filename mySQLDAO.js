// import promis-sql
var mysql = require('promise-mysql');

// import express-validator
//const { body, validationResult, check} = require('express-validator');

// pool variable
var pool;

// create connection pool and get a connection
mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'geography'
  })
  .then((result) => {
      pool = result
  })
  .catch((error) => {
      console.log(error)
});

// send query to mysql database, promise-mysql
// will return a then (success) or a catch (unsuccessful)
var getCountries = function() {
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })           
    })   
}

// send query to mysql database, promise-mysql
// will return a then (success) or a catch (unsuccessful)
var getCities = function(){
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
    });
}

// NOTE: code is not working yet......
var getCityDetails = function(cty_code, co_code){
    return new Promise((resolve, reject) => {
        var cityDetailQuery = {
            sql: "select cty_code, city.co_code, cty_name, population, isCoastal, areakm, c.co_code, c.co_name " +
             "from country c " +
             "join city on c.co_code = city.co_code " +
             "where city.co_code = '?' " +
             "and city.cty_code = '?'",

             values:[cty_code, city.co_code, cty_name, population, isCoastal, areakm, c.co_code, c.co_name]
        }
        pool.query(cityDetailQuery)
        .then((result) => {
            console.log(result)
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

// add country to database
var addCountry = function(co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var addQuery = {
            sql : 'insert into country (co_code, co_name, co_details) values (?, ?, ?)',
            values:[co_code, co_name, co_details]
        }
        pool.query(addQuery)
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })           
    })   
}

 // update country, inserts edited data into database...Code not working yet....
 var upDateCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var editQuery = {
            sql : 'insert into country (co_code, co_name, co_details) VALUES (?, ?, ?)',
            values:[co_code, co_name, co_details]
        }
        pool.query(editQuery)    
        .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

// delete country from countries table/database
var deleteCountry = function(co_code) {
    return new Promise((resolve, reject) => {
        var deleteQuery = {
            sql: 'delete from country where co_code = ?',
            values:[co_code]
        }
        pool.query(deleteQuery)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

module.exports = { addCountry, getCountries, getCities, deleteCountry, getCityDetails, upDateCountry }