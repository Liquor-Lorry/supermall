import { debounce } from "./utils";
import BackTop from 'components/content/backTop/BackTop'
import {POP, SELL, NEW} from "@/common/const";

export const itemListenerMixin = {
  //data也可以混入  另外：components、methods都可以混入
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 500)
    this.itemImgListener = () => {
      this.refresh()
    }
    //保存事件监听
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}


export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)//拿到组件的scrollTo方法，默认值为300
    }
  }
}


export const tabControlMixin = {
  data() {
    return {
      currentType: POP
    }
  },
  methods: {
    tabControlClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}

//两个组件之间想要复用代码 --> 利用混入来封装
