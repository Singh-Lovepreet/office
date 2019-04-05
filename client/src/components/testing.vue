<template>
<div class="flexible-content">
<!--Navbar-->
<navbar class="flexible-navbar white" position="top"  href="#">
<navbar-collapse style="max-height: 320px">
<navbar-nav left>
<a class="logo-wrapper"><img alt=""  src=".././assets/logo.png" /></a>
<input type="text" name="search" v-model="query" placeholder="Search ..." id="url">
</navbar-nav>
<navbar-nav right>
<button class="border border-light rounded mr-2">Upload</button>
<button @click="showModal" class="border border-light rounded mr-2" id="login">Sign In</button>
<button @click="showSignupModel" class="border border-light rounded mr-2" id="login">Sign Up</button>
</navbar-nav>
</navbar-collapse>
</navbar>
<!--/.Navbar-->
<!-- Sidebar -->
<div class="sidebar-fixed position-fixed">
<list-group class="list-group-flush">
<list-group-item ><fa icon="home" class="mr-3"/>Home</list-group-item>

<list-group-item ><fa icon="television" class="mr-3"/>Tv Shows</list-group-item>


<list-group-item><fa icon="film" class="mr-3"/>Movies</list-group-item>


<list-group-item><fa icon="trophy" class="mr-3"/>Sports</list-group-item>


<list-group-item><fa icon="music" class="mr-3"/>Songs</list-group-item>

<list-group-item><fa icon="newspaper-o" class="mr-3"/>News</list-group-item>

</list-group>
<div class="side-bottom">
<div class="side-bottom-icons">
<ul class="nav2">
<li><a href="#"><i class="fa fa-facebook fa-2x" aria-hidden="true"></i></a></li>
<li><a href="#"><i class="fa fa-twitter fa-2x" aria-hidden="true"></i></a></li>
<li><a href="#"><i class="fa fa-instagram fa-2x" aria-hidden="true"></i></a></li>
<li><a href="#"><i class="fa fa-behance fa-2x" aria-hidden="true"></i></a></li>
</ul>
</div>
<div class="copyright">
<p>Copyright © 2018 Yawn Meter. All Rights Reserved</p>
</div>
</div>
</div>
<!-- /Sidebar  -->
<main>
<div class = "header">
<LoginModel
v-if="isModalVisible"
@close="closeModal"
/>
<SignUpModel  v-if="isSignupModalVisible" @close="closeSignUpModal">Sign Up</SignUpModel>     
</div>
<!--
Search container
-->
<div class="screen-loader">

<rise-loader :loading="loading"></rise-loader>
</div>


<div v-if="query.length>1">
<div v-if="searchfind">

<h4 style="color: #000;font-weight: bold;">Search Results:({{searchResult.length}}) results found</h4>
<div class="search-container" v-for="result in searchResult" v-bind:data="result" :key="result.id">
<router-link v-bind:to="{ name: 'PostMapping', params: { id: result._id } }">
<li>{{result.title}}</li>
</router-link>
<li>||</li>
<li style="color:#fc8080">{{result.publisher}}</li>
</div>
</div>
<div v-else>
<h3 style="color: #000">No result found.......</h3>
</div>

</div>
<!--
End of Search container
-->
<div v-if="query.length==0&&loading==false" >
<link-prevue :url="url"></link-prevue>
<h1 
style="font-size: 40px;
color: #181818;
margin: 1em 0 1em 0;
font-weight: 600;">Top Series:</h1>
<div class="grid-container">
<md-card class="md-card"  v-for="post in albumPosts"  v-bind:data="post" :key="post.id">
<md-card-area md-inset>
<router-link v-bind:to="{ name: 'PostMapping', params: { id: post.Episode } }">
<md-card-media style="height:200px;">
<img :src="post.thumbnail">
</md-card-media>
</router-link>

<md-card-header>
<h2 class="md-title" style="font-size: 16px;font-weight: bold;">{{post.title}}</h2>
<div class="md-subhead">
<star-rating
v-bind:increment="0.5"
v-bind:max-rating="5"
inactive-color="#ccc"
active-color="#ec2020"
v-bind:star-size="20"
>
</star-rating>
</div>
</md-card-header>
<md-card-content>
{{post.publisher}}
</md-card-content>
</md-card-area>

<md-card-content>
<p style="margin-right: 10px">Family Safe
<input type="checkbox" id="family_safe">
</p>

</md-card-content>

<md-card-actions md-alignment="left">
<popper trigger="click" :options="{placement: 'top'}" class="popper-div">
<div class="popper">
<star-rating
v-bind:increment="0.5"
v-bind:max-rating="5"
inactive-color="#ccc"
active-color="#ec2020"
v-bind:star-size="40"
@rating-selected ="setRating"
v-model="rating"
>
</star-rating>
<div style="display: flex; flex-direction: row;align-items: center;text-align: center;margin-top: 2%">
<p style="margin-right: 10px">Is it Family Safe?
<input type="checkbox" id="family_safe" v-model="family_safe">
</p>
</div>
<button class="app_post_btn" @click="ratePost" id="rate">Submit</button>
</div>
<button slot="reference" @click="resetRating">
Rate 
</button>
</popper>
</md-card-actions>
</md-card>
</div>


<h1 style="font-size: 40px;
color: #181818;
margin: 1em 0 1em 0;
font-weight: 600;">Top Single:</h1>
<div class="grid-container">

<md-card class="md-card"  v-for="post in data" v-bind:data="post" :key="post.id">
<md-card-area md-inset>
<a :href="post.URL">
<md-card-media style="height:250px;">
<img :src="post.thumbnail">
</md-card-media>
</a>
<md-card-header style="height:100px; margin-bottom: 10px" >
<h2 class="md-title" style="font-size: 16px;font-weight: bold;">{{post.title}}</h2>
<div class="md-subhead">
<star-rating
v-bind:increment="0.5"
v-bind:max-rating="5"
inactive-color="#ccc"
active-color="#ec2020"
v-bind:star-size="20"
>
</star-rating>
</div>
</md-card-header>
<md-card-content>
{{post.publisher}}
</md-card-content>
</md-card-area>

<md-card-content>
<p style="margin-right: 10px">Family Safe
<input type="checkbox" id="family_safe">
</p>

</md-card-content>

<md-card-actions md-alignment="left">
<popper trigger="click" :options="{placement: 'top'}">
<div class="popper">
<star-rating
v-bind:increment="0.5"
v-bind:max-rating="5"
inactive-color="#ccc"
active-color="#ec2020"
v-bind:star-size="40"
@rating-selected ="setRating"
v-model="rating"
>
</star-rating>
<div style="display: flex; flex-direction: row;align-items: center;text-align: center;margin-top: 2%">
<p style="margin-right: 10px">Is it Family Safe?
<input type="checkbox" id="family_safe" v-model="family_safe">
</p>
</div>
<button class="app_post_btn" @click="ratePost" id="rate">Submit</button>
</div>
<button slot="reference" @click="resetRating">
Rate 
</button>
</popper>
</md-card-actions>
</md-card>
</div>


</div>
</main>
</div>
</template>

<script>
import PostsService from '@/services/PostsService'
import LoginModel from './partials/LoginModel.vue';
import SignUpModel from './partials/SignUpModel.vue';
import { Container, Navbar, NavbarItem, NavbarNav, NavbarCollapse, Btn, Fa, ListGroup, ListGroupItem, CardBody, Footer, waves,Card, CardImg, CardTitle, CardText } from 'mdbvue'
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/css/vue-popper.css';
import StarRating from 'vue-star-rating'
import riseLoader from 'vue-spinner/src/RiseLoader.vue';



export default {
name: 'testing',

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
CardBody,
'ftr': Footer,
Card, 
CardImg,
CardTitle,
CardText,
'popper': Popper,
StarRating,
'riseLoader':riseLoader

},

data () {
return {
albumPosts: [],
singlePosts: [],
url: null,
response: null,
validUrl: false,
isModalVisible: false,
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
data:[]
}
},
mounted () {

this.scroll()

},

beforeMount(){

this.getPosts();
},
methods: {

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
async ratePost () {
await PostsService.ratePost({
id: this.$route.params.id,
rating: this.rating,
family_safe: this.family_safe
})
this.$router.push({ name: 'ThankYou' })
},
async getPosts () {
const response = await PostsService.fetchPosts()
if(response){

this.loading=false

this.albumPosts = response.data.albumPosts
this.singlePosts = response.data.singlePosts

}

for(var i=0;i<6;i++){

this.data.push(this.singlePosts[i])
}

},

displayPost(){

var start=6;
var perPage=12

for(var i=start;i<perPage;i++)
{

this.data.push(this.singlePosts[i])

}
console.log(this.data)
start=perPage;
perPage=start+perPage;

},

scroll () {
window.onscroll = () => {
let bottomOfWindow = document.documentElement.clientHeight + window.scrollY ===  document.documentElement.scrollHeight

if (bottomOfWindow) {
this.displayPost()
}
};
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
},

resetRating(){

this.rating=0;
this.family_safe =false;

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

width: 350px;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
transition: 0.3s;
border-radius: 5px; /* 5px rounded corners */
}

/* On mouse-over, add a deeper shadow */

/* Add some padding inside the card container */
.container {
padding: 2px 16px;
}

button {
padding: 8px 20px;
background: #21DEEF;
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

button:hover{

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
grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
grid-gap: 30px;
}

.url-group {
width: 400px;
margin-bottom: 10px;
overflow: hidden;
}
.url-group input[type="text"] {
height: 40px;
border: 1px;
padding: 1.5px;
padding-left: 10px;
padding-right: 10px;
border-radius: 10px 0 0 10px;
border-color: transparent;
width: 72.5%;
display: inline;
margin: 0;
float: left;
color: #8d8d8d;
font-family: 'Hind Siliguri', sans-serif;
font-size: 15px;
}
.url-group input[type="text"]:focus {
outline: none;
}
.url-group a {
float: right;
border-radius: 0 10px 10px 0;
font-family: 'Hind Siliguri', sans-serif;
font-size: 14px;
letter-spacing: 0.1em;
color: #ffffff;
background-color: #ffa9be;
padding: 10px 20px 10px 20px;
text-align: center;
display: inline-block;
text-decoration: none !important;
-webkit-transition: all 0.2s ease-in-out;
-moz-transition: all 0.2s ease-in-out;
-ms-transition: all 0.2s ease-in-out;
-o-transition: all 0.2s ease-in-out;
transition: all 0.2s ease-in-out;
}
.url-group a:hover {
background-color: #ff8fab;
}

main {
margin:10% 2%;
}
.flexible-content {
transition: padding-left 0.3s;
padding-left: 220px;
}
.flexible-navbar {
padding-bottom:2%;
padding-top: 1%;
}
.sidebar-fixed {
left: 0;
top: 0;
height: 100vh;
width:16.166%;
box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
background: #272c2e;
padding: 1.2rem;
padding-top: 100px;
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

input[type=text] {
width: 800px;
box-sizing: border-box;
border: 2px solid #ccc;
border-radius: 4px;
font-size: 14px;
background-color: white;
background-position: 20px 20px; 
background-repeat: no-repeat;
padding: 12px 20px 12px 30px;
-webkit-transition: width 0.4s ease-in-out;
transition: width 0.4s ease-in-out;
margin-left:20%;
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
text-align: center;
position: absolute;
left: 0;
bottom: 3%;
}
.side-bottom-icons {
margin-bottom: 2em;
}
.side-bottom-icons ul{
padding:0;
margin:0;
}
.side-bottom-icons ul li{
display:inline-block;
margin:0 .3em;
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

.nav2 li .fa{

color: #fff
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
width:300px;
background-color:#fff;
padding: 10px;
margin-left:50%;
}

#rate{

display: block;
box-sizing: border-box;
margin-bottom: 10px;
padding: 4px;
width: 260px;
height: 30px;
border: none;
border-bottom: 1px solid #AAA;
font-family: 'Roboto', sans-serif;
font-weight: 400;
font-size: 15px;
transition: 0.2s ease;
margin-left: 0

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
</style>


