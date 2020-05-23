<template>
<div class="player-bottom">
  <div class="bottom-progress">
    <span ref="eleCurrentTime">00:00</span>
    <div class="progress-bar" @click="progressClick" ref="progressBar" >
      <div class="progress-line" ref="progressLine">
        <div class="progress-dot"></div>
      </div>
    </div>
    <span ref="eleTotalTime">00:00</span>
  </div>
  <div class="bottom-controll">
    <div class="loop mode" @click="mode" ref="mode"></div>
    <div class="prev" @click="prev"></div>
    <div class="play" @click="play" ref="play"></div>
    <div class="next" @click="next"></div>
    <!--v-bind动态绑定类名   使用对象来替代数组中的三目运算符按需导入-->
    <div class="favorite" @click="favorite" :class="{'active': isFavorite(currentSong)}"></div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import modeType from '../../store/modeType'
import { formatTime } from '../../tools/tools'
export default {
  name: 'PlayerBottom',
  methods: {
    ...mapActions([
      'setIsPlaying',
      'setModeType',
      'setCurrentIndex',
      'setCurrentTime',
      'setFavoriteSong',
      'setTotalTime',
      'setClickTime'
    ]),
    play () {
      // console.log(1, this.isPlaying)
      this.setIsPlaying(!this.isPlaying)
      // console.log(2, this.isPlaying)
    },
    prev () {
      this.setCurrentIndex(this.currentIndex - 1)
    },
    next () {
      this.setCurrentIndex(this.currentIndex + 1)
    },
    mode () {
      if (this.modeType === modeType.loop) {
        this.setModeType(modeType.one)
      } else if (this.modeType === modeType.one) {
        this.setModeType(modeType.random)
      } else if (this.modeType === modeType.random) {
        this.setModeType(modeType.loop)
      }
    },
    favorite () {
      this.setFavoriteSong(this.currentSong)
    },
    // 查看是否收藏过，收藏过则返回收藏歌曲
    isFavorite (song) {
      // find() 方法返回数组中满足提供的测试函数的第一个元素的值
      const result = this.favoriteList.find(function (currentValue) {
        return currentValue.id === song.id
      })
      return result !== undefined
    },
    progressClick (e) {
      // 1.计算进度条的位置
      // let normalLeft = e.target.offsetLeft
      const normalLeft = this.$refs.progressBar.offsetLeft
      const eventLeft = e.pageX
      const clickLeft = eventLeft - normalLeft
      // let progressWidth = e.target.offsetWidth
      const progerssWidth = this.$refs.progressBar.offsetWidth
      const value = clickLeft / progerssWidth
      this.$refs.progressLine.style.width = value * 100 + '%'

      // 2.计算当前应该从什么地方开始播放
      const curTime = this.totalTime * value
      console.log(curTime, 2)
      this.setClickTime(curTime)
    }
  },
  computed: {
    ...mapGetters([
      'isPlaying',
      'modeType',
      'currentIndex',
      'currentSong',
      'favoriteList',
      'totalTime',
      'currentTime',
      'clickTime'
    ])
  },
  watch: {
    isPlaying (newValue, oldValue) {
      if (newValue) {
        this.$refs.play.classList.add('active')
      } else {
        this.$refs.play.classList.remove('active')
      }
    },
    modeType (newValue, oldValue) {
      if (newValue === modeType.loop) {
        this.$refs.mode.classList.remove('random')
        this.$refs.mode.classList.add('loop')
      } else if (newValue === modeType.one) {
        this.$refs.mode.classList.remove('loop')
        this.$refs.mode.classList.add('one')
      } else if (newValue === modeType.random) {
        this.$refs.mode.classList.remove('one')
        this.$refs.mode.classList.add('random')
      }
    },
    // 出现了个bug显示  不是函数是说的里面那个那个，我把江哥的错误名称改了，又直接复制导致出错
    totalTime (newValue, oldValue) {
      const time = formatTime(newValue)
      this.$refs.eleTotalTime.innerHTML = time.minute + ':' + time.second
    },
    currentTime (newValue, oldValue) {
      // 1.格式化当前播放的时间
      const time = formatTime(newValue)
      // console.log(newValue)
      this.$refs.eleCurrentTime.innerHTML = time.minute + ':' + time.second
      // 2.根据当前播放的时间计算比例
      const value = newValue / this.totalTime * 100
      this.$refs.progressLine.style.width = value + '%'
    }
  }

}
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .player-bottom{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    /*z-index: 999;*/
    .bottom-progress{
      width: 80%;
      margin:0 auto;
      display:flex;
      justify-content: space-between;
      align-items: center;
      span{
        @include font_size($font_samll);
        @include font_color();
      }
      .progress-bar{
        width: 100%;
        margin: 0 10px;
        height: 10px;
        background: #fff;
        .progress-line{
          width: 0;
          height: 100%;
          background: #ccc;
          position: relative;
          .progress-dot{
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #fff;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    .bottom-controll{
      width: 80%;
      margin: 0 auto;
      padding: 50px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div{
        width: 84px;
        height: 84px;
      }
      .mode{
        &.loop{
          @include bg_img('../../assets/images/loop');
        }
        &.one{
          @include bg_img('../../assets/images/one');
        }
        &.random{
          @include bg_img('../../assets/images/shuffle');
        }
      }
      .prev{
        @include bg_img('../../assets/images/prev')
      }
      .play{
        @include bg_img('../../assets/images/play');
        &.active{
          @include bg_img('../../assets/images/pause');
        }
      }
      .next{
        @include bg_img('../../assets/images/next');
      }
      .favorite{
        @include bg_img('../../assets/images/un_favorite');
        &.active{
          @include bg_img('../../assets/images/favorite');
        }
      }
    }
  }
</style>
