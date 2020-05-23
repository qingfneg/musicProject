<template>
  <transition
    :css="false"
    @enter="enter"
    @leave="leave">
    <!--v-show="this.$store.state.isFullScreen"-->
    <div class="mini-player" v-show="isShowMiniPlayer">
      <div class="player-wrapper">
        <div class="player-left" @click="showNormalPlayer">
          <img :src="currentSong.picUrl" ref='cd' alt="">
          <div class="player-title">
            <h3>{{currentSong.name}}</h3>
            <p>{{currentSong.singer}}</p>
          </div>
        </div>
        <div class="player-right">
          <div class="play" ref="play" @click="play" ></div>
          <div class="list" @click.stop="showList"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Velocity from 'velocity-animate'
import 'velocity-animate/velocity.ui'
export default {
  name: 'MiniPlayer',
  methods: {
    ...mapActions([
      'setFullScreen',
      'setMiniPlayer',
      'setListPlayer',
      'setIsPlaying'
    ]),
    showList () {
      this.setListPlayer(true)
      this.setMiniPlayer(false)
    },
    showNormalPlayer () {
      this.setFullScreen(true)
      this.setMiniPlayer(false)
    },
    enter (el, done) {
      Velocity(el, 'transition.bounceUpIn', { duration: 650 }, function () {
        done()
      })
    },
    leave (el, done) {
      Velocity(el, 'transition.bounceDownOut', { duration: 650 }, function () {
        done()
      })
    },
    play () {
      this.setIsPlaying(!this.isPlaying)
    }
  },
  computed: {
    ...mapGetters([
      'isShowMiniPlayer',
      'isPlaying',
      'currentSong'
    ])
  },
  watch: {
    isPlaying (newValue, oldValue) {
      if (newValue) {
        this.$refs.play.classList.add('active')
        this.$refs.cd.classList.add('active')
      } else {
        this.$refs.play.classList.remove('active')
        this.$refs.cd.classList.remove('active')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .mini-player{
    position: fixed;
    z-index: 999;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 150px;
    .player-wrapper{
      width: 100%;
      height: 100%;
      @include bg_color();
      display: flex;
      justify-content: space-between;
      align-items: center;
      .player-left{
        display: flex;
        padding-left: 30px;
        width: 50%;
        img{
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-right: 20px;
          animation: sport 3s linear infinite;
          animation-play-state: paused;
          &.active{
            animation-play-state: running;
          }
        }
        .player-title{
          display: flex;
          flex-direction: column;
          justify-content: center;
          @include no-wrap();
          h3{
            @include font_size($font_medium);
            @include font_color();
          }
          p{
            @include font_size($font_medium_s);
            @include font_color();
          }
        }
      }
      .player-right{
        display: flex;
        align-items: center;
        .play{
          width: 84px;
          height: 84px;
          @include bg_img('../../assets/images/play');
          &.active{
            @include bg_img('../../assets/images/pause');
          }
        }
        .list{
          width: 120px;
          height: 120px;
          @include bg_img('../../assets/images/list')
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
