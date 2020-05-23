<template>
  <transition>
    <div class="account">
      <!--传递方法-->
      <AccountHeader @switchItem="switchItem"></AccountHeader>
      <AccountBottom :switchNum="switchNum"></AccountBottom>
    </div>
  </transition>
</template>

<script>
import AccountHeader from '../components/Account/AccountHeader'
import AccountBottom from '../components/Account/AccountBottom'
// VUE(SPA)项目中使用SEO-动态生成META标签，统一管理SEO三大标签
import MetaInfo from '../../vue-meta-info'
export default {
  name: 'Account',
  metaInfo: MetaInfo.account,
  components: {
    AccountHeader,
    AccountBottom
  },
  methods: {
    switchItem (num) {
      this.switchNum = num
    }
  },
  data () {
    return {
      switchNum: 0
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../assets/css/variable";
  @import "../assets/css/mixin";
  .account{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @include bg_sub_color();
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
