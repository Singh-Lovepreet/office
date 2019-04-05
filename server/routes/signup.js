const express=require('express');
const abc=express();
const router =express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;
const send=require('../helpers/signupEmail');
var crypto=require('crypto');
//signup request handler
router.post('/signup',(req, res) =>{

db.collection('Users').findOne({EmailID:req.body.EmailID}).then(function(user) {
if(user){
res.send({error:'Email Id already exists'})
}
else{
bcrypt.genSalt(10, function(err, salt) {
bcrypt.hash(req.body.Password, salt, function(err, hash) {
if(err) {
res.send(err)
}
else{
db.collection('Users').insertOne({Name:req.body.Name, EmailID:req.body.EmailID, Password:hash,verifiedUser:false,userToken:'',interests:''}).then(function(newUser){
const user=newUser['ops'];
const tokenId=jwt.sign({EmailID:user[0].EmailID.trim(),_id:user[0]._id},'secret',{expiresIn: '2 days'});

db.collection('Users').updateOne({_id:user[0]._id},{$set:{userToken:tokenId}}).then(function(data){

// return res.status(200).send({result: 'Authenticated', token:tokenId,EmailID:user.EmailID,Name:user.Name});
db.collection('userToken').insertOne({userId:user[0]._id,email:user[0].EmailID,token:crypto.randomBytes(16).toString('hex'),createdAt:new Date}).then(function(data){
const token=data['ops'];
if(err){ return res.status(500).send({ error: err.message }); }
const link=req.headers.origin +"/verify?email="+token[0].email+"&token="+token[0].token;
send.verifyEmail(req.body.Name,req.body.EmailID,link)
res.status(200).send({result: 'success',token:tokenId});
})
}) 
})     
}
})
})
} 
})
});

//interests
router.post('/userInterests',(req,res)=>{
const userInterests=[];
for(let i=0;i<req.body.interests.length;i++){
userInterests.push({id:i,category:req.body.interests[i]});
}
jwt.verify(req.body.tokenId,'secret',function(err,decoded){
if(decoded._id){
db.collection('Users').findOne({_id:new ObjectID(decoded._id)}).then(function(user,err){

if(err){res.status(401).send({error:'user doesnot exists'})}
db.collection('Users').updateOne({_id:user._id},{$set:{interests:userInterests}}).then(function(data){

return res.status(200).send({result: 'success'});

})
})
}
else{
res.send('invalid token');
}
});
})

//verification handler send after successfull login
router.get('/verification/:token',(req,res)=>{

db.collection('userToken').findOne({token:req.params.token}).then(function(token,err){
if(!token){return res.status(500).send({error:'invalid token id'});}
db.collection('Users').findOne({_id:token.userId}).then(function(user){
if(user.verifiedUser){return res.status(400).send({error:'user is already verified'})}
db.collection('Users').updateOne({_id:user._id},{ $set:{verifiedUser:true}}).then(function(user,err){
if(err){return res.status(400).send({result:err.message});}
res.status(200).send({result:"The account has been verified"});
})
})
})

});

module.exports=router;








