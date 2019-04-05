var mysql = require('mysql');
//establishing mysql connection
var connection =mysql.createConnection({
host:'localhost',
user: 'yawner',
password:'Yawning_2019',
database:'yawnmeter'
});

// var connection =mysql.createConnection({
// host:'localhost',
// user: 'root',
// password:'password',
// database:'yawnmeter'
// });

module.exports = connection;
