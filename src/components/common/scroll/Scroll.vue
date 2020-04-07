<template>
  <!-- ref 通过ref明确拿到子组件 -->
  <div ref="wrapper">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: {}
    }
  },
  mounted() {
    //console.log(document.querySelector('.wrapper'));
    //最好不要通过document去拿元素，怕起名冲突拿不准确
   /*  this.scroll = new BScroll(document.querySelector('.wrapper'), {

    }) */
    //1.创建一个BScroll对象
    //给它一个ref属性，然后给个名字去拿，可以明确拿到
     if(!this.$refs.wrapper)  return
       this.scroll = new BScroll(this.$refs.wrapper, {
       click: true,
       probeType: this.probeType,
       pullUpLoad: this.pullUpLoad
    })
    //2.监听滚动位置
    this.scroll.on('scroll', (position) => {
      //console.log(position);
      this.$emit('scroll', position)//通过自定义事件把position传出去
    })

    //3.监听scroll滚动到底部
    if(this.pullUpLoad){
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    scrollTo(x, y, time=300) {//es6里面参数是可以给默认值的
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    refresh() {
      //console.log('调用了');
      this.scroll && this.scroll.refresh()
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>

</style>
