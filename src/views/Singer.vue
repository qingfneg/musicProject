<template>
  <div class="singer">
    <div class="singer-wrapper">
      <ScrollView ref="scrollView">
        <ul class="list-wrapper">
          <li class="list-group" v-for="(value, index) in list" :key="index" ref="group">
            <h2 class="group-title">{{keys[index]}}</h2>
            <ul>
              <li class="group-item" v-for="obj in list[index]" :key="obj.id" @click.stop="switchSinger(obj.id)">
                <img v-lazy="obj.img1v1Url" alt="">
                <p>{{obj.name}}</p>
              </li>
            </ul>
          </li>
        </ul>
      </ScrollView>
      <ul class="list-keys">
        <!--
       <li v-for="(key, index) in keys"
           :key="key"
           @click.stop="keyDown(index)"
           :class="{'active': currentIndex === index}">{{key}}</li>
       -->
        <li v-for="(key, index) in keys"
            :key="key"
            :data-index="index"
            @touchstart.stop.prevent="touchstart"
            @touchmove.stop.prevent="touchmove"
            :class="{'active':currentIndex === index}">{{key}}</li>
      </ul>
      <div class="fix-title" v-show="fixTitle !== ''" ref="fixTitle">{{fixTitle}}</div>
    </div>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { getAllArtists } from '../api/index'
import ScrollView from '../components/ScrollView'
// VUE(SPA)项目中使用SEO-动态生成META标签，统一管理SEO三大标签
import MetaInfo from '../../vue-meta-info'
export default {
  name: 'Singer',
  metaInfo: MetaInfo.singer,
  components: {
    ScrollView
  },
  methods: {
    // js原生事件
    _keyDown (index) {
      this.currentIndex = index
      // console.log(index)
      const offsetY = this.groupsTop[index]
      // console.log(offsetY)
      // 设置点击后的股东距离为当前字母组的偏移位
      this.$refs.scrollView.scrollTo(0, -offsetY)
    },
    // touchstart触摸开始，手指按下
    touchstart (e) {
      console.log(e.target.dataset)
      // data-* 属性用于存储私有页面后应用的自定义数据。
      // data-* 属性可以在所有的 HTML 元素中嵌入数据。
      // 获取方式：1、使用attribute方法存取 data-* 自定义属性的值
      // 2、 dataset属性存取data-*自定义属性的值
      // 这种方式通过访问一个元素的 dataset 属性来存取 data-* 自定义属性的值。
      // 这个 dataset 属性是HTML5 JavaScript API的一部分，
      // 用来返回一个所有选择元素 data- 属性的DOMStringMap对象。
      const index = parseInt(e.target.dataset.index)
      this._keyDown(index)
      // touches: 当前屏幕上所有手指的列表
      this.beginOffsetY = e.touches[0].pageY
    },
    touchmove (e) {
      // 屏幕上的位置Y
      this.moveOffsetY = e.touches[0].pageY
      // 获取按下到移动之间相隔几个字母
      const offsetY = (this.moveOffsetY - this.beginOffsetY) / e.target.offsetHeight
      // console.log(offsetY, '个字母')
      // 获取移动后是第几个字母，将其点击位移
      let index = parseInt(e.target.dataset.index) + Math.floor(offsetY)
      console.log(e.target.dataset.index, '二')
      if (index < 0) {
        index = 0
      } else if (index > this.keys.length - 1) {
        index = this.keys.length - 1
      }
      this._keyDown(index)
    },
    // 跳转歌手详情
    switchSinger (id) {
      this.$router.push(`/singer/detail/${id}/singer`)
    }
  },
  computed: {
    // 返回相对应得
    fixTitle () {
      // 假如向下滚动时滚动值大于0时保持不变
      if (this.scrollY >= 0) {
        return ''
      } else {
        // 假如向上滚动，则返回当前的标题
        return this.keys[this.currentIndex]
      }
    }
  },
  data () {
    return {
      keys: [],
      list: [],
      groupsTop: [],
      currentIndex: 0,
      beginOffsetY: 0,
      moveOffsetY: 0,
      scrollY: 0
    }
  },
  // 在调用created的时候, 是我们最早能够访问Vue实例中保存的数据和方法的地方
  created () {
    getAllArtists()
      .then((result) => {
        // console.log(result)
        this.keys = result.keys
        this.list = result.list
      })
      .catch(function (err) {
        console.log(err)
      })
  },
  // 在调用mounted的时候, 表示Vue已经完成了模板的渲染
  mounted () {
    // 处理滚动时的标题和标题接触时原来的标题跟着滑动
    // 监听滚动
    this.$refs.scrollView.scrolling((y) => {
      this.scrollY = y
      // 处理第一个区域
      // 假如向下滚动时滚动值大于0时保持不变
      if (y >= 0) {
        this.currentIndex = 0
        return
      }
      // 处理中间区域
      for (let i = 0; i < this.groupsTop.length; i++) {
        const preTop = this.groupsTop[i]
        const nextTop = this.groupsTop[i + 1]
        // 假如滚动的距离位于前面字母标题会接下来的字母标题偏移位之间
        if (-y >= preTop && -y <= nextTop) {
          // 设置当前的字母索引值
          this.currentIndex = i
          // 1.用下一组标题的偏移位（正数） + 当前滚动出去的偏移位(负数)
          // 得出还差多少距离到下一个标题字母
          const diffOffsetY = nextTop + y
          let fixTitleOffsetY = 0
          // 2.判断计算的结果是否是 0 ~ 分组标题高度的值
          if (diffOffsetY >= 0 && diffOffsetY <= this.fixTitleHeight) {
            // 满足开始接触滚动条件开始移动上一组标题
            fixTitleOffsetY = diffOffsetY - this.fixTitleHeight
          } else {
            // 不满足条件需要固定在顶部
            fixTitleOffsetY = 0
          }
          if (fixTitleOffsetY === this.fixTitleOffsetY) {
            return
          }
          this.fixTitleOffsetY = fixTitleOffsetY
          // 处理标题的位置固定变化
          this.$refs.fixTitle.style.transform = `translateY(${fixTitleOffsetY}px)`
          return
        }
      }
      // 处理最后一个区域
      this.currentIndex = this.groupsTop.length - 1
    })
  },
  watch: {
    // 当list获得数据后，获取每个字母group的偏移位放入groupsTop中
    list () {
      // Vue.nextTick()作用：在下次dom更新循环结束之后，执行延迟回调。
      // 在修改数据之后立即使用这个方法，获得更新后的dom
      // 在数据改变之后的操作跟改变之后的DOM有关，那么就应该使用Vue.nextTick()
      this.$nextTick(() => {
        this.$refs.group.forEach((group) => {
          this.groupsTop.push(group.offsetTop)
        })
        // console.log(this.groupsTop)
      })
    },
    // 确认标题
    fixTitle () {
      this.$nextTick(() => {
        // 获取标题的盒子的高
        this.fixTitleHeight = this.$refs.fixTitle.offsetHeight
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../assets/css/variable";
  @import "../assets/css/mixin";
  .singer{
    width: 100%;
    height: 100%;
    .singer-wrapper{
      position: fixed;
      top: 184px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
      @include bg_sub_color();
      .list-wrapper{
        .list-group{
          .group-title{
            @include bg_color();
            @include  font_size($font_medium);
            color: #fff;
            padding: 10px 20px;
            box-sizing:border-box;
          }
          .group-item{
            display: flex;
            justify-content: flex-start;
            padding: 10px 20px;
            border-bottom: 1px solid #ccc;
            img{
              width: 100px;
              height: 100px;
              border-radius: 50%;
              overflow: hidden;
            }
            p{
              @include font_size($font_medium);
              @include font_color();
              display: flex;
              align-items: center;
              margin-left: 20px;
            }
          }
        }
      }
      .list-keys{
        position: fixed;
        right: 10px;
        top: 60%;
        transform: translateY(-50%);
        li{
          @include font_color();
          @include font_size($font_medium_s);
          padding: 3px 0;
          &.active{
            //文本阴影效果：水平、垂直、模糊距离、颜色
            text-shadow: 0 0 10px #000;
          }
        }
      }
      .fix-title{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        padding: 10px 20px;
        box-sizing: border-box;
        @include font_size($font_medium);
        color: #fff;
        @include bg_color();
      }
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
