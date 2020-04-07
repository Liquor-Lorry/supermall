<template>
  <div id="app">
    <keep-alive exclude="Detail"><!-- 将Detail详情页排除在外 -->
      <router-view/>
    </keep-alive>

    <main-tab-bar/>

    <icon></icon>
    <svg-icon></svg-icon>
  </div>
</template>

<script>
import MainTabBar from 'components/content/mainTabBar/MainTabBar'
import Icon from 'components/content/Icon/Icon.vue'
import SvgIcon from 'components/content/Icon/svg.vue'

export default {
  name: "App",
  components: {
    MainTabBar,
    Icon,
    SvgIcon
  }
}
</script>

<style scoped>
  @import "./assets/css/base.css";
</style>
