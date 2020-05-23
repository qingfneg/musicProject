<template>
  <div class="detail-top" >
    <div class="img-container">
      <img :src="path" alt="">
      <!--蒙版-->
      <div class="mask" ref="mask"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailTop',
  props: {
    path: {
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    changeMask (opacity) {
      // 也可以设置模糊度filter=`blur(${{scale}}px)`
      // 注意点：高斯模糊效果非常消耗性能的，不推荐在移动端中使用，
      // 如果非要在移动端中使用，那么建议只设置一次
      this.$refs.mask.style.opacity = opacity
    }
  }
}
</script>

<style scoped lang="scss">
  .detail-top{
    width: 100%;
    height: 500px;
    overflow: hidden;
    position: relative;
    img{
      width: 100%;
    }
    .mask{
      position: absolute;
      left: 0;
      top: 0;
      background: #000;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
</style>
