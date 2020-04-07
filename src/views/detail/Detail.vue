<template>
  <div id="detail">
    <!-- 头部导航栏 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <!-- 中间滚动部分 -->
    <scroll class="content-scroll" ref="scroll" :probe-type="3" @scroll="detailScroll">
      <!-- 属性：topImages 传入值：top-images -->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImgLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <!-- 底部工具栏 -->
    <detail-bottom-bar @addCart="addToCart"/>
     <!-- 回到顶部 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <toast :message="message" :isShow="isShow"/> -->
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
/* import Toast from 'components/common/toast/Toast' */

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    /* Toast */
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopYs: null,
      currentIndex: 0,
      /* message: '',
      isShow: false */
    }
  },
  created() {
    //1.获取iid
    this.iid = this.$route.params.iid

    //2.请求数据
    getDetail(this.iid).then(res => {
      //2-1.获取顶部的图片轮播数据
      console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages

      //2-2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      //2-3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      //2-4.保存商品的详情数据
      this.detailInfo = data.detailInfo

      //2-5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //2-6.取出评论信息
      if(data.rate.cRate != 0){
        this.commentInfo = data.rate.list[0]
      }

        /* //第一次获取：值不对
        //原因：this.$refs.params.$el压根没有渲染
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        console.log(this.themeTopYs); */

      /* this.$nextTick(() => {//数据渲染完才会调用这个函数 保证能拿到值
        //第二次获取：值不对
        //原因：图片没有计算在内
        //根据最新的数据，对应的DOM是已经被渲染出来
        //但是图片依然没有加载完(目前获取到的offsetTop不包含图片的)
        //offsetTop值不对的时候IHI，都是因为图片问题

        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        console.log(this.themeTopYs);
      }) */
    })

    //3.推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    //4.给getThemeTopYs赋值(对给this.themeTopYs赋值的操作进行防抖)
    this.getThemeTopYs = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //console.log(this.themeTopYs);
    },500)
  },
  mounted() {
  },
  destroyed() {
    //取消事件监听
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  methods: {
    detailImgLoad() {
      this.refresh()
      this.getThemeTopYs()
    },
    titleClick(index) {
      //console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
    },
    detailScroll(position) {
      //console.log(position);
      //1.获取y值
      const positionY = -position.y

      //2.positionY和主题中的值进行对比
      let length = this.themeTopYs.length
      for(let i = 0; i < this.themeTopYs.length; i++){
        if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY <
        this.themeTopYs[i+1]) || (i === length -1 && positionY >= this.themeTopYs[i]))){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      //3.是否显示回到顶部
      this.isShowBackTop = (-position.y) > 1000
    },
    addToCart() {
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.newPrice
      product.iid = this.iid

      //2.将商品加入购物车
      /* this.$store.commit('addCart', product) */
      this.$store.dispatch('addCart', product).then(res => {
        /* this.isShow = true
        this.message = res

        setTimeout(() => {
          this.isShow = false
          this.message= ''
        }, 1500) */

        this.$toast.show(res, 1500)
        console.log( this.$toast);
      })
    }
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    background-color: #fff;
    z-index: 9;
  }
  .content-scroll {
    height: calc(100% - 44px - 49px);
  }
</style>
