<template>
<div id="container">
<div style="display: flex; flex-direction:row;text-align: center; align-items: center; justify-content: space-between;" class="navbar">
<p style="font-size:38px;font-weight: bold;font-family: 'Oswald';color: #fff">Yawnmeter Dashboard</p>
<button  class="admin_btn" @click="logout">LogOut</button>
</div>
<div style="box-shadow: 5px 10px #888888:">
<div id="left-box">
<label>is the video belongs to kids section?</label>
<input type="checkbox" name="kids" v-model="kids">
<br>
<label style="margin-right: 20px">1. Choose the Content Type*:</label>
<input type="radio"  value="series" v-model="content">Series
<input type="radio"  value="singles" v-model="content" style="margin-left:40px">Singles<br>

<div v-if="content=='series'">
<select v-model="selected">
<option disabled value="">Existing or New</option>
<option>Existing</option>
<option @click="clearfields()">New</option>
</select>
<input v-if="selected=='New'" type="text" name="seriesPublisher" placeholder="Name of the series publisher" v-model="seriesPublisher">
</div>

<div v-if="content=='singles'">
<input type="text" name="singlesPublisher" placeholder="singles publisher name" v-model="singlesPublisher">
</div>
<div v-if="selected=='Existing'&&content!=='singles'" id="series-box">
<label>choose the Existing Series*(only one at a time)</label>
<input type="text" v-model="search" placeholder="Search title.."/>
<div class="grid-container">
<md-card class="md-card"  v-for="post in filteredData"  v-bind:data="post" :key="post._id">
<input type="checkbox"  @change="check(post)" v-model="seriesCheck" :value="post._id" 
:disabled="seriesCheck.length >=1 && seriesCheck.indexOf(post._id) == -1">
<label>select</label>
<md-card-media md-ratio="16:9">
<img :src="post.thumbnail">
</md-card-media>
<p style="font-size:12px;font-weight:bold;margin-bottom: 0"><u>{{post.title}}</u></p>
<p style="font-size: 10px;font-weight:bold">{{post.publisher}}</p>
</md-card>    
</div>
</div>

<label for="url" v-if="selected=='Existing'||content=='singles'">2. Type an url*:</label>
<input v-if="selected=='Existing'||content=='singles'" type="text" name="urlfield" v-model="url" placeholder="Type an  url ...">

<label for="Title">3. Title*:</label>
<input type="text" name="title" v-model="title" placeholder="Title of the Content(required)*">

<label for="imageUrl">4.upload an image*:(480px*270px)</label>
<input type="file" ref="myFiles"  @change="previewFiles" accept="image/*"><br>

<div>
<label style="margin-right: 10px">5. Rating*:</label>
<select :disabled="yawnfree" style="width: 20%;position:relative;" v-model="starRating">
<option disabled selected="true">Select Yawns</option>
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
<option>6</option>
</select>
<a @click="starRating=0;">reset star ratings</a>
<p style="font-family: 'Oswald';font-weight: bold;font-size: 20px">OR</p>
<label>yawnfree</label>
<input type="checkbox" name="yawnfree" v-model="yawnfree" :disabled="starRating>0">
</div>
<label style="margin-right: 10px">6.Released Date*:</label>
<select style="width: 20%;position:relative;" v-model="month">
<option disabled value="">Month</option>
<option v-for="month in months">{{month.month}}</option>
</select>
<select style="width: 20%;position:relative;" v-model="year">
<option disabled value="">Year</option>
<option v-for="year in years">{{year.year}}</option>
</select>
<br>
<label for="imageUrl">7.Cast*:</label>
<textarea rows="4" cols="100" maxlength="200" placeholder="Enter the casts...(required*).....maximum characters length is 200" v-model="cast"></textarea>
<br>
<article v-if="!kids">
<label>8.Select tags</label>
<input type="checkbox" value="Family Safe" v-model="tags">
<label>family safe</label>
<input type="checkbox" value="18+" v-model="tags">
<label>18+</label>
</article>
</div>

<div class="right-box">
<label for="imageUrl">10. Description*:</label>
<textarea rows="6" cols="50" maxlength="800" placeholder="Enter the description...(required*).....maximum characters length is 800" v-model="description"></textarea>

<label>11. Review:(500 characters limit)</label>
<textarea rows="6" cols="50" maxlength="500" placeholder="Enter your review..." v-model="review"></textarea>
</div>
</div>

<div>
<div id="left-filter">

<label>9. filters*:(multiple selection allowed)</label>
<div v-if="!kids" style="display: flex;flex-direction: column;">
<p><u>Genres*:</u></p>
<ul>
<li v-for="filters in categories">
<input type="checkbox" :value="filters.category" :id="filters.category" v-model="genres">
<label> {{filters.category}}</label>
</li>
</ul>	
</div>
<p><u>Content Language*:</u></p>
<ul>
<li v-for="lang in languages">
<input type="checkbox" :value="lang.language" :id="lang.language" v-model="contentLanguages">
<label>{{lang.language}}</label>
</li>
</ul>	
</div>
<p style="font-size:16px;font-weight: bold; color: green">{{responseStatus}}</p>
<md-progress-bar class="md-accent" md-mode="query" v-if="loading" ></md-progress-bar>
<button type="button" class="btn" @click="insertData()" :disabled="!checked">submit</button>
</div>
</div>
</div>

</template>

<script>
import PostsService from '@/services/PostsService';
export default{

name:'AdminDashboard',
data () {
return {
url:'',
content:'',
selected:'',
existingId:'',
existingPublisher:'',
seriesPublisher:'',
singlesPublisher:'',
responseStatus:'',
existingData:[],
error_msg:'',
starRating:0,
rating:0,
yawnfree:false,
categories:[],
review:'',
languages:[],
genres:[],
contentLanguages:[],
seriesCheck:[],
title:'',
imageUrl:'',
description:'',
cast:'',
search: '',
loading:false,
month:'',
year:'',
months:[],
years:[],
tags:[],
kids:'',
kidsData:[]
}
},

mounted () { 
this.getCalendar();
},

created(){

this.fetchData();

},

computed:{
checked(){
if(this.yawnfree){

	this.rating=0
}
else{

	this.rating=Number(this.starRating)
}

if(this.Content!==''){

if(!this.kids){
if(this.content==='series'&&this.selected==='Existing'&&(this.starRating||this.yawnfree)&&this.genres.length
&&this.contentLanguages.length&&this.seriesCheck.length===1&&this.title!==''&&this.imageUrl!==''
&&this.description!==''&&this.url!==''&&this.month!==''&&this.year!==''&&this.tags.length&&this.cast!==''){
return true
}
else if(this.content==='series'&&this.selected==='New'&&this.seriesPublisher!==''&&(this.starRating||this.yawnfree)&&this.genres.length&&this.contentLanguages.length&&this.title!==''&&this.imageUrl!==''
	&&this.description!==''&&this.month!==''&&this.year!==''&&this.tags.length&&this.cast!=''){
	return true
}
else if(this.content==='singles'&&this.singlesPublisher!==''&&(this.starRating||this.yawnfree)&&this.genres.length&&this.contentLanguages.length&&this.title!==''&&this.imageUrl!==''&&this.description!==''&&this.url!==''
	&&this.month!==''&&this.year!==''&&this.tags.length){
return true
}
else{
return false
} 

}
if(this.kids){
if(this.content==='series'&&this.selected==='Existing'&&(this.starRating||this.yawnfree)
&&this.contentLanguages.length&&this.seriesCheck.length===1&&this.title!==''&&this.imageUrl!==''
&&this.description!==''&&this.url!==''&&this.month!==''&&this.year!==''&&this.cast!==''){
return true
}
else if(this.content==='series'&&this.selected==='New'&&this.seriesPublisher!==''&&(this.starRating||this.yawnfree)&&this.contentLanguages.length&&this.title!==''&&this.imageUrl!==''
	&&this.description!==''&&this.month!==''&&this.year!==''&&this.cast!==''){
	return true
}
else if(this.content==='singles'&&this.singlesPublisher!==''&&(this.starRating||this.yawnfree)&&this.contentLanguages.length&&this.title!==''&&this.imageUrl!==''&&this.description!==''&&this.url!==''
	&&this.month!==''&&this.year!==''){
return true
}
else{
return false
} 
}


}
},

filteredData:function()
{
var self=this;
if(!this.kids){

return this.existingData.filter(function(data){
return data.title.toLowerCase().indexOf(self.search.toLowerCase())>=0||data.publisher.toLowerCase().indexOf(self.search.toLowerCase())>=0;
});

}

if(this.kids){

return this.kidsData.filter(function(data){
return data.title.toLowerCase().indexOf(self.search.toLowerCase())>=0||data.publisher.toLowerCase().indexOf(self.search.toLowerCase())>=0;
});

}

//return this.customers;
}

},

methods:{

previewFiles(event) {
var input = event.target;
if (input.files && input.files[0]) {
var reader = new FileReader();
reader.onload = (e) => {
this.imageUrl = e.target.result;
}
 reader.readAsDataURL(input.files[0]);
}
},

async logout(){

this.$store.dispatch('admin_logout').then(()=>{

this.$router.push({name:'Admin'})

})
},

async insertData(prevue) {

const year=Number(this.year);
const month=Number(this.month);

if(this.content==='series' && this.selected==='Existing'&&!this.kids){
this.loading=true;
const response = await PostsService.insertData({
title:this.title,
thumbnail:this.imageUrl,
description:this.description,
url:this.url,
contentType:this.content,
id:this.existingId,
publisher:this.existingPublisher,
review:this.review,
rating:this.rating,
genres:this.genres,
languages:this.contentLanguages,
month:month,
year:year,
tags:this.tags,
contentSection:'webseries',
cast:this.cast
});

if(response){
this.loading=false;
this.responseStatus=response.data.result;
const self=this;
setTimeout(function(){ 
self.$router.go(); 
}, 1000);

}

}

if(this.content==='series' && this.selected==='New'&&!this.kids){
this.loading=true;
const response = await PostsService.insertData({
title:this.title,
thumbnail:this.imageUrl,
description:this.description,
contentType:this.content,
publisher:this.seriesPublisher,
review:this.review,
rating:this.rating,
genres:this.genres,
languages:this.contentLanguages,
month:month,
year:year,
tags:this.tags,
contentSection:'webseries',
cast:this.cast
});

if(response){
this.loading=false;
this.responseStatus=response.data.result;
const self=this;
setTimeout(function(){ 
self.$router.go(); 
}, 1000);
}
}



if(this.content==="singles"&&!this.kids){
this.loading=true;
const response = await PostsService.insertData({
title:this.title,
thumbnail:this.imageUrl,
description:this.description,
url:this.url,
contentType:this.content,
publisher:this.singlesPublisher,
review:this.review,
rating:this.rating,
genres:this.genres,
languages:this.contentLanguages,
month:month,
year:year,
tags:this.tags,
contentSection:'shortFilms'
});

if(response){
this.loading=false;
this.responseStatus=response.data.result;
const self=this;
setTimeout(function(){ 
self.$router.go(); 
}, 1000);
}
}

//kids section logic
if(this.content==='series' && this.selected==='Existing'&&this.kids){
this.loading=true;
const response = await PostsService.insertData({
title:this.title,
thumbnail:this.imageUrl,
description:this.description,
url:this.url,
contentType:this.content,
id:this.existingId,
publisher:this.existingPublisher,
review:this.review,
rating:this.rating,
languages:this.contentLanguages,
month:month,
year:year,
contentSection:'kids',
cast:this.cast
});

if(response){
this.loading=false;
this.responseStatus=response.data.result;
const self=this;
setTimeout(function(){ 
self.$router.go(); 
}, 1000);

}

}

if(this.content==='series' && this.selected==='New'&&this.kids){
this.loading=true;
const response = await PostsService.insertData({
title:this.title,
thumbnail:this.imageUrl,
description:this.description,
contentType:this.content,
publisher:this.seriesPublisher,
review:this.review,
rating:this.rating,
languages:this.contentLanguages,
month:month,
year:year,
contentSection:'kids',
cast:this.cast
});

if(response){
this.loading=false;
this.responseStatus=response.data.result;
const self=this;
setTimeout(function(){ 
self.$router.go(); 
}, 1000);
}
}



if(this.content==="singles"&&this.kids){
this.loading=true;
const response = await PostsService.insertData({
title:this.title,
thumbnail:this.imageUrl,
description:this.description,
url:this.url,
contentType:this.content,
publisher:this.singlesPublisher,
review:this.review,
rating:this.rating,
languages:this.contentLanguages,
month:month,
year:year,
contentSection:'kids'
});

if(response){
this.loading=false;
this.responseStatus=response.data.result;
const self=this;
setTimeout(function(){ 
self.$router.go(); 
}, 1000);
}
}


},

async fetchData(){

const response=await PostsService.fetchData();

if(response){

this.existingData=response.data.fetchData;
this.kidsData=response.data.kidsData;
this.categories=JSON.parse(response.data.categories);
this.languages=JSON.parse(response.data.languages);

}

if(this.selected==='New'){

this.existingData=''
}
},

check(post){   
this.existingId=post._id;
this.existingPublisher=post.publisher;
},

setRating: function(rating) {
this.starRating =rating;
},

clearfields:function(){

this.url=''

},

getCalendar:function(){

for(var i=1;i<=12;i++){

this.months.push({month:i})

}

const date=new Date();
const currentYear=date.getFullYear();
for(var i=1990; i<=currentYear; i++)  {

    this.years.push({year:i});
}

}

}
}


</script>

<style type="text/css" scoped>
@import url(https://fonts.googleapis.com/css?family=Oswald:400);

* {
box-sizing: border-box;
}
.md-card{
width:95%;
box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);
transition: 0.3s;
border-radius: 5px; /* 5px rounded corners */

}
.grid-container {
display: grid;
grid-template-columns: repeat(3,1fr);
grid-row-gap:20px;  
font-family: 'Roboto';
margin-bottom: 5%;
}

textarea {
resize: none;
}

li{

margin-bottom: 2px;
list-style: none; 
display: inline-block;
padding:1px;
}

label{

margin-top:1px;
font-family: 'Roboto';
font-size: 16px;
color:#000;
font-weight:450;
}

button{
width: 100%;
background-color: #4CAF50;
color: white;
padding: 14px 20px;
margin: 8px 0;
border: none;
border-radius: 4px;
cursor: pointer;
text-align: center;
}

button:disabled{

width: 100%;
color: white;
padding: 14px 20px;
margin: 8px 0;
border: none;
border-radius: 4px;
background-color:grey;
}


input[type="text"]:focus {
border: 2px solid #16a085;
color: #000;
transition: 0.2s ease;
}

textarea{

display: block;
box-sizing: border-box;
margin-left:20px;
width:40%;
border:2px solid #ccc;
font-family: 'Roboto', sans-serif;
font-weight: 400;
font-size: 15px;
transition: 0.2s ease;

}

textarea:focus{
border: 2px solid #16a085;
color: #000;
transition: 0.2s ease;
}

input[type=text], select {
width: 95%;
padding: 10px 20px;
margin:6px 0;
display: inline-block;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
}

input[type="checkbox"]{
display: inline-block;
border: 1px solid green;
}

div {
background-color: #f2f2f2;
padding:5px;
}

.admin_btn{

height:50px;
width:100px;
background-color:black;
cursor: pointer;
text-align: center;
font-family: 'Oswald';
font-size: 1.5em;
transition: opacity .45s;
}

.admin_btn:hover{

opacity: 0.6;

}

#series-box{

overflow-x: hidden;
overflow-y: scroll;
scroll-behavior: smooth;
border:8px solid #dcdcdc;
height:400px;
width:95%;
margin-bottom:10px; 
}

#left-box{

width:49.5%;

float: left;

}

#right-box{

width:49.5%;
float: right;
}

#left-filter{

width:40%;
}

.navbar{

	background-color: #000;
}
</style>