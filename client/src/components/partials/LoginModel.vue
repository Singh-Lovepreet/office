
<template>
<transition name="modal-fade">
<div class="modal-backdrop">
<div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
<header class="modal-header" id="modalTitle">
<slot name="header">
<h1 id="left">Login to Yawnmeter</h1>
<p  @click="close" aria-label="Close modal" id="right" style="font-weight: bold">X</p>
</slot>
</header>   
<section class="modal-body" id="modalDescription">

<div class="left">
<form @submit.prevent="handleSubmit">                 
<input type="email" name="EmailId" v-model="EmailId" placeholder="E-mail Id" v-validate="'required|email'"/>
<p class="text-danger" v-if="submitted && errors.has('EmailId')">{{ errors.first('EmailId') }}</p>
<input type="password" name="Password" v-model="Password" placeholder="Password" v-validate="{ required: true}"/>
<p class="text-danger" v-if="submitted && errors.has('Password')">{{ errors.first('Password') }}</p>
<input type="submit" name="login_submit" value="Sign In"/>
<p style="color: red">{{responseStatus}}</p>
<p>Didn't have any account?<a @click="$emit('swap-form')">Signup</a></p>
</form>
</div>

<div class="right">
<button class="social-signin facebook" @click="openFbLoginDialog"><fa icon="facebook" class="mr-3"/>Log in with facebook</button>
<g-signin-button
:params="googleSignInParams"
@success="googleSignIn"
@error="googleSignInError">
<fa icon="google" class="mr-3"/>
Sign in with Google
</g-signin-button>
</div>
<div class="or">OR</div>
</section>
</div>
</div>
</transition>
</template>

<script>
import PostsService from '@/services/PostsService';
import {Fa} from 'mdbvue';
export default {
name: 'LoginModel',
components:{
Fa
},
data () {
return {
EmailId: '',
Password: '',
submitted: false,
responseStatus:'',
googleSignInParams: {
client_id: '827835441205-or1d6pvu17ketaqn9s5knvgunvr8gq6c.apps.googleusercontent.com'
}
};
},
methods: {
handleSubmit() {
this.submitted = true;
this.$validator.validate().then(valid => {
if (valid) {
this.login();
}
});
},

async login(){
const response = await PostsService.login({
EmailID: this.EmailId,
Password: this.Password
});
if(response.data.token) {
const token=response.data.token
this.$store.dispatch('login_auth',token).then(()=>{
this.$router.push({ name: 'Dashboard' });
})
}

else{this.responseStatus='Invalid Email id or password'}

},

openFbLoginDialog () {
FB.login(this.checkLoginState, { scope: 'email' })
},
checkLoginState: function (response) {
const self=this;
if (response.status === 'connected') {
FB.api('/me', { fields: 'name,email' }, function(profile){
const authResponse=response.authResponse;

self.facebookLogin(authResponse,profile);

});
} else if (response.status === 'not_authorized') {
// the user is logged in to Facebook, 
// but has not authenticated your app
} else {

}
},
facebookLogin(authResponse,profile){
const payload={authResponse,profile};
this.$store.dispatch('fb_auth',payload).then(()=>{
this.$router.push({ name: 'Dashboard' });
})
},

googleSignIn(googleUser) {

const payload=googleUser.getAuthResponse().id_token;

this.$store.dispatch('google_auth',payload).then(()=>{

this.$router.push({name:'Dashboard'});

})
},
googleSignInError(error) {
// `error` contains any error occurred.
console.log('google login failed', error)
},
close() {
this.$emit('close');
},
}
};

</script>
<style scoped>

.modal-fade-enter-active {
animation: bounce-in .3s;
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
overflow-x:hidden;
display: flex;
flex-direction: column;
max-height: calc(100% - 100px);
position: fixed;
top:50%;
left:50%;
transform: translate(-50%, -50%);
width:60%;
height:400px
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
padding: 40px 10px 40px 40px;
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
input[type="password"],input[type="email"] {
display: block;
box-sizing: border-box;
margin-bottom: 20px;
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
input[type="password"]:focus {
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
margin-top: 5%
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

.g-signin-button {
/* This is where you control how the button looks. Be creative! */
border-radius:2px;
border:none;
background-color: #3c82f7;
width: 220px;
height: 36px;
cursor: pointer;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
text-align: center;
line-height:40px;
display: inline-block;
}

.g-signin-button:hover,focus{

box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
transition: 0.2s ease;
}

@media screen and (min-width: 320px) and (max-width: 480px) {

.modal {
background: #fff;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
max-height: calc(100% - 100px);
position:fixed;
top:50%;
left:50%;
transform: translate(-50%, -50%);
width:90%;
height:80%;
overflow-x: hidden;
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
margin-top:10px;
width: 200px;
height:28px;
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
height:36px;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
transition: 0.2s ease;
cursor: pointer;
}
.g-signin-button {
/* This is where you control how the button looks. Be creative! */
border-radius:2px;
border:none;
background-color: #3c82f7;
width: 200px;
height:36px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
transition: 0.2s ease;
cursor: pointer;
}
}
@media screen and  (min-width: 481px) and (max-width: 767px) {
.modal {
background: #fff;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
max-height: calc(100% - 100px);
position: fixed;
top:30%;
left: 50%;
transform: translate(-50%, -50%);
width: 90%;
height:400px
}
.modal-body {
position: relative;
padding: 20px 10px;
}
.left {
position: absolute;
top: 0;
left: 0;
padding: 20px 40px ;
width:100%;
height:100%;
display: flex;
flex-direction: column;
text-align: center;
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
margin-top:10px;
width:50%;
height: 28px;
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
position:relative;
box-sizing: border-box;
top: 150px;
padding: 20px;
width:100%;
background-size: cover;
background-position: center;
border-radius: 0 2px 2px 0;
margin-top: 10%;
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
width:80%;
height: 28px;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
transition: 0.2s ease;
cursor: pointer;
}
}

@media screen and (min-width: 768px) and (max-width:991px){
.modal {
background: #fff;
box-shadow: 2px 2px 20px 1px;
overflow-x: auto;
display: flex;
flex-direction: column;
max-height: calc(100% - 100px);
position: fixed;
top:30%;
left: 50%;
transform: translate(-50%, -50%);
width: 90%;
height:450px
}

.modal-body {
position: relative;
padding: 20px 10px;
}


.left {
position: absolute;
top: 0;
left: 0;
padding: 20px 150px ;
width:100%;
height:100%;
display: flex;
flex-direction: column;
text-align: center;
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
margin-top:10px;
width:50%;
height: 28px;
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
position:relative;
box-sizing: border-box;
top: 150px;
padding: 20px;
width:100%;
background-size: cover;
background-position: center;
border-radius: 0 2px 2px 0;
margin-top: 10%;
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
width:60%;
height: 28px;
border: none;
border-radius: 2px;
color: #FFF;
font-family: 'Roboto', sans-serif;
font-weight: 500;
transition: 0.2s ease;
cursor: pointer;
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
top:30%;
left: 50%;
transform: translate(-50%, -50%);
width:80%;
height:400px
}

}
</style>
