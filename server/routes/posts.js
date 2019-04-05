const express=require('express');
const abc=express();
const router =express.Router();
const jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;
const logger=require('./logger').Logger;
var async=require('async');
const sqldb=require('./mysqldb');

router.get('/posts/:tokenId', (req, res) => {
async.parallel([
function(callback) {
const date=new Date()
db.collection('mapping').find({date:{$gte:(new Date((new Date()).getTime() - (90 * 24 * 60 * 60 * 1000)))}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,mediaId:1}}).sort({date:-1,insertedOn:-1}).limit(5).toArray(function(error,result1){
var firstCollection=[];
result1.forEach(function(data){
firstCollection.push(data._id);
})
db.collection('mapping').find({_id:{$nin:firstCollection}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,mediaId:1}}).sort({insertedOn:-1}).limit(5).toArray(function(error,result2){
db.collection('userWatchlist').estimatedDocumentCount().then((count)=>{
if(req.params.tokenId!=='5324@!!$00'&&count>0){
db.collection('userWatchlist').aggregate([
{$group:{ _id : "$userId",favId:{ $push: "$id" }}}
]).toArray(function(err,favorites){
let favorite=favorites.map(fav => fav.favId);
for(let i=0;i<result1.length;i++){
if(favorite[0].includes(result1[i]._id.toString())){
result1[i].isfavorite=true
}
else{
result1[i].isfavorite=false
}
}

for(let i=0;i<result2.length;i++){
if(favorite[0].includes(result2[i]._id.toString())){
result2[i].isfavorite=true
}
else{
result2[i].isfavorite=false
}
}
return callback(null,result1,result2)
})	
}

else{
for(let i=0;i<result1.length;i++){
result1[i].isfavorite=false
}

for(let i=0;i<result2.length;i++){
result2[i].isfavorite=false
}

return callback(null,result1,result2)	
}


})
})
})
},

function(callback) {
sqldb.query("SELECT * FROM popular_channel;", function (err, rows1, fields) {
if (err){
callback(err);
} 
var result3=JSON.stringify(rows1);
return callback(null,result3);
});
},

function(callback) {
sqldb.query("SELECT * FROM media_language",function (err,rows2,fields) {
if (err) {
return callback(err);
}
var result4=JSON.stringify(rows2);
return callback(null,result4);
});
},

function(callback) {
sqldb.query("SELECT * FROM series_category", function (err, rows3, fields) {
if (err){
callback(err);
} 
var result5=JSON.stringify(rows3);
return callback(null,result5);
});
},
function(callback){
db.collection('media').find({},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,mediaId:1}}).sort({insertedOn:-1}).limit(5).toArray(function(error,result6){
db.collection('userWatchlist').estimatedDocumentCount().then((count)=>{
if(req.params.tokenId!=='5324@!!$00'&&count>0){
db.collection('userWatchlist').aggregate([
{$group:{ _id : "$userId",favId:{ $push: "$id" }}}
]).toArray(function(err,favorites){
if(favorites.length){
let favorite=favorites.map(fav => fav.favId);
for(let i=0;i<result6.length;i++){
if(favorite[0].includes(result6[i]._id.toString())){
result6[i].isfavorite=true
}
else{
result6[i].isfavorite=false
}
}
return callback(null,result6)
}
})	
}
else{

return callback(null,result6)	
}
})
})
}
], function(error, callbackResults) {
if (error) {
//handle error
console.log(error);
} else {
const fetchData=callbackResults[0];
const channels=callbackResults[1];
const languages=callbackResults[2];
const generes=callbackResults[3];
const topSingles=callbackResults[4];
const freshSeries=fetchData[0];
const recentSeries=fetchData[1];
return res.status(200).send({recentSeries,freshSeries,topSingles,channels,languages,generes});
}
});

})

//fetch web series
router.get('/webseries',(req,res)=>{
async.parallel([
function(callback) {
db.collection('mapping').find({},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,mediaId:1}}).sort({insertedOn:-1}).toArray(function(error,result1){
if (error){
callback(error);
} 
return callback(null,result1);
})
},
// function(callback) {
// sqldb.query("SELECT * FROM media_language",function (err,rows2,fields) {
// if (err) {
// return callback(err);
// }
// var result2=JSON.stringify(rows2);
// return callback(null,result2);
// });
// },

function(callback) {
sqldb.query("SELECT * FROM series_category", function (err, rows3, fields) {
if (err){
callback(err);
} 
var result3=JSON.stringify(rows3);
return callback(null,result3);
});
}
], function(error, callbackResults) {
if (error) {
//handle error
console.log(error);
} else {
const series=callbackResults[0];
// const languages=callbackResults[1];
const generes=callbackResults[1];
return res.status(200).send({series,generes});
}
});
})

//fetch kIDs Section
router.get('/shortFilms',(req,res)=>{
async.parallel([
function(callback) {
db.collection('media').find({},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,mediaId:1}}).sort({insertedOn:-1}).toArray(function(error,result1){
if (error){
callback(error);
} 
return callback(null,result1);
})
}
], function(error, callbackResults) {
if (error) {
//handle error
console.log(error);
} else {
const recentSeries=callbackResults[0];
return res.status(200).send({recentSeries});
}
});
})

//fetch Channels
router.get('/channels',(req,res)=>{

sqldb.query("SELECT * FROM popular_channel;", function (err, rows1, fields) {
if (err){
console.log('error in fetching channels')
} 
var channels=JSON.stringify(rows1);
return res.status(200).send({channels})
});

})

//fetch channels details
router.get('/channel/detail/:publisher',(req,res)=>{
async.parallel([
function(callback) {
if(req.params.publisher){
db.collection('mapping').find({$text:{$search:req.params.publisher}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,URL:1,mediaId:1,tags:1}}).toArray(function (error,searchResult){
if (error) { 
//res.send({searchResult:null})
console.log(error); 
}
if(searchResult){
callback(null,searchResult)
}
})
}
},
function(callback){
if(req.params.publisher){
db.collection('media').find({$text:{$search:req.params.publisher}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,mediaId:1,tags:1}}).toArray(function (error,searchResult1){
if (error) { 
//res.send({searchResult:null})
console.log(error); 
}
callback(null,searchResult1)
})
}
},
function(callback){
if(req.params.publisher){
db.collection('kidsMapping').find({$text:{$search:req.params.publisher}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,URL:1,mediaId:1,tags:1}}).toArray(function (error,searchResult2){
if (error) { 
//res.send({searchResult:null})
console.log(error); 
}
callback(null,searchResult2)
})
}
},
function(callback){
if(req.params.publisher){
db.collection('kidsMedia').find({$text:{$search:req.params.publisher}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,URL:1,mediaId:1,tags:1}}).toArray(function (error,searchResult3){
if (error) { 
//res.send({searchResult:null})
console.log(error); 
}
callback(null,searchResult3)
})
}
}
], function(error, callbackResults) {
if (error) {
//handle error
console.log(error);
} else {
var filterData=callbackResults.filter(function (el) {
  return el.length;
});
var channelData=[].concat.apply([],filterData);
return res.status(200).send({channelData});
}
});

})
//Fetch single post
router.get('/post/:id', (req, res) => {
db.collection('media').find({_id: new ObjectID(req.params.id.trim())}, {fields: {title: 1}}).toArray(function (error, post) {
if (error) { console.error(error); }
res.send(post)
})
})

router.get('/media/details/:id,:tokenId', (req, res) => {
async.parallel([
function(callback) {
if(req.params.tokenId!=='5324@!!$00'){
jwt.verify(req.params.tokenId,'secret',function(err,decoded){
if(decoded._id){
db.collection('contentViewed').insertOne({userId:new ObjectID(decoded._id),mediaId:req.params.id,viewedOn:new Date})
}
else{
console.log('no user')
}
})
}
return callback(null,[])
},
function(callback){
if(req.params.id.match(/^WS/))
{
db.collection('mapping').find({mediaId:{ $eq:req.params.id}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,Episodes:1,mediaId:1,viewCount:1}}).toArray(function(error,data){
if(data.length){
const seriesEpisodes=data[0].Episodes;
db.collection('mapping').updateOne({_id:data[0]._id},{$inc:{viewCount:1}}).then(function(result,err){
return callback(null,seriesEpisodes)
})
}
else{
return callback(null,[])
}
})
}
else{
return callback(null,[])
}
},
function(callback){
if(req.params.id.match(/^KS/))
{
db.collection('kidsMapping').find({mediaId:{ $eq:req.params.id}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,Episodes:1,mediaId:1,viewCount:1}}).toArray(function(error,data){
if(data.length){
const kidsEpisodes=data[0].Episodes;
// console.log('kidsEpisodes',kidsEpisodes)
db.collection('kidsMapping').updateOne({_id:data[0]._id},{$inc:{viewCount:1}}).then(function(result1,err){
return callback(null,kidsEpisodes)
})
}
else{
return callback(null,[])
}
})
}
else{
return callback(null,[])
}
},
function(callback){
if(req.params.id.match(/^SF/))
{
db.collection('media').find({mediaId:{ $eq:req.params.id}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,mediaId:1,viewCount:1}}).toArray(function(error,media){
if(media.length){
db.collection('media').updateOne({_id:media[0]._id},{$inc:{viewCount:1}}).then(function(result,err){
return callback(null,media)
})
}
else{
return callback(null,[])
}
})
}
else
{
	return callback(null,[])
}
},
function(callback){
if(req.params.id.match(/^KSF/))
{
db.collection('kidsMedia').find({mediaId:{ $eq:req.params.id}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,mediaId:1,viewCount:1}}).toArray(function(error,kidsMedia){
if(kidsMedia.length){
db.collection('kidsMedia').updateOne({_id:new ObjectID(kidsMedia[0]._id)},{$inc:{viewCount:1}}).then(function(result,err){
return callback(null,kidsMedia)
})
}
else{
return callback(null,[])
}
})
}
else{
return callback(null,[])
}
},
function(callback){
if(req.params.id.match(/^WSE/))
{
db.collection('Episodes').find({mediaId:{ $eq:req.params.id}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,mediaId:1,viewCount:1}}).toArray(function(error,seriesEpisode){
if(seriesEpisode.length){
return callback(null,seriesEpisode)
}
else{
return callback(null,[])
}
})
}
else{
return callback(null,[])
}
},
function(callback){
if(req.params.id.match(/^KSE/))
{
db.collection('kidsEpisodes').find({mediaId:{ $eq:req.params.id}},{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,mediaId:1,viewCount:1}}).toArray(function(error,kidsEpisode){
if(kidsEpisode.length){
return callback(null,kidsEpisode)
}
else{
return callback(null,[])
}
})
}
else{
return callback(null,[])
}
}
],function(error, callbackResults) {
if (error) {
//handle error
console.log(error);
} else {
var filterData=callbackResults.filter(function (el) {
  return el.length;
});
const Episodes=filterData[0];
return res.status(200).send({Episodes});
}
}) 
})

//single postData for viewCount and action count

router.post('/singlePostData',(req,res)=>{

db.collection('media').findOne({_id:new ObjectID(req.body.id)}).then(function(data){

const newViewCount=data.viewCount+1;

if(req.body.tokenId){

jwt.verify(req.body.tokenId,'secret',function(err,decoded){

if(decoded._id){

db.collection('contentViewed').insertOne({userId:new ObjectID(decoded._id),mediaId:new ObjectID(data._id),viewedOn:new Date})

}

else{

console.log('unauthorized user')

}

})

}

db.collection('media').updateOne({_id:data._id},{$set:{viewCount:newViewCount}}).then(function(result,err){

console.log('media collection started');

})

})

})

//series post data for viewcount and actioncount

router.post('/seriesPostData',(req,res)=>{
db.collection('Episodes').findOne({_id:new ObjectID(req.body.id)}).then(function(data){
const newViewCount=data.viewCount+1;
if(req.body.tokenId){
jwt.verify(req.body.tokenId,'secret',function(err,decoded){
if(decoded._id){
db.collection('contentViewed').insertOne({userId:new ObjectID(decoded._id),mediaId:new ObjectID(data._id),viewedOn:new Date})
}
else{
console.log('unauthorized user')
}
})
}

db.collection('Episodes').updateOne({_id:data._id},{$set:{viewCount:newViewCount}}).then(function(result,err){

db.collection('mapping').updateOne(

{_id:data.seriesId},

{$set:{"Episodes.$[elem].viewCount":newViewCount}},

{ arrayFilters: [ { "elem._id": data._id } ] }

).then(function(result,err){

console.log('series updated successfully')
})

})

})

})

//For rating a post - tbd
router.post('/posts', (req, res) => {
jwt.verify(req.body.tokenId,'secret',function(err,decoded){
if(decoded._id){

db.collection('mediaRating').insertOne({id:new ObjectID(req.body.id),userId:new ObjectID(decoded._id),mediaId:req.body.mediaId,title:req.body.title,thumbnail:req.body.thumbnail,Rating:req.body.rating,family_safe:req.body.family_safe,review:req.body.review,createdOn:new Date}).then(function(rating){

res.status(200).send({result: 'rating saved successfully'});

})

}

else{

res.status(200).send({result:'unauthorized user'})
}
})
});

//Fetch to display album in order to add new media by internal member
router.get('/getExistingAlbum', (req, res) => {
db.collection('mapping').find({}, {fields: {_id:1, title: 1, thumbnail: 1, publisher: 1}}).toArray(function(error, albumPosts) {
if (error) { console.error(error); }
res.send({albumPosts})
})
});


router.post('/extensionData',(req,res)=>{

console.log(req.body);
res.status(200).send({result:'data submitted successfully'})

})

router.post('/favorite',(req,res)=>{
jwt.verify(req.body.userToken,'secret',function(err,decoded){
if(decoded._id){
db.collection('Users').find({_id:new ObjectID(decoded._id)}).toArray(function(err,data){
if(err){res.status(401).send({error:'Unauthorized access'})}
db.collection('userWatchlist').insertOne(
{userId:new ObjectID(decoded._id),id:req.body.media._id,mediaId:req.body.media.mediaId,thumbnail:req.body.media.thumbnail,title:req.body.media.title,Rating:req.body.media.Rating,publisher:req.body.media.publisher,insertedOn:new Date})
.then(function(error,output){
return res.status(200).send({result:'success'});
})
}) 
}
else{
return res.status(401).send({result:'Invalid user token'});
}
})
})

//recommendation logic
router.get('/recommendations/:userToken',(req,res)=>{
async.waterfall([
function(callback) {
jwt.verify(req.params.userToken,'secret',function(err,decoded){
var user_Id='';
if(decoded){
user_Id=decoded._id
callback(null,user_Id)
}
else{
callback(null,user_Id)
}
})
},
function(id,callback){
var userInterests='';
if(id){
db.collection('Users').findOne({_id:new ObjectID(id)}).then(function(data){

userInterests=data.interests.map(a=>a.category);

callback(null,userInterests);

})
}
else{
callback(null,userInterests)
}
},
function(userInterests,callback){
if(userInterests){
async.parallel([
function(callback) {
db.collection('mapping').find({ "categories.genres": { $in:userInterests} },{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,mediaId:1}}).sort({insertedOn:1}).limit(3).toArray(function(error,result1){
if (error){
callback(error);
}
db.collection('userWatchlist').estimatedDocumentCount().then((count)=>{
if(count>0){
db.collection('userWatchlist').aggregate([
{$group:{ _id : "$userId",favId:{ $push: "$id" }}}
]).toArray(function(err,favorites){
let favorite=favorites.map(fav => fav.favId);
for(let i=0;i<result1.length;i++){
if(favorite[0].includes(result1[i]._id.toString())){
result1[i].isfavorite=true
}
else{
result1[i].isfavorite=false
}
}
return callback(null,result1)
})
}
else
{
for(let i=0;i<result1.length;i++){
result1[i].isfavorite=false
}
return callback(null,result1)
}
})	
})
},

function(callback) {
db.collection('media').find({ "categories.genres": { $in:userInterests} },{fields:{title:1,thumbnail:1,publisher:1,Rating:1,tags:1,URL:1,mediaId:1,}}).sort({insertedOn:1}).limit(2).toArray(function(error,result2){
if (error){
callback(error);
}
db.collection('userWatchlist').estimatedDocumentCount().then((count)=>{
if(count>0){
db.collection('userWatchlist').aggregate([
{$group:{ _id : "$userId",favId:{ $push: "$id" }}}
]).toArray(function(err,favorites){
let favorite=favorites.map(fav => fav.favId);
for(let i=0;i<result2.length;i++){
if(favorite[0].includes(result2[i]._id.toString())){
result2[i].isfavorite=true
}
else{
result2[i].isfavorite=false
}
}
return callback(null,result2)
})
}
else{
for(let i=0;i<result2.length;i++){
result2[i].isfavorite=false
}
return callback(null,result2)
}
})	 
})
}
],function(error, callbackResults) {
if (error) {
//handle error
console.log(error);
} else {
const recommendedSeries=callbackResults[0];
const recommendedSingles=callbackResults[1];
return res.status(200).send({recommendedSeries,recommendedSingles,userAuth:true});
}
});
}
else{
return res.status(200).send({userAuth:false})
}
}
],function(error,result){

if(error){console.log(error)}
console.log('success');
})

})



//filter webseries
router.get('/filteredseries/:query',(req,res)=>{

console.log(req.params.query)
db.collection('mapping').find({"categories.genres":req.params.query}).toArray(function(err,data){

if(err){console.log(err)}

return res.status(200).send({series:data})

})

})
module.exports=router;