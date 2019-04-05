<template>
<div class="flexible-content">
<!--Navbar-->
<navbar class="flexible-navbar white" position="top"  href="#" id="d-nav">
<navbar-collapse style="max-height: 320px">
<navbar-nav left>
<router-link to="/">
<a class="logo-wrapper"><img alt=""  src=".././assets/logo.png" /></a>
</router-link>
</navbar-nav>
<navbar-nav right>
<button @click="showModal" class="border border-light rounded mr-2" id="login">Sign In</button>
<button @click="showSignupModel" class="border border-light rounded mr-2" id="login">Sign Up</button>
</navbar-nav>
</navbar-collapse>
</navbar>
<!--/.Navbar-->
<navbar class="flexible-navbar white" position="top"  id="m-nav">
<img alt=""  src=".././assets/logo.png" height="80" width="80">
<navbar-collapse>
<navbar-nav class="drop-navbar">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="home" class="mr-3"/>Home</navbar-item>
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="television" class="mr-3"/>Web Series</navbar-item>
<!-- <navbar-item href="#" waves-fixed id="navbar-item"><fa icon="film" class="mr-3"/>Movies</navbar-item> -->
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="child" class="mr-3"/>Kids</navbar-item>
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="connectdevelop" class="mr-3"/>Channels</navbar-item>
<navbar-item href="#" waves-fixed style="line-height: 0"><hr></navbar-item>
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="user-o" class="mr-3"/>
<a @click="showModal">SignIn</a>
</navbar-item>
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="power-off" class="mr-3"/>
<a @click="showSignupModel">SignUp</a>
</navbar-item>
<ul class="nav2">
<li><a href="#"><i class="fa fa-facebook fa-2x" aria-hidden="true"></i></a></li>
<li><a href="#"><i class="fa fa-twitter fa-2x" aria-hidden="true"></i></a></li>
</ul>
</navbar-nav>
</navbar-collapse>
</navbar>
<!-- Sidebar -->
<div class="sidebar-fixed position-fixed">
<list-group class="list-group-flush">
<list-group-item><fa icon="home" class="mr-3"/>Home</list-group-item>
<list-group-item><fa icon="television" class="mr-3"/>Web Series</list-group-item>
<list-group-item><fa icon="film" class="mr-3"/>kids</list-group-item>
<list-group-item><fa icon="newspaper-o" class="mr-3"/>Channels</list-group-item>
<ul class="nav2">
<li><a href="#"><i class="fa fa-facebook fa-2x" aria-hidden="true"></i></a></li>
<li><a href="#"><i class="fa fa-twitter fa-2x" aria-hidden="true"></i></a></li>
</ul>
</list-group>
<div class="side-bottom">
<div class="side-bottom-icons">
<ul class="nav1" style="margin-bottom: 10px">
<li><a href="#">About Us</a></li>
<li><a href="#">Terms & conditions</a></li>
<li><a href="#">Privacy Policy</a></li>
</ul>
</div>
<div class="copyright">
<p>Copyright © 2018 Yawn Meter. All Rights Reserved</p>
</div>
</div>
</div>
<!-- /Sidebar  -->

<!--posts or content section -->
<main>
<div class = "header">
<LoginModel v-if="isModalVisible" @close="closeModal" />
<SignUpModel v-if="isSignupModalVisible" @close="closeSignUpModal">Sign Up</SignUpModel>     
</div>
<!--
Search container
-->
<div class="screen-loader">
<rise-loader :loading="loading"></rise-loader>
</div>
<!--
End of Search container
-->
<div v-if="loading==false">
<h1 v-if="isVerified">congratulations!! your email id is succesfully verified</h1>
<h1 v-if="isVerified">Please Login to Continue....</h1>
<h1 v-if="!isVerified">Unauthorized Access !!</h1>
</div>

</main>
<!-- end===posts or content section -->
</div>
</template>

<script>
import PostsService from '@/services/PostsService'
import LoginModel from './partials/LoginModel.vue';
import SignUpModel from './partials/SignUpModel.vue';
import { Container, Navbar, NavbarItem, NavbarNav, NavbarCollapse, Btn, Fa, ListGroup, ListGroupItem} from 'mdbvue'
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/css/vue-popper.css';
import riseLoader from 'vue-spinner/src/RiseLoader.vue';
export default {
name: 'posts',
components: {
LoginModel,
SignUpModel,
Container,
Navbar,
NavbarItem,
NavbarNav,
NavbarCollapse,
Btn,
ListGroup,
ListGroupItem,
Fa,
'popper': Popper,
'riseLoader':riseLoader,
},

data () {
return {
isModalVisible: false,
isSignupModalVisible: false,
loading:false,
isVerified:false
}
},
beforeMount() {
//console.log(this.$route.query)
this.verify();
},

methods: {
async verify(){

if(this.$route.query.token.length>0){
const response=await PostsService.verify({
token:this.$route.query.token
});
this.loading=true;
console.log(response.data);
if(response.data.result){
this.loading=false
this.isVerified=true;
var self = this;
setTimeout(function(){ 
self.$router.push({ name: 'Dashboard' });
},3000);  
}
}
},

async search(){     
const response=await PostsService.search({
query:this.query
});
if(response.data.searchResult.length>0)
{
this.searchResult=response.data.searchResult
this.searchfind=true
}
else{
this.searchResult=''
this.searchfind=false
}
},
showModal() {
this.isModalVisible = true;
},
closeModal() {
this.isModalVisible = false;
},
showSignupModel() {
this.isSignupModalVisible = true;
},

closeSignUpModal() {
this.isSignupModalVisible = false;
},
toggleSidebar () {
this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
},
close() {
this.$emit('close');
},
},
watch:{
// watch for change in the query string and recall the search method
query: function() {
this.search();
}
}
}
</script>

<style type="text/css" scoped>
.container {
padding: 2px 16px;
}

main {
margin:5% 1% 5% 4%;
padding-top: 2%;
font-family: 'Roboto';
}
.flexible-content {
transition: padding-left 0.3s;
padding-left: 150px;
font-family: 'Roboto';
}
.flexible-navbar {
padding-bottom:1%;
padding-top: 1%;
}
.sidebar-fixed {
left: 0;
top: 0;
height: 100vh;
width:14.166%;
box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
background: #272c2e;
padding-top:80px;
z-index: 500
}
.list-group-flush{

background: #272c2e;
z-index: 999;
}
.sidebar-fixed .list-group-item {
display: block !important;
transition: background-color 0.3s;
background: #272c2e;
color: #21DEEF;
}
.sidebar-fixed .list-group-item:hover {
cursor: pointer;
background-color: #fff !important;
color:#272c2e;
}
.sidebar-fixed .list-group .active {
box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
border-radius: 5px;
}
@media (max-width: 1199.98px) {
.sidebar-fixed {
display: none;
}
.flexible-content {
padding-left: 0;
}
.flexible-navbar {
padding-left: 10px;
}
}
.navbar-light .navbar-brand {
margin-left: 15px;
color: #2196f3 !important;
font-weight: bolder;
margin-right: 5px;
}

#m-nav{

display: none;
}

.logo-wrapper{

text-align: center;
}
#login{
background:#273746;
padding: 8px 20px;
color: #FFF;
font-size: 14px;
text-decoration: none;
border-radius: 3px;
-webkit-border-radius: 3px;
-moz-border-radius: 3px;
-o-border-radius: 3px;
-ms-border-radius: 3px;
cursor: pointer;
}

#login:hover{
text-decoration: none;
color: #272C2E;
background: #F7F7F7;
}

.icons{
list-style: none;
}

.icons li{
display: inline-block;
}
.side-bottom{
text-align:left;
position: absolute;
left: 0;
bottom: 2%;
}
.side-bottom-icons {
margin-bottom: 2em;
margin-left: 2em;
}
.side-bottom-icons ul{
list-style: none;
padding:0;
margin:0;
}
.side-bottom-icons ul li{

margin-left: 10px;
margin-bottom: 5px;

}
.copyright p{
color: #BBBBBB;
margin: 0;
font-size: 13px;
text-align: center;
}
.copyright p a{
color:#BBBBBB;
text-decoration:none;
}

.nav2{

list-style: none;
margin-top: 20%;

}

.nav2  li{

display: inline;
padding: 5%;
}
.nav2 li .fa{
color: #fff
}

.nav2 li .fa:hover{

color:#fc8080;

}
.nav1 li a{

color: #BBBBBB;
font-size: 13px;
text-align: center;
}

.nav1 li :hover{

color: #21DEEF;
text-decoration: none;
}
#bar{
background-color: #fc8080
}
.screen-loader{
position: absolute;
top:40%;
left:50%;
}
.heading{
font-size:20px;
color:#181818;
font-weight: 600;
}

#headings{

margin-top:1%;
}
.badges{

font-weight:500;

text-align: center;
}

.md-title{

margin-bottom: 0px
}

.logout_btn:hover{
color:#fc8080;
font-weight: bold;
}
.profile_btn:hover{
color:#fc8080;
font-weight: bold;
-webkit-transition: width 0.4s ease-in-out;
transition: width 0.4s ease-in-out;
}

@media (min-width: 320px) and (max-width: 480px) {


#m-nav{

display: block;

}

#d-nav{

display: none;
}

.nav2 li .fa{
color: #000
}

.nav2 li .fa:hover{

color:#fc8080;

}

.nav2{

list-style: none;
margin-top:2%;
margin-left:20%;

}

.nav2  li{

display: inline;
}

main{
margin-top:10%;
font-family: 'Roboto';
}

.screen-loader{
position: absolute;
top:40%;
left:30%;
}

#search-outer{

margin-top: 10%;
}

#headings{

margin-top: 5%;
}



#navbar-item:hover {
background-color: #21DEEF !important;
color:#272c2e;
text-decoration: none;
}  

.sidebar-fixed{

display: none;
}

.drop-navbar{

width: 100%;
}

#navbar-item{

width:100%;
}
.navbar-toggler {
padding: 0.25rem 0.15rem;
font-size: 1.15rem;
line-height: 1;
background-color:#fc8080;
border-radius: 0.25rem;
float: right;
}
}
</style>
