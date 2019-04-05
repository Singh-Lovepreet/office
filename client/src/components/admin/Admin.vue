<template>
<div id="container">
  <div style="display: flex; flex-direction:row;text-align: center; align-items: center;justify-content:center;">
  <p class="heading">Welcome to Admin Panel</p>
  </div>
  <div id="login"> 
    <form @submit.prevent="handleSubmit">                
    <input type="email" name="EmailId" v-model="EmailId" placeholder="E-mail Id" v-validate="'required|email'"/>
    <p class="text-danger" v-if="submitted && errors.has('EmailId')">{{ errors.first('EmailId') }}</p>
    <input type="password" name="Password" v-model="Password" placeholder="Password" v-validate="{ required: true}"/>
    <p class="text-danger" v-if="submitted && errors.has('Password')">{{ errors.first('Password') }}</p>
    <input type="submit" name="login_submit" value="Sign In"/>
    </form>
</div>
</div>
</template>
<script>
  import PostsService from '@/services/PostsService'
  export default {
    name: 'Admin',
    data () {
    return {
      EmailId: '',
      Password: '',
      submitted: false
    };
    },
    methods:{
      handleSubmit() {
        this.submitted = true;
        this.$validator.validate().then(valid => {
        if (valid) {
           this.login();
          }
      });
      },
    async login(){
      const response = await PostsService.adminLogin({
      EmailID:this.EmailId,
      Password:this.Password
      });
      if(response.data.token) {

      const token=response.data.token
      this.$store.dispatch('admin_auth',token).then(()=>{
      this.$router.push({name:'AdminDashboard'});
        
      })
        
      }
      }
      }
      };
</script>

<style scoped>

#container{

  position: absolute;
  left:30%;
  top:20%;
  width:500px;
  height:400px;
  background-color: #dcdcdc;
}

#login{

  display: flex;
  justify-content:center;
  flex-direction: column;
  align-items: center;
  padding-top:40px; 
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

.heading{

    font-weight: bold;
    font-size: 24px;

    margin:5px;
    font-family: 'Roboto';
}

</style>
