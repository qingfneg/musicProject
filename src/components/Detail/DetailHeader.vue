<template>
<Header>
  <!--在@click加上.stop停止冒泡-->
  <div slot="left" class="header-left" @click.stop="back"></div>
  <p slot="center" class="header-title">{{title}}</p>
  <div slot="right" class="header-right"></div>
</Header>
</template>

<script>
import Header from '../Header'
export default {
  name: 'DetailHeader',
  components: {
    Header
  },
  methods: {
    back () {
      window.history.back()
      // 下面是vue的使用方法和window.history.back()是一样的
      // this.$router.go(-1)
    }
  },
  // 注意不要把props不小心写到方法里去了
  props: {
    title: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .header{
    position: relative;
    z-index: 999;
    .header-left{
      @include  bg_img('../../assets/images/back')
    }
    .header-right{
      @include bg_img('../../assets/images/more')
    }
    .header-title{
      width: 60%;
      text-align: center;
      line-height: 100px;
      color: #fff;
      font-weight: bold;
      @include font_size($font_medium);
      @include no-wrap()
    }
  }
</style>
