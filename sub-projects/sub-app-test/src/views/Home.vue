<template>
  <div class="home">
    <HelloWorld msg="this is a home page！TEST"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '../components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
