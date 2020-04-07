<template>
  <div class="tab-bar-item" @click="itemClick()">
    <div v-if="!isActive" >
      <slot name="item-icon"></slot>
    </div>
    <div v-else >
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>

    <!-- 所有的item都展示同一个图片和文字 -->
    <!-- <img src="../../assets/img/tabbar/home.png" alt="">
    <div>首页</div> -->
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      // isActive: true

    }
  },
  computed: {
    isActive() {
      //  /home -> item1(/home) = true
      //  /home -> item2(/category) = false
      //  /home -> item3(/cart) = false
      //  /home -> item4(/profile) = false
      return this.$route.path.indexOf(this.path) !== -1//代表找到了
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {}
    }
  },
  methods: {
    itemClick() {
      this.$router.replace(this.path)
    }
  }
}
</script>

<style scoped>
  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }

  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
</style>
