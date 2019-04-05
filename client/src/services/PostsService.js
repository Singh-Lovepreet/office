import Api from '@/services/Api';

export default {
fetchPosts (params) {
return Api().get('posts/'+params.tokenId);
},
fetchWebSeries () {
return Api().get('webseries');
},
fetchFilteredSeries(params){
return Api().get('filteredseries/'+ params.query)
},
fetchShortFilms(){

return Api().get('shortFilms');
},

fetchChannels(){

	return Api().get('channels');
},
getChannelData(params){

	return Api().get('channel/detail/'+ params.publisher)
},
getPost (params) {
return Api().get('post/' + params.id);
},

ratePost (params) {
return Api().post('posts', params);
},

postCount(params){

return Api().post('singlePostData',params);

},

seriesCount(params){

return Api().post('seriesPostData',params);

},
getMappedPost (params) {
return Api().get('media/details/' + params.id + ',' + params.tokenId);
},

login(params) {
return Api().get('login/' + params.EmailID + ',' + params.Password);
},

fblogin(params){

return Api().post('fblogin',params);

},

googlelogin(params){

return Api().post('googlelogin',params);

},

getExistingAlbum(){
return Api().get('/getExistingAlbum');
},

signup(params) {
return Api().post('signup', params);
},

userInterests(params){

return Api().post('userInterests/',params);
},
search(params){
return Api().get('search/' + params.query);
},

verify(params){
return Api().get('verification/'+ params.token)
},

adminLogin(params){

return Api().get('admin/'+ params.EmailID+','+params.Password);
},

insertData(params){

return Api().post('insertData',params);

},

fetchData(){

return Api().get('fetchData');
},

profile(params){

return Api().get('profileData/'+ params.tokenId)
},

favorite(params){

return Api().post('favorite/',params)
},

recommendations(params){

return Api().get('recommendations/'+ params.userToken)

}

};