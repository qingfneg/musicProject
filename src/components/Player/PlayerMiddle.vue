<template>
  <swiper  :options="swiperOptions" class="banner">
    <swiper-slide class="cd">
      <div class="cd-wrapper" ref="cdWrapper">
        <img :src="currentSong.picUrl" alt="">
      </div>
      <p>{{getFirstLyric()}}</p>
    </swiper-slide>
    <swiper-slide class="lyric" ref="lyric">
      <ScrollView ref="scrollView">
        <ul>
          <!--动态给对应数字的高亮歌词添加active属性-->
          <li v-for="(value ,key) in currentLyric" :key="key" :class="{'active' : currentLineNum === key}">{{value}}</li>
        </ul>
      </ScrollView>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import ScrollView from '../ScrollView'
import { mapGetters } from 'vuex'
export default {
  name: 'PlayerMiddle',
  components: {
    Swiper,
    SwiperSlide,
    ScrollView
  },
  data () {
    return {
      swiperOptions: {
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
          bulletClass: 'my-bullet',
          bulletActiveClass: 'my-bullet-active'
        },
        // 如果内容是从服务器获取的, 请加上这三个配置  监视器的设置参数
        observer: true,
        observeParents: true,
        observeSlideChildren: true
      },
      currentLineNum: '0'
    }
  },
  computed: {
    ...mapGetters([
      'isPlaying',
      'isFullScreen',
      'currentSong',
      'currentLyric',
      'currentIndex',
      'currentTime'
    ])
  },
  // Watch属性是专门用于监听数据变化的, 只要数据发生了变化, 就会自动调用对应数据的回调方法
  watch: {
    isPlaying (newValue, oldValue) {
      if (newValue) {
        this.$refs.cdWrapper.classList.add('active')
      } else {
        this.$refs.cdWrapper.classList.remove('active')
      }
    },
    isFullScreen (newValue, oldValue) {
      if (newValue) {
        this.$refs.scrollView.refresh()
      }
    },
    // 当播放时间变化没歌词高亮跟着变化和移动
    currentTime (newValue, oldValue) {
      /*
      // 1.高亮歌词同步
      let lineNum = Math.floor(newValue) + ''
      let result = this.currentLyric[lineNum]
      if (result !== undefined && result !== '') {
        this.currentLineNum = lineNum
        // 2.歌词滚动同步
        let currentLyricTop = document.querySelector('li.active').offsetTop
        let lyricHeight = this.$refs.lyric.$el.offsetHeight
        if (currentLyricTop > lyricHeight / 2) {
          console.log('开始滚动')
          this.$refs.scrollView.scrollTo(0, lyricHeight / 2 - currentLyricTop, 100)
        }
      }
      */
      try {
        // 1.高亮歌词同步
        // 向下取整 Math.floor()
        const lineNum = Math.floor(newValue)
        this.currentLineNum = this.getActiveLineNum(lineNum)
        // 2.歌词滚动同步
        // querySelector( ) 可以使用它们的 id, 类, 类型, 属性, 属性值等来选取元素。
        // 获取高亮的歌曲元素的的偏移位
        const currentLyricTop = document.querySelector('.lyric .active').offsetTop
        // 获取歌词盒子高度
        const lyricHeight = this.$refs.lyric.$el.offsetHeight
        // 假如高亮歌词的偏移位大于盒子的一半做位移
        if (currentLyricTop > lyricHeight / 2) {
          this.$refs.scrollView.scrollTo(0, lyricHeight / 2 - currentLyricTop, 100)
        } else {
          this.$refs.scrollView.scrollTo(0, 0, 100)
        }
      } catch (e) {
        console.log('没有歌词')
      }
    },
    // 当歌曲发生变化，歌词发生变化重新设置第一句高亮的歌词对应的数字，一般为0
    currentLyric (newValue, oldValue) {
      for (const key in this.currentLyric) {
        this.currentLineNum = key
        // console.log(key)
        return
      }
    }
  },
  methods: {
    // 获取第一句歌词
    getFirstLyric () {
      for (const key in this.currentLyric) {
        return this.currentLyric[key]
        /*   var a=[1,2,3];
        for(let i in a){
          console.log(i);//0 1 2
          console.log(a[i]);//1 2 3
        }
        var a=[1,2,3];
        for(let i of a){
          console.log(i);//1 2 3
        }
        */
      }
    },
    // 获取高亮歌词的时间数字
    getActiveLineNum (lineNum) {
      // 向下取整传入的当前数字小于0，还是保持当前的歌词时间索引
      if (lineNum < 0) {
        return this.currentLineNum
      }
      // 获取高亮歌词
      const result = this.currentLyric[lineNum + '']
      // 假如是点击后，当前的时间查找不到歌词
      if (result === undefined || result === '') {
        // // 歌词要立即跳到能显示的，就是把当前时间减一递归，一直减到递归的时间有个词跳出这个递归，进入else里
        lineNum--
        // console.log(lineNum, '--')
        // // 这里用到了递归让他继续原来的方法 如果不用递归让他继续
        return this.getActiveLineNum(lineNum)
      } else {
        return lineNum + ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
.banner{
  position: fixed;
  top: 150px;
  bottom: 250px;
  left: 0;
  right: 0;
  .cd{
    .cd-wrapper{
      display: block;
      width: 500px;
      height: 500px;
      /*盒子居中*/
      margin: 0 auto;
      border-radius: 50%;
      overflow: hidden;
      border: 30px solid #fff;
      animation: sport 3s linear infinite;
      animation-play-state: paused;
      &.active{
        animation-play-state: running;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
    p{
      text-align: center;
      @include font_size($font_medium);
      @include font_color();
      margin-top: 50px;
    }
  }
  .lyric{
    li{
      text-align: center;
      @include font_color();
      @include font_size($font_medium);
      margin: 10px 0;
      &:last-of-type{
        padding-bottom: 50%;
      }
      &.active{
        color: #ffffff;
      }
    }
  }
}
  @keyframes sport {
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }
</style>
<style lang="scss">
  @import "../../assets/css/mixin";
  .my-bullet{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 10px ;
    background: #fff;
    margin: 0 20px;
  }
  .my-bullet-active{
    width: 60px;
    @include bg_color();
  }
</style>
