var path=require('path');
var fs = require('fs');
var Logger = exports.Logger = {};
var infoStream = fs.createWriteStream('/home/ubuntu/yawnmeter/server/logs/info.txt');
var errorStream = fs.createWriteStream('/home/ubuntu/yawnmeter/server/logs/error.txt');

// login
// var infoStream = fs.createWriteStream('.././logs/info.txt');
// var errorStream = fs.createWriteStream('.././logs/error.txt');

Logger.info = function(userName,msg) {

if(userName){

var message = new Date().toISOString() + " : "+ userName + ":" + msg + "\n";
infoStream.write(message);
}

else{

var message = new Date().toISOString() + " : " + msg + "\n";
infoStream.write(message);
}

};



Logger.error = function(msg) {

var message = new Date().toISOString() + " : " + msg + "\n";
errorStream.write(message);

};
