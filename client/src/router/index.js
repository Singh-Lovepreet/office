import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)
const Posts=()=>import ('.././components/Posts');
const PostMapping=()=>import ('.././components/PostMapping');
const Login=()=> import('.././components/partials/LoginModel');
const Signup=()=>import('.././components/partials/SignUpModel');
const Dashboard=()=>import('.././components/Dashboard');
const Verify =()=>import('.././components/Verify');
const testing=()=>import('.././components/testing');
const Admin=()=>import('.././components/admin/Admin');
const AdminDashboard=()=>import('.././components/admin/Dashboard');
const Profile=()=>import('.././components/Profile');
const webSeries=()=>import('.././components/contents/webSeries');
const shortFilms=()=>import('.././components/contents/shortFilms');
const movies=()=>import('.././components/contents/movies');
const channels=()=>import('.././components/contents/channels');
const channelDetail=()=>import('.././components/contents/channelDetail');
const errorPage=()=>import('.././components/404');

const notAuthenticated =(to, from, next)=>{
  if (store.getters.isAuthenticated) {
    next('/Dashboard')
  }
  else{
      next()
  }
}
const authenticated =(to, from, next)=>{
  if (store.getters.isAuthenticated) {
    next()
  }
  else{
    next('/')
  }
}

const notAdmin=(to,from,next)=>{

  if(store.getters.isAdmin){

    next('/adminDashboard')
  }

  else{

    next()
  }

}

const isAdmin =(to, from, next)=>{
  if (store.getters.isAdmin) {
    next()
  }
  else{
    next('/admin')
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Posts',
      component: Posts,
      beforeEnter:notAuthenticated
    },
    {
      path: '/media/details/:id',
      name: 'PostMapping',
      component: PostMapping,
    }, 
    {
      path: '/Dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter:authenticated
    },
    {

      path:'/verify',
      name:'Verify',
      component:Verify,
    },
    {

      path:'/profile',
      name:'Profile',
      component:Profile,
      beforeEnter:authenticated
    },
    {
      path:'/testing',
      name:'testing',
      component:testing,
    },
    {
      path:'/admin',
      name:'Admin',
      component:Admin,
      beforeEnter:notAdmin
    },
    {

      path:'/adminDashboard',
      name:'AdminDashboard',
      component:AdminDashboard,
      beforeEnter:isAdmin
    },

    {

      path:'/webseries',
      name:'webSeries',
      component:webSeries,

    },

      {

      path:'/movies',
      name:'movies',
      component:movies,

    },

      {

      path:'/shortFilms',
      name:'shortFilms',
      component:shortFilms,

    },

      {

      path:'/channels',
      name:'channels',
      component:channels,

    },

    {

      path:'/channel/detail/:publisher',
      name:'channelDetail',
      component:channelDetail,

    },

    { 
      path: '*',
      name:'errorPage', 
      component:errorPage
    }
  ]
})
