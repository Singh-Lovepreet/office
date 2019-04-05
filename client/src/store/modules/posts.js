import PostsService from '@/services/PostsService';
const state={
isfavorite:'',
snack:''
};

const getters={
favorite_status: state => !!state.isfavorite,
};

const mutations={

	setfavorite:(state,status)=>{
		state.isfavorite=status

		state.snack=true
	},

	setSnack:(state,snack)=>{

		state.snack=snack
	}
};

const actions={
	favorite_list:async({commit,dispatch},payload)=>{
		const response = await PostsService.favorite({
      	userToken:payload.token,
     	media:payload.post
      	});
      	const status=response.data.result;
		commit('setfavorite',status)		
	},

	set_snack:async({commit,dispatch})=>{
		commit('setSnack','')		
	}
};


export default{

	state,
	getters,
	mutations,
	actions
};