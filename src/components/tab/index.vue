<template>
  <div class='con'>
    <ul
      class='item'
      v-for='(item, index) in tabBar'
      :key='index'
    >
      <li
        class='type-name'
        :class="{'changeStyle': index === currentIndex}"
        @click='changeStyle(index)'
      ><img :src='currentIndex === index?item.icon_active:item.icon'>{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
import { go } from '@utils/goto'
import img11 from '@/assets/tabBar/statistic2.png'
import img12 from '@/assets/tabBar/statisticActive2.png'
import img21 from '@/assets/tabBar/mine2.png'
import img22 from '@/assets/tabBar/mineActive2.png'
const tabsConfig = [
  {
    name: '统计',
    path: './index.html',
    icon: img11,
    icon_active: img12
  },
  {
    name: '我的',
    path: './mine.html',
    icon: img21,
    icon_active: img22
  }
]

export default {
  data: function () {
    return {
      currentIndex: 0,
      changeSelectStyle: '',
      tabBar: tabsConfig
    }
  },
  created () {
    let num = 0
    tabsConfig.map((item, index) => {
      if (item.path.substr(1) === window.location.pathname) {
        num = index
      }
    })
    this.currentIndex = num
  },
  methods: {
    changeStyle: function (index) {
      if (index === this.currentIndex) {
        // ajax
        return false
      }
      this.changeSelectStyle = index
      go(tabsConfig[index].path)
    }
  },
  mounted () {

  }
}
</script>

<style lang="stylus">
.con {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
  height: 150px;
  box-shadow: 0 0.04rem 0.133333rem #d4d4d4;

  .item {
    text-align: center;
    flex: 1;
    margin: 0;
    padding: 0;

    .type-name {
      display: block;
      text-align: center;
      width: 100%;
      height: 38px;
      line-height: 38px;
      font-size 29px
      color: #BCC2D4;

      img {
        margin-left: 164px;
        margin-top: 30px;
        margin-bottom 3px
        display: block;
        width: 50px;
        height: 50px;
      }
    }

    .changeStyle {
      color: rgb(18, 182, 246);
    }
  }
}

// .con:before {
//   content: '';
//   position: absolute;
//   left: 0;
//   right: 0;
//   height: 1px;
//   background: rgb(138, 138, 138, 0.9);
//   transform: scaleY(0.5);
// }
</style>