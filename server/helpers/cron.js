const express=require('express');
const abc=express();
var ObjectID = require('mongodb').ObjectID;
var cron = require("node-cron");
var async=require('async');
module.exports={

Scheduler:function(){

cron.schedule('* * * */12 *', () => {

db.collection('cronTimer').find().toArray(function(err,data){

if(data[0].lastExecutionTime){
var startTime=data[0].lastExecutionTime;
}
else{
startTime=new Date("01-01-2018");
}
var endTime = new Date;
db.collection('cronTimer').updateOne({_id:data[0]._id},{$set:{lastExecutionTime:endTime}}).then(function(result,err){
db.collection('mediaRating').aggregate([
{ $match :{createdOn: { $gt:startTime, $lt:endTime}}},
{$group : {_id : "$id", count : {$sum : 1},total:{ $sum: "$rating" }}}
]).toArray(function(err, results) {

results.forEach(function(data){              
async.parallel([
function(callback){
db.collection('mapping').find({_id:data._id}).toArray(function(err,media){
if(media.length){
var updatedCount=media[0].RatingCount+data.count;
var totalRating=media[0].TotalRatings+data.total;
var average=Math.round(totalRating/updatedCount);
db.collection('mapping').updateOne({_id:media[0]._id},{ $set:{Rating:average,RatingCount:updatedCount,TotalRatings:totalRating}}).then(
function(result,err){
if(err){console.log(err)}
})
}
})            
},

function(callback){
db.collection('media').find({_id:data._id}).toArray(function(err,media){
if(media.length){
var updatedCount=media[0].RatingCount+data.count;
var totalRating=media[0].TotalRatings+data.total;
var average=Math.round(totalRating/updatedCount);
db.collection('media').updateOne({_id:media[0]._id},{ $set:{Rating:average,RatingCount:updatedCount,TotalRatings:totalRating}}).then(
function(result,err){
if(err){console.log(err)}	
})
}
})           
},

function(callback){
db.collection('kidsMapping').find({_id:data._id}).toArray(function(err,media){
if(media.length){
var updatedCount=media[0].RatingCount+data.count;
var totalRating=media[0].TotalRatings+data.total;
var average=Math.round(totalRating/updatedCount);
db.collection('kidsMapping').updateOne({_id:media[0]._id},{ $set:{Rating:average,RatingCount:updatedCount,TotalRatings:totalRating}}).then(
function(result,err){
if(err){console.log(err)}
})
}
})            
},

function(callback){
db.collection('kidsMedia').find({_id:data._id}).toArray(function(err,media){
if(media.length){
var updatedCount=media[0].RatingCount+data.count;
var totalRating=media[0].TotalRatings+data.total;
var average=Math.round(totalRating/updatedCount);
db.collection('kidsMedia').updateOne({_id:media[0]._id},{ $set:{Rating:average,RatingCount:updatedCount,TotalRatings:totalRating}}).then(
function(result,err){
if(err){console.log(err)}	
})
}
})            
}
],function(error, callbackResults) {
console.log('all updated')
})
})
})
})
})
})
}
}

