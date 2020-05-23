<template>
  <transition
    :css="false"
    @enter="enter"
    @leave="leave"
  >
    <!--this.$store.getters.isFullScreen-->
    <div class="normal-player" v-show="isFullScreen">
      <div class="player-wrapper">
        <PlayerHeader></PlayerHeader>
        <PlayerMiddle :currentTime="currentTime"></PlayerMiddle>
        <PlayerBottom ></PlayerBottom>
      </div>
      <div class="player-bg">
        <img :src="currentSong.picUrl" alt="">
      </div>
    </div>
  </transition>
</template>

<script>
import PlayerHeader from './PlayerHeader'
import PlayerMiddle from './PlayerMiddle'
import PlayerBottom from './PlayerBottom'
import { mapActions, mapGetters } from 'vuex'
import Velocity from 'velocity-animate'
import 'velocity-animate/velocity.ui'
export default {
  name: 'NormalPlayer',
  components: {
    PlayerHeader,
    PlayerMiddle,
    PlayerBottom
  },
  methods: {
    ...mapActions([
      'getSongLyric'
    ]),
    enter (el, done) {
      Velocity(el, 'transition.shrinkIn', { duration: 650 }, function () {
        done()
      })
    },
    leave (el, done) {
      Velocity(el, 'transition.shrinkOut', { duration: 650 }, function () {
        done()
      })
    }
  },
  computed: {
    ...mapGetters([
      'isFullScreen',
      'currentSong',
      'currentTime',
      'totalTime'
    ])
  },
  watch: {
    // 当前歌曲发生变化，重新获取歌词
    currentSong (newValue, oldValue) {
      // 歌曲被删除不存在时不获取歌词
      if (newValue.id === undefined) {
        return
      }
      this.getSongLyric(newValue.id)
    }
  }
  // props: {
  //   totalTime: {
  //     type: Number,
  //     default: 0,
  //     required: true
  //   },
  //   currentTime: {
  //     type: Number,
  //     default: 0,
  //     required: true
  //   }
  // }
}
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .normal-player{
    position: fixed;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    @include bg_sub_color();
  .player-wrapper{
    position: relative;
    z-index: 999;
  }
    .player-bg{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      img{
        position: absolute;
        height: 100%;
        filter:blur(10px);
      }
    }
  }
</style>
