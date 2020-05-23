<template>
  <ul class="detail-bottom">
    <li class="bottom-top" @click="selectAllMusic">
      <div class="bottom-icon" ></div>
      <div class="bottom-title" >播放全部</div>
    </li>
    <li v-for="value in playlist" :key="value.id" class="item" @click="selectMusic(value.id)">
      <h3>{{value.name}}</h3>
      <p>{{value.al.name}} -{{value.ar[0].name}}</p>
    </li>
  </ul>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'DetailBottom',
  props: {
    // :playlist="playlist.tracks
    playlist: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  methods: {
    ...mapActions([
      'setFullScreen',
      'setSongDetail'
    ]),
    // 点击选择音乐
    selectMusic (id) {
      this.setFullScreen(true)
      // 获取当前点击的歌曲详情
      this.setSongDetail([id])
    },
    selectAllMusic () {
      this.setFullScreen(true)
      // map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一次提供的函数后的返回值。
      const ids = this.playlist.map(function (item) {
        // 返回所有推荐歌单或最新专辑的里歌曲列表的所有歌曲id
        return item.id
      })
      // 获取建立全部歌曲详情
      this.setSongDetail(ids)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .detail-bottom{
    width: 100%;
    /*background: #000;*/
    li{
      width: 100%;
      height: 120px;
      padding: 20px;
      box-sizing: border-box;
      @include bg_sub_color();
      border-bottom: 1px solid #ccc;
    }
    .bottom-top{
      display: flex;
      align-items: center;
      border-top-left-radius: 50px;
      border-top-right-radius: 50px;
      .bottom-icon{
        width: 60px;
        height: 60px;
        @include bg_img('../../assets/images/small_play');
        margin-right: 20px;
      }
      .bottom-title{
        @include font_color();
        @include font_size($font_large)
      }
    }
    .item{
      h3{
        @include font_color;
        @include font_size($font_medium);
        @include no-wrap();
      }
      p{
        @include font_color;
        @include font_size($font_samll);
        @include no-wrap();
        margin-top: 10px;
        opacity: 0.8;
      }
    }
  }
</style>
