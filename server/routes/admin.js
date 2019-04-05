const express=require('express');
const abc=express();
const router=express.Router();
const sqldb=require('./mysqldb');
const jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;
var async=require('async');
//local
//const config=require('.././security/config.json');
//server config
const config=require('/etc/letsencrypt/archive/yawnmeter.com/config.json');
const AWS = require('aws-sdk');
AWS.config.update({
region: 'us-east-1',
accessKeyId:config.AWS_ACCESS_KEY,
secretAccessKey:config.AWS_SECRET_KEY
});
var s3 = new AWS.S3();

router.get('/admin/:EmailID,:Password', (req, res) => {
db.collection('admin').findOne({EmailID:req.params.EmailID.trim(),Password:req.params.Password}).then(function(user){
if(user)
{
const tokenId=jwt.sign({
EmailID:user.EmailID,
_id: user._id
},
'yawnadmin',
{
expiresIn: '7 days'
});
db.collection('admin').updateOne({_id:user._id},{$set:{adminToken:tokenId}}).then(function(data){
return res.status(200).send({result: 'Authenticated', token:tokenId});
})
}
else{return res.status(401).send({result: 'Unauthenticated Access'});}
})
.catch(error => {return res.status(500).send({error: error})});
})

//fetch data for admin
router.get('/fetchData',(req,res)=>{

async.parallel([
function(callback) {
db.collection('mapping').find({}).toArray(function(err,result){
if(err){
return callback(err);
}
return callback(null,result);
}) 
},
function(callback) {
sqldb.query("SELECT * FROM series_category", function (err, rows1, fields) {
if (err){
callback(err);
} 
var result1=JSON.stringify(rows1);
return callback(null,result1);
});
},

function(callback) {
sqldb.query("SELECT * FROM media_language",function (err,rows2,fields) {
if (err) {
return callback(err);
}
var result2=JSON.stringify(rows2);
return callback(null,result2);
});
},
function(callback) {
db.collection('kidsMapping').find({}).toArray(function(err,result1){
if(err){
return callback(err);
}
return callback(null,result1);
}) 
},
], function(error, callbackResults) {
if (error) {
//handle error
console.log(error);
} else {
const fetchData=callbackResults[0];
const categories=callbackResults[1];
const languages=callbackResults[2];
const kidsData=callbackResults[3];
return res.status(200).send({fetchData,categories,languages,kidsData});
}
});

})

router.post('/insertData',(req,res)=>{
const base64Data = new Buffer(req.body.thumbnail.replace(/^data:image\/\w+;base64,/, ""), 'base64');
const type = req.body.thumbnail.split(';')[0].split('/')[1];
var params = {
Bucket: 'yawn-img',
Key : `${req.body.title}.${type}`,
Body: base64Data,
ContentEncoding: 'base64',
ContentType: `image/${type}` 
};

s3.upload(params, function (err, data) {
//handle error
if (err) {
console.log("Error", err);
}
//success
if (data) {
arraytoObject(data.Location);
}
});

arraytoObject=(imageThumbnail)=>{
const Languages=[];
const Genres=[];
const Tags=[];

if(req.body.contentSection!=='kids'){

for(let i=0;i<req.body.languages.length;i++){
Languages.push({id:i,languages:req.body.languages[i]});
}
for(let i=0;i<req.body.genres.length;i++){
Genres.push({id:i,genres:req.body.genres[i]});
}
for(let i=0;i<req.body.tags.length;i++){
Tags.push({id:i,tagName:req.body.tags[i]});
}
uploadData(imageThumbnail,Languages,Genres,Tags);
}

if(req.body.contentSection==='kids'){

for(let i=0;i<req.body.languages.length;i++){
Languages.push({id:i,languages:req.body.languages[i]});
}
uploadData(imageThumbnail,'',Genres,'');

}


}

uploadData=(imageThumbnail,Languages,Genres,Tags)=>{

if(req.body.contentType==='series'&&req.body.contentSection==='webseries'){
if(req.body.id){
db.collection('Episodes').estimatedDocumentCount().then((count)=>{
if(count<10){
var ID="WSE0"+(count+1);
}
else{
var ID="WSE"+(count+1);
}
db.collection('Episodes').insertOne({
mediaId:ID,
seriesId:new ObjectID(req.body.id),
title:req.body.title,
thumbnail:imageThumbnail,
publisher:req.body.publisher,
URL:req.body.url,
Rating:req.body.rating,
Review:req.body.review,
description:req.body.description,
cast:req.body.cast,
categories:Genres,
languages:Languages,
RatingCount:0,
TotalRatings:0,
viewCount:0,
actionCount:0,
month:req.body.month,
year:req.body.year,
date:new Date(req.body.year,req.body.month),
tags:Tags,
contentType:req.body.contentType,
insertedOn:new Date
}).then(function(data){
const episode=data['ops']
db.collection('mapping').findOne({_id:episode[0].seriesId}).then(function(series){
db.collection('mapping').updateOne({_id:series._id},{ $push: { Episodes:episode[0] } }).then(function(err,output){

res.status(200).send({result:'data submitted succesfully'});

})
})
})
})	
}
else{
db.collection('mapping').estimatedDocumentCount().then((count)=>{
if(count<10){
var ID="WS0"+(count+1);
}
else{
var ID="WS"+(count+1);
}
db.collection('mapping').insertOne({
mediaId:ID,
title:req.body.title,
thumbnail:imageThumbnail,
publisher:req.body.publisher,
Episodes:[],
Rating:req.body.rating,
Review:req.body.review,
description:req.body.description,
cast:req.body.cast,
categories:Genres,
languages:Languages,
RatingCount:0,
TotalRatings:0,
viewCount:0,
actionCount:0,
month:req.body.month,
year:req.body.year,
date:new Date(req.body.year,req.body.month),
tags:Tags,
contentType:req.body.contentType,
insertedOn:new Date
}).then(function(err,data){

return res.status(200).send({result:'data submitted succesfully'});
})
})	
}
}

if(req.body.contentType==='singles'&&req.body.contentSection==='shortFilms'){
db.collection('media').estimatedDocumentCount().then((count)=>{
if(count<10){
var ID="SF0"+(count+1);
}
else{
var ID="SF"+(count+1);
}
db.collection('media').insertOne({
mediaId:ID,
title:req.body.title,
thumbnail:imageThumbnail,
publisher:req.body.publisher,
URL:req.body.url,
Rating:req.body.rating,
Review:req.body.review,
description:req.body.description,
categories:Genres,
languages:Languages,
RatingCount:0,
TotalRatings:0,
viewCount:0,
actionCount:0,
month:req.body.month,
year:req.body.year,
date:new Date(req.body.year,req.body.month),
tags:Tags,
contentType:req.body.contentType,
insertedOn:new Date
}).then(function(err,data){

return res.status(200).send({result:'data submitted succesfully'});
})
})	
}
if(req.body.contentType==='series'&&req.body.contentSection==='kids'){
if(req.body.id){
db.collection('kidsEpisodes').estimatedDocumentCount().then((count)=>{
if(count<10){
var ID="KSE0"+(count+1);
}
else{
var ID="KSE"+(count+1);
}
db.collection('kidsEpisodes').insertOne({
mediaId:ID,
seriesId:new ObjectID(req.body.id),
title:req.body.title,
thumbnail:imageThumbnail,
publisher:req.body.publisher,
URL:req.body.url,
Rating:req.body.rating,
Review:req.body.review,
description:req.body.description,
cast:req.body.cast,
languages:Languages,
RatingCount:0,
TotalRatings:0,
viewCount:0,
actionCount:0,
month:req.body.month,
year:req.body.year,
date:new Date(req.body.year,req.body.month),
contentType:req.body.contentType,
insertedOn:new Date
}).then(function(data){
const episode=data['ops']
db.collection('kidsMapping').findOne({_id:episode[0].seriesId}).then(function(series){
db.collection('kidsMapping').updateOne({_id:series._id},{ $push: { Episodes:episode[0] } }).then(function(err,output){

res.status(200).send({result:'data submitted succesfully'});

})
})
})
})	
}
else{
db.collection('kidsMapping').estimatedDocumentCount().then((count)=>{
if(count<10){
var ID="KS0"+(count+1);
}
else{
var ID="KS"+(count+1);
}
db.collection('kidsMapping').insertOne({
mediaId:ID,
title:req.body.title,
thumbnail:imageThumbnail,
publisher:req.body.publisher,
Episodes:[],
Rating:req.body.rating,
Review:req.body.review,
description:req.body.description,
cast:req.body.cast,
languages:Languages,
RatingCount:0,
TotalRatings:0,
viewCount:0,
actionCount:0,
month:req.body.month,
year:req.body.year,
date:new Date(req.body.year,req.body.month),
contentType:req.body.contentType,
insertedOn:new Date
}).then(function(err,data){

return res.status(200).send({result:'data submitted succesfully'});
})
})	
}
}

if(req.body.contentType==='singles'&&req.body.contentSection==='kids'){
db.collection('kidsMedia').estimatedDocumentCount().then((count)=>{
if(count<10){
var ID="KSF0"+(count+1);
}
else{
var ID="KSF"+(count+1);
}
db.collection('kidsMedia').insertOne({
mediaId:ID,
title:req.body.title,
thumbnail:imageThumbnail,
publisher:req.body.publisher,
URL:req.body.url,
Rating:req.body.rating,
Review:req.body.review,
description:req.body.description,
languages:Languages,
RatingCount:0,
TotalRatings:0,
viewCount:0,
actionCount:0,
month:req.body.month,
year:req.body.year,
date:new Date(req.body.year,req.body.month),
contentType:req.body.contentType,
insertedOn:new Date
}).then(function(err,data){

return res.status(200).send({result:'data submitted succesfully'});
})
})	
}

}


})

module.exports=router;
