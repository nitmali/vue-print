<template>
  <div id="app" class="demo" ref="demo">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>

    <div class="no-print" style="border: #42b983 solid 2px; padding: 8px">
      <h3>不打印区域</h3>
      <div>
        noPrint noPrint noPrint noPrint noPrint noPrint noPrint noPrint
      </div>
      <button style="margin-top: 16px; font-size: 16px; font-weight: 700" class="print-button" @click="print">打印</button>
    </div>

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods: {
    print() {
      this.$print('#app').then(() => {
        // 无论点击打印还是取消都是进入这里
        alert('after print')
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
