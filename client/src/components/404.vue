<template>
  <div  class="md-layout">
  <div class="md-layout-item">
  <div class='_404'>404</div>
  <hr>
  <div class='_1'>THE PAGE WAS NOT FOUND</div>
   </div> 
  </div>

</template>

<script>

export default {
  name: 'errorPage'
}
</script>

<style type="text/css" scoped>
  
.md-layout{

  text-align: center;
  background: #000;
  color:#fff;
  font-family: 'Open Sans', sans-serif;
  height:100vh;
  overflow: hidden;
  width:100%;
  
}
.md-layout-item{

  margin-top:5%;
  display: block;
  position:absolute;
  top:10%;
  width:100%;
  margin:100px auto;

} 
  ._404{
  font-size:8em;
  position: relative;
  display: inline-block;
  z-index: 2;
  margin-bottom: 5%;
  letter-spacing: 15px;
  }
  ._1{
  display:block;
  position:relative;
  letter-spacing: 12px;
  font-size:2em;
  line-height: 80%;
  margin-top: 2%;
  padding-bottom: 5px;
  }
  hr{
      padding: 0;
      border: none;
      border-top: 5px solid #fff;
      color: #fff;
      margin: 0px auto;
      width:80%;
      height:10px;
      z-index: -10;
  }
</style>
