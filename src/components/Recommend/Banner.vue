<template>
  <!--swiper的bug,如果数据是从网络获取的, 那么自动轮播到最后一页之后就不轮播了-->
  <!--只需要在swiper组件上面加上v-if="数据.length > 0"-->
  <swiper ref="mySwiper" :options="swiperOptions" class="banner" v-if ="banners.length > 0">
    <swiper-slide v-for="value in banners" :key="value.bannerId" class="item">
      <!--在src 和href前面要加：-->
      <a :href="value.url">
        <img :src="value.pic" alt="">
      </a>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  name: 'Banner',
  data () {
    return {
      swiperOptions: {
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination'
        },
        loop: true, // 循环模式选项
        autoplay: {
          delay: 1000, // 自动切换的时间间隔，单位ms
          stopOnLastSlide: false, // 当切换到最后一个slide时停止自动切换
          disableOnInteraction: false // 用户操作swiper之后，是否禁止autoplay。
        },
        // 如果内容是从服务器获取的, 请加上这三个配置  监视器的设置参数
        observer: true,
        observeParents: true,
        observeSlideChildren: true
      }
    }
  },
  props: {
    banners: {
      // 要求传递的类型是数组
      type: Array,
      // 默认是一个空数组
      default: () => [],
      // prop 必须传递值
      required: true
    }
  },
  components: {
    Swiper,
    SwiperSlide
  }
}
</script>

<style scoped lang="scss">
.banner{
  .item{
    img{
      width: 100%;
      height: 300px;
    }
  }
}
</style>

<style lang="scss">
  /*注意点: 如果想覆盖swiper的样式, 那么style标签不能是scoped的, 否则无法覆盖,需要是全局的*/
  @import "../../assets/css/mixin";
  .banner{
    /*小圆点*/
    .swiper-pagination-bullet{
      height: 16px;
      width: 16px;
      background: #fff;
      opacity: 1;
    }
    .swiper-pagination-bullet-active{
      @include bg_color();
    }
  }
</style>
