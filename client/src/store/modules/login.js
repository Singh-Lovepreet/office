import PostsService from '@/services/PostsService';
const state={
accesstoken: localStorage.getItem('user-token') || '',
status: '', 
adminToken:localStorage.getItem('admin-token') || '',
fbToken:localStorage.getItem('fb-token')|| '',
googleToken:localStorage.getItem('google-token')||''
};

const getters={
isAuthenticated: state => !!(state.accesstoken||state.fbToken||state.googleToken),
authStatus: state => state.status,
authHeader:(state)=>{
 	if(state.accesstoken){
			return state.accesstoken;
 	}
 	else if(state.fbToken){

 		return state.fbToken

 	}
 	else if(state.googleToken){

 		return state.googleToken
 	}
 	else{
			return '5324@!!$00';
 	}
 
 },

 isAdmin:state=>!!state.adminToken

};

const mutations={

	setToken:(state,token)=>{

		state.accesstoken=token

		state.status="success"
	},

	removeToken:(state)=>{

		state.accesstoken=''
	},

	setfbToken:(state,token)=>{

		state.fbToken=token
		state.status="success"

	},

	removefbToken:(state)=>{

		state.fbToken=''
	},


	setGoogleToken:(state,token)=>{

		state.googleToken=token
		state.status="success"

	},

	removeGoogleToken:(state)=>{

		state.googleToken=''
	},


	setAdmin:(state,token)=>{

		state.adminToken=token


	},

	removeAdmin:(state,token)=>{

		state.adminToken=''

	}

};

const actions={
	login_auth:({commit,dispatch},token)=>{
		return new Promise((resolve,reject)=>{
		localStorage.setItem('user-token',token)
		commit('setToken',token)
		resolve()
		})
	},
	logout_auth:({commit,dispatch})=>{
	return new Promise((resolve, reject) => {
      	commit('removeToken')
      	localStorage.removeItem('user-token')
      	commit('removefbToken')
    	localStorage.removeItem('fb-token')
    	commit('removeGoogleToken')
    	localStorage.removeItem('google-token')
      	resolve()
	})
	},
	admin_auth:({commit,dispatch},token)=>{
		return new Promise((resolve,reject)=>{
		localStorage.setItem('admin-token',token)
		commit('setAdmin',token)
		resolve()
		})
	},
	admin_logout:({commit,dispatch})=>{
		return new Promise((resolve, reject) => {
      	commit('removeAdmin')
      	localStorage.removeItem('admin-token')
      	resolve()
	})
	},
	fb_auth:async({commit,dispatch},payload)=>{
		const response = await PostsService.fblogin({
      	authResponse:payload.authResponse,
     	Profile:payload.profile
      	});
      	const fbToken=response.data.fbToken;
		localStorage.setItem('fb-token',fbToken)
		commit('setfbToken',fbToken)		
	},

	google_auth:async({commit,dispatch},payload)=>{
		const response = await PostsService.googlelogin({
      	idToken:payload
      	});
      	const googleToken=response.data.googleToken;
		localStorage.setItem('google-token',googleToken)
		commit('setGoogleToken',googleToken)		
	}


};


export default{

	state,
	getters,
	mutations,
	actions
};