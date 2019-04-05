const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require("fs")
const https = require('https')
const morgan = require('morgan')
const logger=require('../routes/logger').Logger;
const sqldb=require('../routes/mysqldb');
var MongoClient = require('mongodb').MongoClient;
var url="mongodb://localhost:27017/yawning";
const app = express();
app.use(morgan('combined'))
app.use(bodyParser.json({limit: '200mb'}))
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(cors())

//connection with mysql
sqldb.connect(function(err){
if(err){
console.log("MYSQL connection error!!!" + err);
}
else{
console.log('msql connected!!');
}
});


//establishing mongodb connection
MongoClient.connect(url,{},function (err,client) {
var db;
if(err){
console.log("Connection error!!!");
}else {
global.db = client.db('yawning');
console.log("Connected to MongoDB")
}
})

//importing routes module
const login=require('../routes/login');
const signup=require('../routes/signup');
const posts=require('../routes/posts');
const profile=require('../routes/profile');
const search=require('../routes/search');
const admin=require('../routes/admin');
const cronJob=require('../helpers/cron');

app.use(login);
app.use(signup);
app.use(posts);
app.use(search);
app.use(admin);
app.use(profile);

//cronJob.Scheduler();



// const httpsOptions = {
// key: fs.readFileSync('.././security/server.key'),
// cert: fs.readFileSync('.././security/rootCA.pem'),
// requestCert: false,
// rejectUnauthorized: false
// }

const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/archive/yawnmeter.com/privkey2.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/archive/yawnmeter.com/fullchain2.pem'),
    ca: fs.readFileSync("/etc/letsencrypt/archive/yawnmeter.com/chain2.pem"),
    requestCert: false,
    rejectUnauthorized: false
}
const server = https.createServer(httpsOptions, app)
.listen(5443, () => {

console.log('server running at ' + 5443)
})


