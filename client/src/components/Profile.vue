<template>
<div class="flexible-content">
<!--Navbar-->
<navbar class="flexible-navbar white" position="top"  href="#" id="d-nav">
<navbar-collapse style="max-height: 320px">
<navbar-nav left>
<router-link to="/">
<img alt=""  src=".././assets/logo.png">
</router-link>
<input type="text" name="search" v-model="query" placeholder="Search ..." id="url" style="height: 40px;">
</navbar-nav>

<navbar-nav right>
<popper trigger="click" :options="{placement:'bottom'}">
<div class="popper" style="height:100px;width:150px;background-color:grey;padding: 10px">
<div style="display: flex; flex-direction:column;align-items:flex-start; margin-top: 0">
<button style="background-color: transparent; border-style: none;" class="profile_btn">Profile</button>
<button style="background-color: transparent; border-style: none;" class="logout_btn" @click="logout">Logout</button>
</div>
</div> 
<button slot="reference" style="background-color: #fff;border-style: none">
<a href="#"><i class="fa fa-user fa-2x" aria-hidden="true" style="color:#000"></i></a>
</button>
</popper> 
</navbar-nav>        
</navbar-collapse>
</navbar>
<!--/.Navbar-->
<!--Navbar-->
<navbar class="flexible-navbar white" position="top"  id="m-nav">
<router-link to="/">
<img alt=""  src=".././assets/logo.png" height="80" width="80">
</router-link>
<input type="text" name="search" v-model="query" placeholder="Search ..." id="url-mobile">
<navbar-collapse>
<navbar-nav class="drop-navbar">
<a @click="tab = 1">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="home" class="mr-3"/>Account</navbar-item>
</a>
<a @click="tab = 2">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="television" class="mr-3"/>Settings</navbar-item>
</a>
<a @click="tab = 3">
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="film" class="mr-3"/>Notifications</navbar-item>
</a>

<navbar-item href="#" waves-fixed style="line-height: 0"><hr></navbar-item>
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="user-o" class="mr-3"/>Profile</navbar-item>
<navbar-item href="#" waves-fixed id="navbar-item"><fa icon="power-off" class="mr-3"/><a @click="logout">logout</a></navbar-item>
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
<a @click="tab = 1"><list-group-item><fa icon="home" class="mr-3"/>Account</list-group-item></a>
<a @click="tab = 2"><list-group-item><fa icon="television" class="mr-3"/>Settings</list-group-item></a>
<a @click="tab = 3"><list-group-item><fa icon="film" class="mr-3"/>Notifications</list-group-item></a>
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
<div class="share">
<mdb-modal v-if="shareModal" @close="shareModal = false">
<mdb-modal-header>
<mdb-modal-title>Review</mdb-modal-title>
</mdb-modal-header>
<mdb-modal-body>
{{myReview}}
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
<router-link v-bind:to="{ name: 'PostMapping', params: { id: result._id } }">
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

<div class="profile" v-show="tab==1">
<img src="https://cdn2.iconfinder.com/data/icons/rcons-users-color/32/boy-128.png" alt="John" style="width:100%">
<h2>{{userName}}</h2>
<p class="title">{{userEmail}}</p>

<div class="userReviews">
<div style="display: flex; flex-direction: row;align-items: center;text-align: center; justify-content: space-between;" id="headings">
<p class="heading">My watchlist:</p>
</div>
<div class="grid-container">
<md-card class="md-card"  v-for="post in userWatchlists"  v-bind:data="post" :key="post._id">
<mdb-view hover class="img-card">
<router-link v-bind:to="{ name: 'PostMapping', params: { id: post.mediaId} }">
<mdb-card-image :src="post.thumbnail" alt="Card image cap"></mdb-card-image>
<mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
</router-link>
</mdb-view> 
<div style="margin:0 10px 0px 10px ">
<p style="font-size: 12px;font-weight: bold;margin-bottom: 0" v-if="post.title.length<25">{{post.title|truncate(25)}}</p>
<p style="font-size: 12px;font-weight: bold;margin-bottom: 0" v-if="post.title.length>25">{{post.title|truncate(25)}}...</p>
<div style="display: flex; flex-direction: row;align-items: center;text-align: center; justify-content: space-between;">
<span v-if="post.Rating!==0&&post.Rating===1"  style="color:#ec2020;font-weight:400">{{post.Rating}} YAWN</span>
<span v-if="post.Rating!==0&&post.Rating!==1"  style="color:#ec2020;font-weight:400">{{post.Rating}} YAWNS</span>
<span v-if="post.Rating===0" style="color:#ec2020;font-weight:400;font-size: 12px">YAWNFREE</span>
</div>
</div>
</md-card>    
</div>

<div style="display: flex; flex-direction: row;align-items: center;text-align: center; justify-content: space-between;" id="headings">
<p class="heading">My Reviews:</p>
</div>
<div class="grid-container">
<md-card class="md-card"  v-for="post in userReviews"  v-bind:data="post" :key="post._id">
<mdb-view hover class="img-card">
<router-link v-bind:to="{ name: 'PostMapping', params: { id: post.mediaId} }">
<mdb-card-image :src="post.thumbnail" alt="Card image cap"></mdb-card-image>
<mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
</router-link>
</mdb-view> 
<div style="margin:0px;">
<p style="font-size: 12px;font-weight: bold;margin-bottom: 0" v-if="post.title.length<25">{{post.title|truncate(25)}}</p>
<p style="font-size: 12px;font-weight: bold;margin-bottom: 0" v-if="post.title.length>25">{{post.title|truncate(25)}}...</p>
<mdb-tbl-body>
<tr>
<th>Rating:</th>
<td  v-if="post.Rating!==0&&post.Rating===1" style="color: red">{{post.Rating}} Yawn</td>
<td  v-if="post.Rating!==0&&post.Rating!==1" style="color: red">{{post.Rating}} Yawns</td>
<td  v-if="post.Rating===0" style="color: red">Yawnfree</td>
</tr>
<tr>
<th>Comment:</th>
<td v-if="post.review.length">{{post.review|truncate(14)}}</td>
<td v-else>No review yet</td>
<td v-if="post.review.length>14"><a @click="getReview(post.review)">..more</a></td>
</tr>
<tr>
<th>Date:</th>
<td>{{post.createdOn|truncate(13)}}</td>
</tr>
</mdb-tbl-body>
</div>
</md-card>    
</div>
</div>
</div>

<div class="settings" v-show="tab==2">
<select v-model="selectedCoutry">
<option disabled selected value>choose country</option>
<option v-for="country in countries" :value="country.name">{{ country.name }}</option>
</select><br>
<span>selected country: {{ selectedCoutry }}</span>
</div>

<div class="notifications" v-show="tab==3">
<div style="display: flex; flex-direction: row;align-items: center;text-align: center;justify-content: space-between;">
<p>Marketing Emails
<input type="checkbox"  v-model="marketingEmails">
</p>
<p>Basic Emails
<input type="checkbox"  v-model="basicEmails">
</p>
</div>

</div>

</div>
</main>
<!-- end===posts or content section -->
</div>
</template>

<script>
import PostsService from '@/services/PostsService'
import axios from 'axios'
import activity from '@/router/activity'
import { Container, Navbar, NavbarItem, NavbarNav, NavbarCollapse, Btn, Fa, ListGroup, ListGroupItem, CardBody, Footer, waves,Card, CardImg, CardTitle, CardText,mdbView, mdbMask,mdbCardImage,mdbTable, mdbTblHead, mdbTblBody,mdbModal,mdbModalHeader,mdbModalTitle,mdbModalBody,mdbModalFooter} from 'mdbvue'
import 'vue-popperjs/dist/css/vue-popper.css';
const  Popper=()=>import('vue-popperjs');
const StarRating=()=>import('vue-star-rating');
const riseLoader =()=>import('vue-spinner/src/RiseLoader.vue');

export default {
name: 'Profile',
components: {
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
'riseLoader':riseLoader,
mdbView,
mdbMask,
mdbCardImage,
mdbTable,
mdbTblHead, 
mdbTblBody,
mdbModal,
mdbModalHeader,
mdbModalTitle,
mdbModalBody,
mdbModalFooter 
},

data () {
return {
url: null,
response: null,
validUrl: false,
query:'',
searchfind:false,
searchResult:[],
loading:true,
userEmail:'',
userName:'',
countries: [],
selectedCoutry: '',
tab: '1',
basicEmails:'',
marketingEmails:'',
userReviews:[],
userWatchlists:[],
shareModal:false,
myReview:''
}
},

filters: {
truncate: function(value, limit) {
if (value.length > limit) {
value = value.substring(0, (limit - 3));
}
return value
}
},
mounted () { 
this.getProfile()
},

created: function() {
this.getCountriesList()
},
methods: {
async search(){     
const response=await PostsService.search({
query:this.query
});
if(response.data.searchResult.length)
{
this.searchResult=response.data.searchResult
this.searchfind=true
}
else{
this.searchResult=''
this.searchfind=false
}
},

async getProfile(){
const token=this.$store.getters.authHeader;
if(token){
const response=await PostsService.profile({
tokenId:token
})

if(response.data.userAuth){
this.loading=false;
this.userName=response.data.user[0].Name;
this.userEmail=response.data.user[0].EmailID;
this.userReviews=response.data.userRatings;
this.userWatchlists=response.data.watchlists;
}

else{
this.logout();
}

}

},
getCountriesList: function() {
axios.get('https://restcountries.eu/rest/v1/all',{}).then((response)=>{

this.countries = response.data;

})
},
async logout(){

this.$store.dispatch('logout_auth').then(()=>{

this.$router.push({name:'Posts'})

})
},
getReview(review){
this.myReview=review
this.shareModal=true
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
width: 200px;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);
transition: 0.3s;
border-radius: 5px; /* 5px rounded corners */
padding:10px;

}
.container {
padding: 2px 16px;
}

.userReviews{

position: absolute;
width:80%;
left:0;
margin-left:15%;
margin-right: 10%;
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
margin-bottom: 5%;
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
padding: 20px;
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
}

#more-content:hover{

color:#fc8080;
}

#chip{

height:25px;
line-height: 25px;
}

.profile {
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
max-width: 400px;
margin: 20px auto;
text-align: center;
font-family: arial;
}

.title {
color: grey;
font-size: 18px;
padding-bottom: 10px;
}

.settings{

max-width: 400px;
margin: 20px auto;
text-align: center;

}

.notifications{

max-width: 400px;
margin: 20px auto;
text-align: center;

}

.img-card{
height: 60%;
overflow: hidden;
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

.profile {
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
max-width:250px;
margin: 20px auto;
text-align: center;
font-family: arial;
}

.settings{

max-width: 400px;
margin: 20px auto;
text-align: center;

}

.notifications{

max-width:300px;
margin: 20px auto;
text-align: center;

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
width:95%;
border-radius:5px; /* 5px rounded corners */
margin-left: 5px;

}

.userReviews{

position: absolute;
width:80%;
left:0;
margin-left:5%;
margin-right: 10%;
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

.profile {
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
max-width: 300px;
margin: 20px auto;
text-align: center;
font-family: arial;
}

.settings{

max-width: 400px;
margin: 20px auto;
text-align: center;

}

.notifications{

max-width:300px;
margin: 20px auto;
text-align: center;

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

.md-card{
width:100%;
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

.profile {
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
max-width: 300px;
margin: 40px auto;
text-align: center;
font-family: arial;
}

.settings{

max-width: 400px;
margin: 40px auto;
text-align: center;

}

.notifications{

max-width:300px;
margin: 40px auto;
text-align: center;

}

}

@media screen and (min-width:992px) and (max-width:1024px){

.md-card{
width:95%;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);
transition: 0.3s;
border-radius: 5px; /* 5px rounded corners */
padding: 5px;

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
grid-template-columns: repeat(4,1fr);
grid-row-gap:10px;  
font-family: 'Roboto';
}

.userReviews{

position: absolute;
width:80%;
left:0;
margin-left:20%;
margin-right:5%;
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
width:16.166%;
box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
background: #272c2e;
padding-top:80px;
z-index: 500
}


#m-nav{

display: none;
}
}

@media screen and (min-width: 1025px) and (max-width: 1280px) {

.container {
padding: 2px 16px;
width:auto;
}

.grid-container {
display: grid;
grid-template-columns: repeat(4,1fr);
grid-row-gap:10px;  
font-family: 'Roboto';
}

.userReviews{

position:absolute;
width:80%;
left:0;
margin-left:18%;
margin-right:5%;
}


.md-card{
width:90%;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);
transition: 0.3s;
border-radius: 5px; /* 5px rounded corners */
padding:10px;

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
