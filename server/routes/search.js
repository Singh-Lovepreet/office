const express=require('express');
const abc=express();
const router =express.Router();
var async=require('async');
//search functionality
router.get('/search/:query',(req,res)=>{
async.parallel([
function(callback) {
if(req.params.query){
db.collection('mapping').find({$text:{$search:req.params.query}},{fields:{title:1,publisher:1,mediaId:1}}).toArray(function (error,searchResult){
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
if(req.params.query){
db.collection('media').find({$text:{$search:req.params.query}},{fields:{title:1,publisher:1,mediaId:1}}).toArray(function (error,searchResult1){
if (error) { 
//res.send({searchResult:null})
console.log(error); 
}
callback(null,searchResult1)
})
}
},
function(callback){
if(req.params.query){
db.collection('kidsMapping').find({$text:{$search:req.params.query}},{fields:{title:1,publisher:1,mediaId:1}}).toArray(function (error,searchResult2){
if (error) { 
//res.send({searchResult:null})
console.log(error); 
}
callback(null,searchResult2)
})
}
},
function(callback){
if(req.params.query){
db.collection('kidsMedia').find({$text:{$search:req.params.query}},{fields:{title:1,publisher:1,mediaId:1}}).toArray(function (error,searchResult3){
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
var searchResult=[].concat.apply([],filterData);
return res.status(200).send({searchResult});
}
});
});

module.exports=router;