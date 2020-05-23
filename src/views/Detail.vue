<template>
<div class="detail">
  <DetailHeader :title="playlist.name"></DetailHeader>
  <DetailTop :path="playlist.coverImgUrl" ref="top"></DetailTop>
  <div class="bottom">
    <ScrollView ref="scrollview">
      <DetailButton :playlist="playlist.tracks"></DetailButton>
    </ScrollView>
  </div>
</div>
</template>

<script>
import DetailHeader from '../components/Detail/DetailHeader'
import DetailTop from '../components/Detail/DetailTop'
import DetailButton from '../components/Detail/DetailBottom'
import ScrollView from '../components/ScrollView'
// VUE(SPA)项目中使用SEO-动态生成META标签，统一管理SEO三大标签
import MetaInfo from '../../vue-meta-info'
import { getPlayList, getAlbum, getAritstsSongs, getTopList } from '../api/index'
export default {
  name: 'Detail',
  metaInfo: MetaInfo.detail,
  components: {
    DetailHeader,
    DetailTop,
    DetailButton,
    ScrollView
  },
  data: function () {
    return {
      playlist: {}
    }
  },
  created () {
    // 打印route通过通过路由规则中的占位符传递方式传递的参数
    // console.log(this.$route.params.type)
    if (this.$route.params.type === 'personalized') {
      getPlayList({ id: this.$route.params.id })
        .then((data) => {
          // console.log(data.playlist)
          this.playlist = data.playlist
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (this.$route.params.type === 'album') {
      getAlbum({ id: this.$route.params.id })
        .then((data) => {
          // console.log(data)
          this.playlist = {
            name: data.album.name,
            coverImgUrl: data.album.picUrl,
            tracks: data.songs
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (this.$route.params.type === 'singer') {
      // $route一定不要写成$router
      getAritstsSongs({ id: this.$route.params.id })
        .then((data) => {
          // console.log(data.playlist)
          this.playlist = {
            name: data.artist.name,
            coverImgUrl: data.artist.picUrl,
            tracks: data.hotSongs
          }
        })
    } else if (this.$route.params.type === 'rank') {
      // $route一定不要写成$router
      getTopList({ idx: this.$route.params.id })
        .then((data) => {
          // console.log(data.playlist)
          this.playlist = {
            name: data.playlist.name,
            coverImgUrl: data.playlist.creator.backgroundUrl,
            tracks: data.playlist.tracks
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  mounted () {
    // 获取top组件元素，组件里有方法数据等等
    // console.log(this.$refs.top)
    // 获取top的里的根元素，即原生根元素
    // console.log(this.$refs.top.$el)
    const defaultHeight = this.$refs.top.$el.offsetHeight
    // console.log(defaultHeight)
    this.$refs.scrollview.scrolling((offsetY) => {
      // console.log(offsetY)
      if (offsetY < 0) {
        // console.log('向上滚动')
        const scale = Math.abs(offsetY) / defaultHeight
        // console.log(scale)
        this.$refs.top.changeMask(scale)
      } else {
        // console.log('向下滚动')
        const scale = 1 + offsetY / defaultHeight
        // console.log(scale)
        this.$refs.top.$el.style.transform = `scale(${scale})`
      }
    })
  }
}
</script>

<style scoped lang="scss">
  @import "../assets/css/mixin";
.detail{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  @include bg_sub_color();
  .bottom{
    position: fixed;
    top: 500px;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
