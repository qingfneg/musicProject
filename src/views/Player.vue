<template>
<div class="player">
  <NormalPlayer></NormalPlayer>
  <MiniPlayer></MiniPlayer>
  <ListPlayer></ListPlayer>
  <audio  :src="currentSong.url" ref="audio" @timeupdate="timeupdate" @ended="ended"></audio>
</div>
</template>

<script>
import NormalPlayer from '../components/Player/NormalPlayer'
import MiniPlayer from '../components/Player/MiniPlayer'
import ListPlayer from '../components/Player/ListPlayer'
import { mapGetters, mapActions } from 'vuex'
import mode from '../store/modeType'
import { getRandomIntInclusive, setLocalStorage, getLocalStorage } from '../tools/tools'
export default {
  name: 'Player',
  components: {
    NormalPlayer,
    MiniPlayer,
    ListPlayer
  },
  computed: {
    ...mapGetters([
      'currentSong',
      'isPlaying',
      'currentIndex',
      'currentTime',
      'totalTime',
      'clickTime',
      'modeType',
      'songs',
      'favoriteList',
      'historyList'
    ])
  },
  methods: {
    ...mapActions([
      'setCurrentIndex',
      'setFavoriteList',
      'setHistorySong',
      'setHistoryList',
      'setTotalTime',
      'setClickTime',
      'setCurrentTime'
    ]),
    // ontimeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发
    timeupdate (e) {
      // console.log(e.target.currentTime)
      // getters里的共享数据需要在mutation做修改，不然报错
      // this.currentTime = e.target.currentime
      this.setCurrentTime(e.target.currentTime)
    },
    // onended当目前的播放列表已结束时
    ended () {
      if (this.modeType === mode.loop) {
        this.setCurrentIndex(this.currrentIndex + 1)
      } else if (this.modeType === mode.one) {
        this.$refs.audio.play()
      } else if (this.modeType === mode.random) {
        const index = getRandomIntInclusive(0, this.songs.length - 1)
        this.setCurrentIndex(index)
      }
    }
  },
  watch: {
    isPlaying (newValue, oldValue) {
      if (newValue) {
        this.setHistorySong(this.currentSong)
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
    },
    currentIndex () {
      /*
      Media 事件
      oncanplay 事件在用户可以开始播放视频/音频（audio/video）时触发。
      ondurationchange 事件在视频/音频（audio/video）的时长发生变化时触发。
      注意点: 在iOS中系统不会自动加载歌曲, 所以oncanplay不会自动执行
              https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/AudioandVideoTagBasics/AudioandVideoTagBasics.html
              在PC端和Android端, 系统会自动加载歌曲, 所以oncanplay会自动被执行
      解决方案: 如何监听iOS中Audio的歌曲是否已经准备好了, 通过ondurationchange事件来监听
                ondurationchange事件什么时候执行: 当歌曲加载完成之后执行, 因为只有歌曲加载完成之后才能获取到歌曲的总时长
      * */
      this.$refs.audio.ondurationchange = () => {
        // console.log('执行了2')
        // this.totalTime = this.$refs.audio.duration  getters里的共享数据需要在mutation做修改，不然报错
        this.setTotalTime(this.$refs.audio.duration)
        if (this.isPlaying) {
          this.setHistorySong(this.currentSong)
          console.log(this.$refs.audio)
          this.$refs.audio.play()
        } else {
          this.$refs.audio.pause()
          console.log(this.isPlaying)
        }
      }
    },
    clickTime (newValue, oldValue) {
      this.$refs.audio.currentTime = newValue
      // this.setCurrentTime(newValue)
    },
    favoriteList (newValue, oldValue) {
      // window.localStorage.setItem('favoriteList', JSON.stringify(newValue))
      setLocalStorage('favoriteList', newValue)
    },
    historyList (newValue, oldValue) {
      // window.localStorage.setItem('historyList', JSON.stringify(newValue))
      setLocalStorage('historyList', newValue)
    }
  },
  // 在调用created的时候, 是我们最早能够访问Vue实例中保存的数据和方法的地方
  created () {
    // let favoriteList = JSON.parse(window.localStorage.getItem('favoriteList'))
    const favoriteList = getLocalStorage('favoriteList')
    // 假如收藏列表在本地不存在,则保存收藏列表在本地
    if (favoriteList === null) { return }
    this.setFavoriteList(favoriteList)
    // let historyList = JSON.parse(window.localStorage.getItem('historyList'))
    const historyList = getLocalStorage('historyList')
    if (historyList === null) { return }
    this.setHistoryList(historyList)
  },
  // 生命周期函数表示Vue已经完成了模板的渲染
  mounted () {
    // 渲染好时设置播放总时常
    this.$refs.audio.ondurationchange = () => {
      // console.log('执行了1')
      this.setTotalTime(this.$refs.audio.duration)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
