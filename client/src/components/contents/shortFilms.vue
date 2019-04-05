<template>
<div class="flexible-content">
<!--Navbar-->
<navbar class="flexible-navbar white" position="top"  href="#" id="d-nav">
<navbar-collapse style="max-height: 320px">
<navbar-nav left>
<router-link to="/">
<img alt=""  src="../.././assets/logo.png">
</router-link>
<input type="text" name="search" v-model="query" placeholder="Search ..." id="url" style="height: 40px;">
</navbar-nav>

<navbar-nav right>
<popper trigger="click" :options="{placement:'bottom'}" v-if="authenticated">
<div class="popper" style="height:100px;width:150px;background-color:grey;padding: 10px">
<div style="display: flex; flex-direction:column;align-items:flex-start; margin-top: 0">
<router-link to="/profile">
<button style="background-color: transparent; border-style: none;" class="profile_btn">Profile</button>
</router-link>
<button style="background-color: transparent; border-style: none;" class="logout_btn" @click="logout">Logout</button>
</div>
</div> 
<button slot="reference" style="background-color: #fff;border-style: none">
<a href="#"><i class="fa fa-user fa-2x" aria-hidden="true" style="color:#000"></i></a>
</button>
</popper>
<div v-if="!authenticated">
<button @click="showModal" class="border border-light rounded mr-2" id="login">Sign In</button>
<button @click="showSignupModel" class="border border-light rounded mr-2" id="login">Sign Up</button>
</div> 
</navbar-nav>         
</navbar-collapse>
</navbar>
<!--/.Navbar-->
<!--Navbar-->
<navbar class="flexible-navbar white" position="top"  id="m-nav">
<router-link to="/">
<img alt=""  src="../.././assets/logo.png" height="80" width="80">
</router-link>
<input type="text" name="search" v-model="query" placeholder="Search ..." id="url-mobile">
<navbar-collapse>
<navbar-nav class="drop-navbar">
<router-link to="/Dashboard">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="home" class="mr-3"/>Home</navbar-item>
</router-link>
<router-link to="/webseries">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="television" class="mr-3"/>Web Series</navbar-item>
</router-link>
<!-- <router-link to="/movies">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="film" class="mr-3"/>Movies</navbar-item>
</router-link> -->
<router-link to="/shortFilms">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="child" class="mr-3"/>Short Films</navbar-item>
</router-link>
<router-link to="/channels">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="connectdevelop" class="mr-3"/>Channels</navbar-item>
</router-link>
<navbar-item href="#" waves-fixed style="line-height: 0"><hr></navbar-item>

<div v-if="!authenticated">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="user-o" class="mr-3"/>
<a @click="showModal">SignIn</a>
</navbar-item>
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="power-off" class="mr-3"/>
<a @click="showSignupModel">SignUp</a>
</navbar-item>
</div>

<div v-if="authenticated">
<router-link to="/profile">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="connectdevelop" class="mr-3"/>profile
</navbar-item>
</router-link>
<navbar-item  href="#" waves-fixed id="navbar-item"><fa icon="power-off" class="mr-3"/><a @click="logout">logout</a></navbar-item>
</div>
<ul class="nav2">
<li><a href="#"><i class="fa fa-facebook fa-2x" aria-hidden="true"></i></a></li>
<li><a href="#"><i class="fa fa-twitter fa-2x" aria-hidden="true"></i></a></li>
</ul>
</navbar-nav>
</navbar-collapse>
</navbar>
<!--/.Navbar-->
<!-- Sidebar -->
<div class="sidebar-fixed position-fixed">
<list-group class="list-group-flush">

<router-link to="/Dashboard">
<list-group-item><fa icon="home" class="mr-3"/>Home</list-group-item>
</router-link>
<router-link to="/webseries">
<list-group-item><fa icon="television" class="mr-3"/>Web Series</list-group-item>
</router-link>
<!-- <router-link to="/movies">
<list-group-item><fa icon="film" class="mr-3"/>Movies</list-group-item>
</router-link> -->
<router-link to="/shortFilms">
<list-group-item><fa icon="newspaper-o" class="mr-3"/>Short Films</list-group-item>
</router-link>
<router-link to="/channels">
<list-group-item><fa icon="newspaper-o" class="mr-3"/>Channels</list-group-item>
</router-link>
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
<p>Copyright © 2018 yawnmeter. All Rights Reserved</p>
</div>
</div>
</div>
<!-- /Sidebar  -->

<!--posts or content section -->
<main>
<div class = "header">
<LoginModel v-if="isModalVisible" @swap-form="swapForm" @close="closeModal" />
<SignUpModel v-if="isSignupModalVisible" @swap-form="swapForm" @close="closeSignUpModal">Sign Up</SignUpModel> 
</div>

<div class="share">
<mdb-modal v-if="shareModal" @close="shareModal = false">
<mdb-modal-header>
<mdb-modal-title>Share</mdb-modal-title>
</mdb-modal-header>
<mdb-modal-body>
{{shareId}}
<social-sharing :url="shareId" inline-template>
<div style="margin-top: 20px">
<network network="facebook" style="cursor: pointer;margin-right: 5px">
<i class="fa fa-facebook"></i> Facebook
</network>
<network network="linkedin" style="cursor: pointer;margin-right: 5px">
<i class="fa fa-linkedin"></i> LinkedIn
</network>
<network network="twitter" style="cursor: pointer;margin-right: 5px">
<i class="fa fa-twitter"></i> Twitter
</network>
</div>
</social-sharing>
</mdb-modal-body>
</mdb-modal>
</div>

<div>
<!-- youtube modal -->
<mdb-modal v-if="ytmodal" @close="ytmodal = false" centered>
<mdb-modal-body class="p-0">
<div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
<iframe class="embed-responsive-item" :src="mediaSource" allowfullscreen></iframe>
</div>
</mdb-modal-body>
</mdb-modal>
</div>
<!--
Search container
-->
<div class="screen-loader">

<rise-loader :loading="loading"></rise-loader>
</div>
<div v-if="query.length>1">
<div v-if="searchfind" id="search-outer">
<p style="color: #000;font-weight:600">Search Results:({{searchResult.length}}) results found</p>
<div class="search-container" v-for="result in searchResult" v-bind:data="result" :key="result.id">
<router-link v-bind:to="{ name: 'PostMapping', params: { id: result.mediaId } }">
<li><p>{{result.title}}</p></li>
</router-link>

<li style="color:#fc8080"><p>{{result.publisher}}</p></li>
</div>
</div>
<div v-else id="search-outer">
<p style="color: #000">No result found.......</p>
</div>

</div>
<!--
End of Search container
-->
<div v-if="query.length==0&&loading==false">
<!--
Trending Web Series
-->
<!--
Latest Web Series
-->
<div style="display: flex; flex-direction: row;align-items: center;text-align: center; justify-content: space-between;" id="headings">
<p class="heading">All Short Films:</p>
</div>
<div class="grid-container">
<md-card class="md-card"  v-for="post in Series"  v-bind:data="post" :key="post.id">
<mdb-view hover class="img-card">
<a @click="playMedia(post.URL)">
<mdb-card-image :src="post.thumbnail" alt="Card image cap"></mdb-card-image>
<mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
</a>
</mdb-view> 
<div style="margin:0 10px 10px 10px;height:60px">
<p style="font-size: 14px;font-weight: bold;margin-bottom: 0">{{post.title|truncate(25)}}</p>
<div class="rating-show">
<p class="md-title" style="font-size: 12px;">{{post.publisher}}</p>
<span v-if="post.Rating!==0&&post.Rating===1" style="color:#ec2020;font-weight:600;font-size: 12px;">{{post.Rating}} YAWN</span>
<span v-if="post.Rating!==0&&post.Rating!==1" style="color:#ec2020;font-weight:600;font-size: 12px;">{{post.Rating}} YAWNS</span>
<span v-if="post.Rating===0" style="color:#ec2020;font-weight:600;font-size: 12px;">YAWNFREE</span>
</div>
<div style="display: flex; flex-direction: row;align-items: center;text-align:center;"> 
<md-chip md-disabled id="chip" v-for="tag in post.tags" :key="post.id">       
<div class="mdc-chip__text badges">{{tag.tagName}}</div>
</md-chip>
</div>
</div>
<md-card-actions md-alignment="space-between">
<a @click="sharePost(post.mediaId)">
<md-avatar class="md-icon md-small">
<md-icon>share</md-icon>
</md-avatar>
</a>
<popper trigger="click" :options="{placement: 'top-end'}" class="popper-div">
<div class="popper">
<div v-if="!rated&&authenticated">
<div style="display: flex;flex-direction: row;height:20px;margin-bottom: 5px">
<p style="margin-right: 5px">Select Yawns:</p>
<select  style="width:40%;height:100%" v-model="rating">
<option disabled value="">Select</option>
<option>yawnfree</option>
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
</select>
</div>
<div style="display: flex; flex-direction: row;text-align: center;justify-content: space-between;height: 20px;margin-bottom: 5px">
<p style="margin-right:5px">Is it Family Safe?
<input type="checkbox" id="family_safe" v-model="family_safe">
</p>
</div>
<textarea rows="1" cols="18" maxlength="200" placeholder="Review..." v-model="comment"></textarea>
<button class="app_post_btn" @click="ratePost(post)" id="rate">Submit</button>
</div>
<div v-if="rated&&authenticated" class="rating_msg">
<p>Thanks For Your Valuable Rating</p>
<i class="fa fa-check-circle-o fa-4x" aria-hidden="true"></i>
</div>
<div v-if="!authenticated">
<p>Login to Rate</p>
<button @click="showModal" id="login">Login</button>        
</div>
</div>
<button slot="reference"  @click="resetRating" id="ratePost">
Rate 
</button>
</popper>
</md-card-actions>
</md-card>        
</div>
</div>
</main>
<!-- end===posts or content section -->
</div>
</template>

<script>
import PostsService from '@/services/PostsService'
import { Container, Navbar, NavbarItem, NavbarNav, NavbarCollapse, Btn, Fa, ListGroup, ListGroupItem, CardBody, Footer, waves,Card, CardImg, CardTitle, CardText, Dropdown, DropdownItem, DropdownMenu, DropdownToggle,mdbView,mdbMask,mdbCardImage,mdbModal,mdbModalHeader,mdbModalTitle,mdbModalBody,mdbModalFooter} from 'mdbvue'
import 'vue-popperjs/dist/css/vue-popper.css';
const LoginModel=()=>import('../partials/LoginModel.vue');
const SignUpModel=()=>import('../partials/SignUpModel.vue');
const  Popper=()=>import('vue-popperjs');
const riseLoader =()=>import('vue-spinner/src/RiseLoader.vue');

export default {
name: 'shortFilms',
components: {
Container,
LoginModel,
SignUpModel,
Navbar,
NavbarItem,
NavbarNav,
NavbarCollapse,
Btn,
ListGroup,
ListGroupItem,
Fa,
CardBody,
'ftr': Footer,
Card, 
CardImg,
CardTitle,
CardText,
'popper': Popper,
'riseLoader':riseLoader,
Dropdown,
DropdownItem, 
DropdownMenu, 
DropdownToggle,
mdbView,
mdbMask,
mdbCardImage,
mdbModal,
mdbModalHeader,
mdbModalTitle,
mdbModalBody,
mdbModalFooter
},

data () {
return {
Series: [],
url: null,
response: null,
validUrl: false,
isModalVisible:false,
isSignupModalVisible: false,
title: '',
rating: '',
family_safe: '',
id: '',
rating: 0,
query:'',
searchfind:false,
searchResult:[],
loading:true,
totalrating:4,
rated:false,
authenticated:false,
shareModal:false,
shareId:'',
comment:'',
ytmodal:false,
mediaSource:''
}
},
filters: {
truncate: function(value, limit) {
if (value.length > limit) {
value = value.substring(0, (limit - 3)) + '...';
}


return value

}
},
mounted () { 

this.getPosts();
this.authenticate();
},
methods: {

swapForm () {
this.isModalVisible = !this.isModalVisible;

this.isSignupModalVisible=!this.isSignupModalVisible;
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

setRating: function(rating) {
this.rating = rating;
},

async logout(){

this.$store.dispatch('logout_auth').then(()=>{

this.$router.push({name:'Posts'})

})


},

resetRating(){

this.rating=0;
this.family_safe =false;
this.rated=false;
this.comment='';
},

async ratePost (post) {
if(this.rating==='yawnfree')
{
	this.rating=0
}
const token=this.$store.getters.authHeader;
if(token){
await PostsService.ratePost({
id:post._id,
title:post.title,
thumbnail:post.thumbnail,
rating:Number(this.rating),
family_safe:this.family_safe,
tokenId:token,
mediaId:post.mediaId,
review:this.comment
})

this.rated=true
}
},

async getPosts () {
const response = await PostsService.fetchShortFilms()
if(response){
this.loading=false
this.Series = response.data.recentSeries
//this.freshSeries = response.data.freshSeries
}      
},
authenticate(){
const user=this.$store.getters.isAuthenticated;
if(user){
this.authenticated=true;
}
},
sharePost(id){
if(id){
this.shareId=document.location.origin+'/media/details/'+id;
this.shareModal=true
}
},
playMedia(mediaUrl){
function getId(url) {
var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
var match = url.match(regExp);

if (match && match[2].length == 11) {
return match[2];
} else {
return 'error';
}
}
const videoId=getId(mediaUrl);
this.mediaSource="https://www.youtube.com/embed/"+videoId+"?modestbranding=1&autostart=1&showinfo=0&rel=0&mode=opaque&autohide=1&wmode=transparent&autoplay=1";
this.ytmodal=true;
},
changeUrl: function(event) {
if(event.target.value==''){

this.url=''
}
else{

this.url = event.target.value
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
}
},
watch: {
// watch for change in the query string and recall the search method
query: function() {
this.search();
}
}
}
</script>

<style type="text/css" scoped>

.md-card{
width:95%;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);
transition: 0.3s;
border-radius:2px; /* 5px rounded corners */

}
.container {
padding: 2px 16px;
width:auto;
}
#ratePost {
padding: 2px 4px;
background:grey;
color: #FFF;
font-size: 12px;
text-decoration: none;
border-radius: 2px;
-webkit-border-radius: 2px;
-moz-border-radius: 2px;
-o-border-radius: 2px;
-ms-border-radius: 2px;
cursor: pointer;
position: absolute;
right:0;
bottom:0;
margin-bottom: 5px;
margin-right: 5px;
}
#ratePost:hover{
text-decoration: none;
color: #272C2E;
background: #F7F7F7;
}
.header {
text-align: left;
background-color: transparent;
} 
.grid-container {
display: grid;
grid-template-columns: repeat(5,1fr);
grid-row-gap:10px;  
font-family: 'Roboto';
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
@media (max-width:991px) {
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
#url{

width: 600px;
box-sizing: border-box;
border: 2px solid #ccc;
border-radius: 4px;
font-size: 14px;
background-color: white;
background-repeat: no-repeat;
padding: 12px 20px 12px 20px;
-webkit-transition: width 0.4s ease-in-out;
transition: width 0.4s ease-in-out;
margin-top: 5px;
margin-left:2%;
}

#url-mobile{

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


#url:focus{
border: 2px solid #16a085;
color: #16a085;
transition: 0.2s ease;
}

.popper{
height:150px;
width:200px;
background-color:#fff;
padding:10px;
padding-top: 5px;
}

#rate{
display: block;
box-sizing: border-box;
padding: 4px;
width:90%;
height: 30px;
border: none;
border-bottom: 1px solid #AAA;
font-weight: 400;
font-size: 15px;
transition: 0.2s ease;
background-color: #fc8080;
position: absolute;
bottom: 0;
margin-bottom: 10px;
cursor: pointer;
}

#rate:hover{
text-decoration: none;
color: #272C2E;
background: grey;
}

.rating_msg p{

color:#fc8080;
font-weight: 600;
font-size: 16px;
}

.rating_msg i{

color:green;
}


.search-container{
margin-top: 2%;
margin-bottom: 2%;
display: flex;
flex-direction: row;
background-color: #fff;
padding:15px;
border:4px solid grey;
}
.search-container li{
list-style: none;
font-weight: bold;
margin-right: 5px;
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

#more-content{

color:#21DEEF;
font-weight:800;
cursor: pointer;
text-decoration: none;
margin-right: 5%;
}

#more-content:hover{

color:#fc8080;
}

#chip{

height:25px;
line-height: 25px;
}
.img-card{
height: 60%;
overflow: hidden;
}

.rating-show{
display: flex;
flex-direction:row;
align-items: center;
text-align: center;
justify-content: space-between;
height: 25px
}
textarea {
position: relative;
resize: none;
width:100%;
}
@media screen and (min-width: 320px) and (max-width: 480px) {


#url-mobile{
margin-right:5px;
padding: .45em .55em;
float: right;
width:20px;
text-align: right;
display: inline-block;
margin-top:2px;
background:url(https://static.tumblr.com/ftv85bp/MIXmud4tx/search-icon.png) no-repeat  center;
-webkit-transition: all 0.7s ease ;
-moz-transition: all 0.7s ease ;
-o-transition: all 0.7s ease ;
transition: all 0.7s ease ;
color: transparent;
border: none;
border-color: transparent;
cursor: pointer;
}

#url-mobile:focus{
background:#fff;
color:#000;
font-size:100%;
font-weight:400;
width:50%;
-moz-box-shadow: 2px 2px 2px rgba(68,68,68,0.6);
-webkit-box-shadow: 2px 2px 2px rgba(68,68,68,0.6);
box-shadow: 2px 2px 2px rgba(68,68,68,0.6);
-webkit-border-radius: 10em;
-moz-border-radius: 10em;
border-radius: 10em;
border-color:#808b96;

}
#url-mobile::placeholder{

	color: transparent;
}
#url-mobile:focus::placeholder{

color:grey;

}

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
.md-card{
width:80%; 
border-radius:5px; /* 5px rounded corners */
margin-left:5%;
}

.grid-container {
display: grid;
grid-template-columns: repeat(1,1fr);
grid-gap:10px;  
font-family: 'Roboto';
}

.search-container{
margin-top: 2%;
margin-bottom: 1%;
display: flex;
flex-direction: row;
background-color: #fff;
padding:2px;
border:1px solid grey;
margin-right: 5px;
}
.search-container li{
list-style: none;
font-weight: bold;
margin-right: 10px;
}

.search-container li:hover{
color:#fc8080;
}
.screen-loader{
position: absolute;
top:40%;
left:40%;
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

.drop-navbar{

width: 100%;
}

#navbar-item{

width:100%;
} 

#more-content{

margin-right:5px; 
}

.sidebar-fixed{

display: none;
}

.filter-box{

display: none;
}

.content-section{

width:90%;

}
textarea{
padding: 10px;
}
}

@media screen and (min-width: 481px) and (max-width: 767px) {

#url-mobile{
margin-right:5px;
padding: .45em .55em;
float: right;
width:30px;
text-align: right;
display: inline-block;
margin-top:2px;
background:url(https://static.tumblr.com/ftv85bp/MIXmud4tx/search-icon.png) no-repeat  center;
-webkit-transition: all 0.7s ease ;
-moz-transition: all 0.7s ease ;
-o-transition: all 0.7s ease ;
transition: all 0.7s ease ;
color: transparent;
border: none;
border-color: transparent;
cursor: pointer;
}

#url-mobile:focus{
background:#fff;
color:#000;
font-size:100%;
font-weight:400;
width:50%;
-moz-box-shadow: 2px 2px 2px rgba(68,68,68,0.6);
-webkit-box-shadow: 2px 2px 2px rgba(68,68,68,0.6);
box-shadow: 2px 2px 2px rgba(68,68,68,0.6);
-webkit-border-radius: 10em;
-moz-border-radius: 10em;
border-radius: 10em;
border:0.5px solid #808b96;

}

#url-mobile::placeholder{

	color: transparent;
}
#url-mobile:focus::placeholder{

color:grey;

}


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
margin-top:8%;
font-family: 'Roboto';
}

.md-card{
width:90%;
border-radius:5px; /* 5px rounded corners */
margin-left: 5px;

}

.grid-container {
display: grid;
grid-template-columns: repeat(2,1fr);
grid-gap:10px;  
font-family: 'Roboto';
}

.search-container{
margin-top: 2%;
margin-bottom: 1%;
display: flex;
flex-direction: row;
background-color: #fff;
padding:2px;
border:1px solid grey;
margin-right: 5px;
}
.search-container li{
list-style: none;
font-weight: bold;
margin-right: 10px;
}

.search-container li:hover{
color:#fc8080;
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

.drop-navbar{

width: 100%;
}

#navbar-item{

width:100%;
} 

#more-content{

margin-right:5px; 
}

.sidebar-fixed{

display: none;
}
.filter-box{

display: none;
}

.content-section{

width:90%;

}

textarea{
padding: 10px;
}

}

@media screen and (min-width: 768px) and (max-width:991px){

#url-mobile{
margin-right:5px;
padding: .45em .55em;
float: right;
width:30px;
text-align: right;
display: inline-block;
margin-top:2px;
background:url(https://static.tumblr.com/ftv85bp/MIXmud4tx/search-icon.png) no-repeat  center;
-webkit-transition: all 0.7s ease ;
-moz-transition: all 0.7s ease ;
-o-transition: all 0.7s ease ;
transition: all 0.7s ease ;
color: transparent;
border: none;
border-color: transparent;
cursor: pointer;
}

#url-mobile:focus{
background:#fff;
color:#000;
font-size:100%;
font-weight:400;
width:50%;
-moz-box-shadow: 2px 2px 2px rgba(68,68,68,0.6);
-webkit-box-shadow: 2px 2px 2px rgba(68,68,68,0.6);
box-shadow: 2px 2px 2px rgba(68,68,68,0.6);
-webkit-border-radius: 10em;
-moz-border-radius: 10em;
border-radius: 10em;
border:0.5px solid #808b96;

}

#url-mobile::placeholder{

	color: transparent;
}
#url-mobile:focus::placeholder{

color:grey;

}

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

main {
margin:2% 2% 5% 1%;
padding-top:2%;
font-family: 'Roboto';
}

.content-section{

width: 80%;
}

.md-card{
width:90%;
border-radius:5px; /* 5px rounded corners */
margin-left:2px;
}

.flexible-content {
transition: padding-left 0.3s;
padding-left:0;
font-family: 'Roboto';
}

.grid-container {
display: grid;
grid-template-columns: repeat(3,1fr);
grid-gap:10px;  
font-family: 'Roboto';
}

.search-container{
margin-top: 2%;
margin-bottom: 1%;
display: flex;
flex-direction: row;
background-color: #fff;
padding:2px;
border:1px solid grey;
margin-right: 5px;
}
.search-container li{
list-style: none;
font-weight: bold;
margin-right: 10px;
}

.search-container li:hover{
color:#fc8080;
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

.drop-navbar{

width: 100%;
}

#navbar-item{

width:100%;
} 

#more-content{

margin-right:5px; 
}

.sidebar-fixed{

display: none;
}
textarea{
padding: 10px;
}
}

@media screen and (min-width:992px) and (max-width:1024px){

.md-card{
width:95%;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);
transition: 0.3s;
border-radius: 5px; /* 5px rounded corners */

}
.container {
padding: 2px 16px;
width:auto;
}
#ratePost {
padding: 2px 4px;
background:grey;
color: #FFF;
font-size: 12px;
text-decoration: none;
border-radius: 2px;
-webkit-border-radius: 2px;
-moz-border-radius: 2px;
-o-border-radius: 2px;
-ms-border-radius: 2px;
cursor: pointer;
position: absolute;
right:0;
bottom:0;
margin-bottom: 5px;
margin-right: 5px;
}

.grid-container {
display: grid;
grid-template-columns: repeat(3,1fr);
grid-row-gap:10px;  
font-family: 'Roboto';
}


main {
margin:6% 1% 5% 4%;
padding-top: 2%;
font-family: 'Roboto';
}
.flexible-content {
transition: padding-left 0.3s;
padding-left:12.22%;
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
width:15.166%;
box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
background: #272c2e;
padding-top:80px;
z-index: 500
}


#m-nav{

display: none;
}

.filter-box{

width: 12.66%;

}
textarea{
padding: 10px;
}
}

@media screen and (min-width: 1025px) and (max-width: 1280px) {
.md-card{
width:95%;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);
transition: 0.3s;
border-radius: 5px; /* 5px rounded corners */

}
.container {
padding: 2px 16px;
width:auto;
}

.grid-container {
display: grid;
grid-template-columns: repeat(3,1fr);
grid-row-gap:10px;  
font-family: 'Roboto';
}


main {
margin:6% 2% 5% 4%;
padding-top: 2%;
font-family: 'Roboto';
}
.flexible-content {
transition: padding-left 0.3s;
padding-left:12.22%;
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
width:15.166%;
box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
background: #272c2e;
padding-top:80px;
z-index: 500
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

.popper{
height:150px;
width:200px;
background-color:#fff;
padding: 20px;
}

.filter-box{

width: 12.66%;

}
textarea{
padding: 10px;
}
}


@media (min-width: 1281px) {

.sidebar-fixed {
left: 0;
top: 0;
height: 100vh;
width:180px;
box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
background: #272c2e;
padding-top:80px;
z-index: 500
}
}
</style>
