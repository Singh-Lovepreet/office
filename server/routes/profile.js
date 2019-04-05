const express=require('express');
const abc=express();
const router =express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;
var async=require('async');
const logger=require('./logger').Logger;

router.get('/profileData/:tokenId', (req, res) => {
var user_Id='';
jwt.verify(req.params.tokenId,'secret',function(err,decoded){
if(decoded){
user_Id=decoded._id
}
});
if(user_Id){
async.parallel([
function(callback){
db.collection('Users').find({_id:new ObjectID(user_Id)}).toArray(function(err,user){
if(err){res.status(401).send({result:'Unauthorized access'})}
callback(null,user);

})
},
function(callback){
db.collection('mediaRating').find({userId:new ObjectID(user_Id)}).toArray(function(err,userRatings){
if(err){res.status(401).send({result:'no content rated yet'})}
callback(null,userRatings)
})

// db.collection('mediaRating').aggregate([
// { $match: {userId:new ObjectID(user_Id)} },
// {$group:{_id:"$id",title : { $first: '$title' }}}
// ]).toArray(function(err,userRatings){

// 	console.log(userRatings)
// 	callback(null,userRatings)
// })
},

function(callback){
db.collection('userWatchlist').find({userId:new ObjectID(user_Id)}).toArray(function(err,watchlists){
if(err){res.status(401).send({result:'no watchlists'})}
callback(null,watchlists)
})
}
], function(error, callbackResults) {
if (error) {
//handle error
console.log(error);
} else {
console.log(callbackResults)
const user=callbackResults[0];
const userRatings=callbackResults[1];
const watchlists=callbackResults[2];
return res.status(200).send({user,userRatings,watchlists,userAuth:true});
}
})
}
else{
return res.status(200).send({userAuth:false})
}
});

module.exports=router;