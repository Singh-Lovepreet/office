<template>
<md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active="showSnackbar" md-persistent>
<span style="font-weight: bold">Added to your watchlist!!</span>
<md-button class="md-primary" @click="showSnackbar = false">close</md-button>
</md-snackbar>
</template>


<script>
export default {
name:'snackbar',
data () {
return {
showSnackbar:false,
position: 'center',
duration:1000,
isInfinity: false
}
},
created: function () {
this.$store.watch(state => state.posts.snack, () => {
const snak = this.$store.state.posts.snack
if (snak!=='') {
this.showSnackbar = true;
this.$store.dispatch('set_snack')
}
})
}
}
</script>

<style type="text/css" scoped>
.md-snackbar{
background-color: #17202a;
width:30%;
}
</style>

