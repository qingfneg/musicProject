<template>
<div class="recommend">
  <div class="recommend-wrapper">
    <ScrollView>
      <div>
        <Banner :banners="banners"></Banner>
        <Personalized :personalized="personalized" :title="'推荐歌单'" @select="fatherSelectItem" :type="'personalized'" ></Personalized>
        <Personalized :personalized="albums" :title="'最新专辑'" @select="fatherSelectItem" :type="'album'"></Personalized>
        <NewSongs :songs="songs"></NewSongs>
      </div>
    </ScrollView>
  </div>
  <transition>
    <router-view></router-view>
  </transition>
</div>
</template>

<script>
import { getBanner, getPersonalized, getNewAlbum, getNewSong } from '../api/index'
import Banner from '../components/Recommend/Banner'
import Personalized from '../components/Recommend/Personalized'
import NewSongs from '../components/Recommend/NewSongs'
import ScrollView from '../components/ScrollView'
// VUE(SPA)项目中使用SEO-动态生成META标签，统一管理SEO三大标签
import MetaInfo from '../../vue-meta-info'
export default {
  name: 'Recommend',
  // metaInfo使用时小写
  metaInfo: MetaInfo.recommend,
  components: {
    Banner,
    Personalized,
    NewSongs,
    ScrollView
  },
  methods: {
    fatherSelectItem (id, type) {
      // 编程式路由导航 等于 <router-link to=`/recommend/detail/${id}/${type}` tag="button"></router-link>
      this.$router.push({
        path: `/recommend/detail/${id}/${type}`
      })
    }
  },
  data () {
    return {
      banners: [],
      personalized: [],
      albums: [],
      songs: []
    }
  },
  // 生命周期钩子函数， 在调用created的时候,
  // 是我们最早能够访问Vue实例中保存的数据和方法的地方
  created () {
    getBanner()
      .then((data) => {
        // console.log(data)
        this.banners = data.banners
      })
      .catch(function (err) {
        console.log(err)
      })
    getPersonalized()
      .then((data) => {
        // console.log(data)
        this.personalized = data.result
      })
      .catch(function (err) {
        console.log(err)
      })
    getNewAlbum()
      .then((data) => {
        // console.log(data)
        // splice截取返回
        // console.log(data.albums.splice(0, 6))
        this.albums = data.albums.splice(0, 6)
      })
      .catch(function (err) {
        console.log(err)
      })
    getNewSong()
      .then((data) => {
        // console.log(data)
        this.songs = data.result
      })
  }
}
</script>

<style scoped lang="scss">
/*通过固定定位设置top、left、right、bottom设置界面的大小高度*/
  .recommend{
    position: fixed;
    top: 184px;
    left: 0;
    right: 0;
    bottom: 0;
    /*overflow: hidden;*/
    .recommend-wrapper{
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }

.v-enter{
  transform: translateX(100%);
}
.v-enter-to{
  transform: translateX(0%);
}
.v-enter-active{
  transition: transform 1s;
}
.v-leave{
  transform: translateX(0%);
}
.v-leave-to{
  transform: translateX(100%);
}
.v-leave-active{
  transition: transform 1s;
}
</style>
