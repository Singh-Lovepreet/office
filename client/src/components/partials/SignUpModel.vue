
<template>
<transition name="modal-fade">
<div class="modal-backdrop">
<div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
<div v-if="!registered">
<header class="modal-header" id="modalTitle">
<slot name="header">
<h1 id="left">Create an Account</h1>
<p  @click="close" aria-label="Close modal" id="right" style="font-weight: bold">X</p>
</slot>
</header>    
<section class="modal-body" id="modalDescription">
<div class="left">
<form @submit.prevent="handleSubmit">
<input type="text" name="Name" v-model="Name" v-validate="'required'" placeholder="Enter full name"/>
<p class="text-danger" v-if="submitted && errors.has('Name')">{{ errors.first('Name') }}</p>
<input type="email" name="EmailId" v-model="EmailId" placeholder="E-mail Id" v-validate="'required|email'"/>
<p class="text-danger" v-if="submitted && errors.has('EmailId')">{{ errors.first('EmailId') }}</p>
<input type="password" name="Password" v-model="Password" placeholder="Password" v-validate="{ required: true, min: 6 }"/>
<p class="text-danger" v-if="submitted && errors.has('Password')">{{ errors.first('Password') }}</p>
<input type="text" name="Captcha" v-model="Captcha" v-validate="'required'" placeholder="Enter the Captcha Code"/>
<p class="text-danger" v-if="submitted && errors.has('Captcha')">{{ errors.first('Captcha') }}</p>
<div style="display: flex; flex-direction: row;align-items: center;text-align: center;">
<h5 id="captcha">{{captchaCode}}</h5>
<i class="fa fa-refresh ml-4 fa-2x" aria-hidden="true" @click="generateCaptcha()"></i>            
</div>
<input type="submit" name="signup_submit" value="Sign Up"/>
</form>
</div>
<div class="right">
<button class="social-signin facebook" @click="openFbLoginDialog"><fa icon="facebook" class="mr-3"/>Log in with facebook</button>
<button class="social-signin twitter"><fa icon="twitter" class="mr-3"/>Log in with Twitter</button>
<p>Already have an account?<a @click="$emit('swap-form')">Signin</a></p>
<p><hr></p>
</div>
<div class="or">OR</div>
</section>
</div>

<div v-if="registered&&!interests">
<header class="modal-header" id="modalTitle">
<slot name="header">
<h1 id="left">Welcome to Yawnmeter</h1>
<p  @click="close" aria-label="Close modal" id="right" style="font-weight: bold">X</p>
</slot>
</header>
<section class="modal-body" id="modalDescription" style="text-align: center;margin-top:5px">
<h4 style="font-weight: bold;">Pick Your Interests(min 2 and max 5)</h4>
<div style="width:70%;align-items: center;margin:0 auto;">
<md-checkbox v-for="post in Interests"  class="md-primary"
v-model="userInterests" :value="post.name" :key="post.id">{{post.name}}</md-checkbox>
</div>
<button @click="submitInterests()" type="button" class="btn" style="background-color: green" :disabled="!checked">Continue</button>
</section>
</div>


<div v-if="registered&&interests">
  <header class="modal-header" id="modalTitle">
  <slot name="header">
  <h1 id="left">Welcome to Yawnmeter</h1>
  <p  @click="close" aria-label="Close modal" id="right" style="font-weight: bold">X</p>
  </slot>
  </header>
  <section class="modal-body" id="modalDescription" style="text-align: center;margin-top: 20%">
  <h1 style="font-weight: bold;">Thankyou for registering at yawnmeter</h1>
  <h3 style="color: #fc8080">Please check your mail box to verify your account</h3>
  </section>
</div>



</div>
</div>
</transition>
</template>
<script>
import {Fa} from 'mdbvue';
import PostsService from '@/services/PostsService';
export default {
name: 'SignUpModel',
components:{

Fa
},

data(){
return{
captchaCode:'',
EmailId: '',
Password: '',
Name: '',
Captcha:'',
submitted: false,
registered:false,
interests:false,
Interests:[
{id:1, name:'Action'},
{id:2, name:'Animation'},
{id:3, name:'Biography'},
{id:4, name:'Classics'},
{id:5, name:'Comedy'},
{id:6, name:'Crime'},
{id:7, name:'Documentary'},
{id:8, name:'Drama'},
{id:9, name:'Entertainment'},
{id:10,name:'Family'},
{id:11,name:'History'},
{id:12,name:'Horror'},
{id:13,name:'Kids'},
{id:14,name:'Musical'},
{id:15,name:'Mystery'},
{id:16,name:'Political'},
{id:17,name:'Religious'},
{id:18,name:'Romance'},
{id:19,name:'Satire'},
{id:20,name:'Sci-Fi'},
{id:21,name:'Sports'},
{id:22,name:'Thriller'},
{id:23,name:'Travel'},
{id:24,name:'Wildlife'}
],
userInterests:[]
}
},

computed:{
checked(){

if(this.userInterests.length >=2&&this.userInterests.length<=5){
return true;
}

}
},
methods: {

generateCaptcha:function(){
var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y',
'Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '0','1','2','3','4','5','6','7','8','9');
var i;
for (i=0;i<4;i++){
var a = alpha[Math.floor(Math.random() * alpha.length)];
var b = alpha[Math.floor(Math.random() * alpha.length)];
var c = alpha[Math.floor(Math.random() * alpha.length)];
var d = alpha[Math.floor(Math.random() * alpha.length)];
}
var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d;
this.captchaCode=code;
},

handleSubmit() {
this.submitted = true;
this.$validator.validate().then(valid => {
if (valid) {    
this.signup();
}
});
},
async signup(){
const codegenerated=this.captchaCode.split(' ').join('');
if(codegenerated==this.Captcha){
const response = await PostsService.signup({
Name: this.Name,
EmailID: this.EmailId,
Password: this.Password
});
if(response.data.token) {
const token=response.data.token
this.$store.dispatch('login_auth',token).then(()=>{
this.registered=true 
})
}
}
else{

alert('wrong Captcha code');
this.generateCaptcha();

}
},

async submitInterests(){
const token=this.$store.getters.authHeader;
console.log(token);
if(token){
const response=await PostsService.userInterests({
tokenId:token,
interests:this.userInterests
})
if(response.data.result){
this.interests=true;
var self = this;
setTimeout(function(){ 
self.$router.push({ name: 'Dashboard' });
},2000); 
}

}
},
openFbLoginDialog () {
FB.login(this.checkLoginState, { scope: 'email' })
},
checkLoginState: function (response) {
const self=this;
if(response.status === 'connected') {
FB.api('/me', { fields: 'name,email' }, function(profile) {
console.log('Good to see you, ' + profile.name + '.');
console.log(profile);
self.$router.push({ name: 'Dashboard' });
});
} else if (response.status === 'not_authorized') {
// the user is logged in to Facebook, 
// but has not authenticated your app
} else {

}
},
close() {

this.$emit('close');
},
},

beforeMount(){
this.generateCaptcha()
},
};
</script>

<style scoped>
.modal-fade-enter-active {
animation: bounce-in .4s;
animation-timing-function: cubic-bezier(.71,.55,.62,1.57);
}
.modal-fade-leave-active {
transition:all 0s ease-out; 
}
@keyframes bounce-in {
from {
opacity: 0;
transform: scale(.9, .9);
}
to {
opacity: 1;
transform: scale(1, 1);
}
}
.modal-backdrop {
position: fixed;
top: 0;
bottom: 0;
left: 0;
right: 0;
background-color: rgba(0, 0, 0, 0.3);
display: flex;
justify-content: center;
align-items: center;
}

.modal {
background: #fff;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
max-height: calc(100% - 100px);
position: fixed;
top:50%;
left:50%;
transform: translate(-50%, -50%);
width:60%;
height:500px;
}

.modal-header,
.modal-footer {
padding: 30px;
display: flex;
}



.modal-body {
position: relative;
padding: 20px 10px;
}


.left {
position: absolute;
top: 0;
left: 0;
box-sizing: border-box;
padding: 20px 10px 40px 40px;
width: 100%;
height: 100%;
}

#left{
position: absolute;
top: 0;
left: 0;
box-sizing: border-box;
width: 100%;
padding: 10px;
height: 100%;
}

h1 {
font-weight: 300;
font-size: 28px;
text-align: center;
}

input[type="text"],
input[type="password"],input[type="email"]{
display: block;
box-sizing: border-box;
margin-bottom: 10px;
padding: 4px;
width: 260px;
height: 32px;
border: none;
border-bottom: 1px solid #AAA;
font-family: 'Roboto', sans-serif;
font-weight: 400;
font-size: 15px;
transition: 0.2s ease;
}

input[type="text"]:focus,
input[type="password"]:focus,input[type="email"]:focus {
border-bottom: 2px solid #16a085;
color: #16a085;
transition: 0.2s ease;
}

input[type="submit"] {
margin-top: 20px;
width: 250px;
height: 32px;
background: #16a085;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
text-transform: uppercase;
transition: 0.1s ease;
cursor: pointer;
}

input[type="submit"]:hover,
input[type="submit"]:focus {
opacity: 0.8;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
transition: 0.1s ease;
}

input[type="submit"]:active {
opacity: 1;
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
transition: 0.1s ease;
}

.or {
position: absolute;
top: 100px;
left: 400px;
width: 40px;
height: 40px;
background: #DDD;
border-radius: 50%;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
line-height: 40px;
text-align: center;
}

p:hover{

cursor: pointer;
}
.right {
position: absolute;
top: 0;
right: 0;
box-sizing: border-box;
padding: 20px;
width: 300px;
height: 400px;
background-size: cover;
background-position: center;
border-radius: 0 2px 2px 0;
margin-top:1%
}
#right{

position: absolute;
top: 0;
right: 0;
float: right;
padding:10px 20px;
color: #fc8080;
font-size: 20px;
background: transparent;

}
.right .loginwith {
display: block;
margin-bottom: 40px;
font-size: 28px;
color: #FFF;
text-align: center;
}

button.social-signin {
margin-bottom: 20px;
width: 220px;
height: 36px;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
transition: 0.2s ease;
cursor: pointer;
}

button.social-signin:hover,
button.social-signin:focus {
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
transition: 0.2s ease;
}

button.social-signin:active {
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
transition: 0.2s ease;
}

button.social-signin.facebook {
background: #32508E;
}

button.social-signin.twitter {
background: #55ACEE;
}

button.social-signin.google {
background: #DD4B39;
}

.btn-close:hover{

cursor: pointer;
}

.fa-refresh:hover{

cursor: pointer;

}

h5{

background-color:#ccc;
position:relative;
border:1px solid grey;
width:200px;
padding: 5px;
margin-bottom: 0;

}
.text-danger{

margin-top:0;
font-size:10px;
padding: 0;
font-weight: bold

}




@media (min-width: 320px) and (max-width: 480px) {

.modal {
background: #fff;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
max-height: calc(100% - 50px);
position: fixed;
top:50%;
left:50%;
transform: translate(-50%, -50%);
width: 90%;
height:90%;
overflow-y: scroll;
}
.modal-header,
.modal-footer {
padding: 20px;
display: flex;
}

.left {
position: absolute;
top: 100px;
left: 0;
box-sizing: border-box;
padding:10px;
width: 100%;
display: flex;
flex-direction: column;
text-align: center;
align-items: center;
z-index: 1000;
margin-top:5px;
}
#left{
position: absolute;
top: 0;
left: 0;
box-sizing: border-box;
width: 100%;
padding: 10px;
height: 100%;

}

h1 {
font-weight: 300;
font-size: 14px;
text-align: center;
}

input[type="text"],
input[type="password"],input[type="email"] {
display: block;
box-sizing: border-box;
margin-bottom:10px;
padding: 4px;
width: 250px;
height: 24px;
border: none;
border-bottom: 1px solid #AAA;
font-family: 'Roboto', sans-serif;
font-weight: 400;
font-size: 12px;
transition: 0.2s ease;
}

input[type="submit"] {
margin-top:20px;
margin-bottom: 10px;
width: 200px;
height:30px;
background: #16a085;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
text-transform: uppercase;
transition: 0.1s ease;
cursor: pointer;
}

.or {
display: none;
}

.right {
position:absolute;
box-sizing: border-box;
top:0;
padding:10px;
width:100%;
background-size: cover;
background-position: center;
border-radius: 0 2px 2px 0;
margin-top: 1%;
display: flex;
flex-direction: column;
text-align: center;
align-items: center;
}
#right{
position: absolute;
top: 0;
right: 0;
float: right;
padding:10px 20px;
color: #fc8080;
font-size: 20px;
background: transparent;

}

button.social-signin {
margin-bottom:10px;
width: 200px;
height: 24px;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
transition: 0.2s ease;
cursor: pointer;
}

#captcha{

background-color:#ccc;
position:relative;
border:1px solid grey;
width:150px;
padding:1px;
margin-bottom: 0;
}

}

@media screen and  (min-width: 481px) and (max-width: 767px) {

.modal {
background: #fff;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
max-height: calc(100% - 50px);
position: fixed;
top:30%;
left: 50%;
transform: translate(-50%, -50%);
width: 90%;
height:400px;
overflow-y: scroll;
}
.left {
position: absolute;
top: 100px;
left: 0;
padding:20px 60px;
width: 100%;
height:100%;
display: flex;
flex-direction: column;
text-align: center;
z-index: 1000;
margin-top:5px;
}
#left{
position: absolute;
top: 0;
left: 0;
box-sizing: border-box;
width: 100%;
padding: 10px;
height: 100%;

}

h1 {
font-weight: 300;
font-size: 14px;
text-align: center;
}

input[type="text"],
input[type="password"],input[type="email"] {
display: block;
box-sizing: border-box;
margin-bottom:10px;
padding:4px;
width:100%;
height:24px;
border: none;
border-bottom: 1px solid #AAA;
font-family: 'Roboto', sans-serif;
font-weight: 400;
font-size:14px;
transition: 0.2s ease;
}

input[type="submit"] {
margin-top:20px;
width:50%;
height:30px;
background: #16a085;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
text-transform: uppercase;
transition: 0.1s ease;
cursor: pointer;
margin-bottom: 5%
}


.or {
display: none;
}

.right {
position:absolute;
box-sizing: border-box;
top:0;
padding:10px;
width:100%;
background-size: cover;
background-position: center;
border-radius: 0 2px 2px 0;
margin-top: 1%;
display: flex;
flex-direction: column;
text-align: center;
align-items: center;
}
#right{
position: absolute;
top: 0;
right: 0;
float: right;
padding:10px 20px;
color: #fc8080;
font-size: 20px;
background: transparent;

}

button.social-signin {
margin-bottom:10px;
width: 200px;
height: 28px;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
transition: 0.2s ease;
cursor: pointer;
}

#captcha{

background-color:#ccc;
position:relative;
border:1px solid grey;
width:150px;
padding:1px;
margin-bottom: 0;
}
}

@media screen and (min-width: 768px) and (max-width:991px){

.modal {
background: #fff;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
max-height: calc(100% - 50px);
position: fixed;
top:30%;
left: 50%;
transform: translate(-50%, -50%);
width: 90%;
height:400px;
overflow-y: scroll;
}
.left {
position: absolute;
top: 100px;
left: 0;
padding:20px 60px;
width: 100%;
height:100%;
display: flex;
flex-direction: column;
text-align: center;
z-index: 1000;
margin-top:5px;
}
#left{
position: absolute;
top: 0;
left: 0;
box-sizing: border-box;
width: 100%;
padding: 10px;
height: 100%;

}

h1 {
font-weight: 300;
font-size: 14px;
text-align: center;
}

input[type="text"],
input[type="password"],input[type="email"] {
display: block;
box-sizing: border-box;
margin-bottom:10px;
padding:4px;
width:100%;
height:24px;
border: none;
border-bottom: 1px solid #AAA;
font-family: 'Roboto', sans-serif;
font-weight: 400;
font-size:14px;
transition: 0.2s ease;
}

input[type="submit"] {
margin-top:20px;
width:50%;
height:30px;
background: #16a085;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
text-transform: uppercase;
transition: 0.1s ease;
cursor: pointer;
margin-bottom: 5%
}


.or {
display: none;
}

.right {
position:absolute;
box-sizing: border-box;
top:0;
padding:10px;
width:100%;
background-size: cover;
background-position: center;
border-radius: 0 2px 2px 0;
margin-top: 1%;
display: flex;
flex-direction: column;
text-align: center;
align-items: center;
}
#right{
position: absolute;
top: 0;
right: 0;
float: right;
padding:10px 20px;
color: #fc8080;
font-size: 20px;
background: transparent;

}

button.social-signin {
margin-bottom:10px;
width: 200px;
height: 28px;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
transition: 0.2s ease;
cursor: pointer;
}

#captcha{

background-color:#ccc;
position:relative;
border:1px solid grey;
width:150px;
padding:1px;
margin-bottom: 0;
}
}

@media screen and (min-width:992px) and (max-width:1024px){

.modal {
background: #fff;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
max-height: calc(100% - 100px);
position: fixed;
top:40%;
left: 50%;
transform: translate(-50%, -50%);
width:80%;
}

}
</style>
