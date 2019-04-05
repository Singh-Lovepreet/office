const express=require('express');
const abc=express();
var request = require("request");
const router =express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('.././config/config');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(config.GOOGLE_APP_ID);


//local login
router.get('/login/:EmailID,:Password', (req, res) => {
db.collection('Users').findOne({EmailID:req.params.EmailID.trim()}).then(function(user) {
bcrypt.compare(req.params.Password, user.Password,(err, Match)=>{
if (err) {console.log(err)}
if(Match){
const tokenId=jwt.sign({
EmailID: req.params.EmailID.trim(),
_id: user._id
},
'secret',
{
expiresIn: '30 days'
});

db.collection('Users').updateOne({_id:user._id},{$set:{userToken:tokenId}}).then(function(data){
return res.status(200).send({result: 'Authenticated', token:tokenId,EmailID:user.EmailID,Name:user.Name});
})

}
else{res.send({error: 'Unauthenticated Access'});}

});
})
.catch(error => {return res.status(500).send({error: error})});
});

//fb login
router.post('/fblogin', (req, res) => {

const userToken=req.body.authResponse.accessToken
const profile=req.body.Profile   
request('https://graph.facebook.com/debug_token?input_token='+userToken+'&access_token='+config.FACEBOOK_ACCESS_TOKEN,(err,response, body)=>{
var result=JSON.parse(body);
if(result.data.is_valid){
db.collection('Users').findOne({userID:result.data.user_id}).then(function(user){
if(user){
const tokenId=jwt.sign({
userID:user.userID,
_id:user._id
},
'secret',
{
expiresIn: '30 days'
});
db.collection('Users').updateOne({_id:user._id},{$set:{fbToken:tokenId}}).then(function(data){
res.status(200).send({result: 'Authenticated', fbToken:tokenId});
})
}
else{
db.collection('Users').insertOne({userID:result.data.user_id,Name:profile.name,EmailID:profile.email,accessToken:userToken,fbToken:'',createdAt:new Date}).then(function(newUser){
const user=newUser['ops'];
const tokenId=jwt.sign({
userID:user[0].userID,
_id:user[0]._id
},
'secret',
{
expiresIn: '30 days'
});
db.collection('Users').updateOne({_id:user[0]._id},{$set:{fbToken:tokenId}}).then(function(data){
res.status(200).send({result: 'Authenticated', fbToken:tokenId});
})

})
}
})
}
});
});

//google login
router.post('/googlelogin',(req,res)=>{
async function verify() {
const ticket = await client.verifyIdToken({
idToken:req.body.idToken,
audience:config.GOOGLE_APP_ID
});
const payload = ticket.getPayload();
//insert data in database
if(payload){
db.collection('Users').findOne({userID:payload.sub}).then(function(user){
if(user){
const tokenId=jwt.sign({
userID:payload.sub,
_id:user._id
},
'secret',
{
expiresIn: '30 days'
});
db.collection('Users').updateOne({_id:user._id},{$set:{googleToken:tokenId}}).then(function(data){
res.status(200).send({result: 'Authenticated', googleToken:tokenId});
})
}
else{
db.collection('Users').insertOne({userID:payload.sub,Name:payload.name,EmailID:payload.email,accessToken:req.body.idToken,googleToken:'',createdAt:new Date}).then(function(newUser){
const user=newUser['ops'];
const tokenId=jwt.sign({
userID:user[0].userID,
_id:user[0]._id
},
'secret',
{
expiresIn: '30 days'
});
db.collection('Users').updateOne({_id:user[0]._id},{$set:{googleToken:tokenId}}).then(function(data){
res.status(200).send({result: 'Authenticated', googleToken:tokenId});
})

})
}
})   
}
}
verify().catch(console.error);
})


module.exports=router;