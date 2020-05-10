<template>
  <div class="top-wrap">
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="city"
        :options="citys"
        @change="getNewStoreId"
      />
      <van-dropdown-item
        v-model="store"
        :options="stores"
        @change="getNewStoreId"
      />
    </van-dropdown-menu>
    <div class='swipe-tab'>
      <van-tabs
        v-model='currentName'
        @click='onClick'
        title-active-color='#76AFF9'
        :border='false'
        :swipeable='true'
        line-height='6px'
        line-width='130px'
      >
        <van-tab
          title='会员列表'
          name='./member.html'
        ></van-tab>
        <van-tab
          title='在馆情况'
          name='./index.html'
        ></van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { go } from '@utils/goto'
export default {
  name: 'area-select',
  props: {
    storeId: Number,
    // member发来的变化的
    // storepick: Number,
    // member发来的初始要渲染的
    initpick: Number,
    // index发来的初始要渲染的
    indexinit: Number,
    // index发来的变化的
    // storepickindex: Number,
    activeName: String,
    pickdate: String
  },
  data () {
    return {
      // storepick: 0,
      currentName: this.activeName,
      store: 0,
      city: 0,
      citys: [
      ],
      stores: [
      ]
    }
  },
  methods: {
    onClick (name, title) {
      // if (this.currentName === this.activeName) {
      //   return false
      // } else {
      //   this.currentName = name
      //   go(name + '?pickStore=' + this.pickStore)
      // }
      if (this.currentName === this.activeName && this.currentName === './index.html') {
        return false
      } else if (this.currentName === './index.html' && this.currentName !== this.activeName) {
        go(name + '?pickStoreIndex=' + this.store)
        // this.store = this.indexinit
      } else if (this.currentName === './member.html') {
        go(name + '?pickStore=' + this.store)
        // this.store = this.initpick
      }
      // go(name + '?pickStore=' + this.pickStore)
    },
    getNewStoreId: function () {
      this.$emit('onSelected', this.store, this.stores[this.store].id)
      // this.initpick = this.store
    },
    getCity: function () {
      var url = './report/condition?city='
      this.$http.get(url).then((res) => {
        var that = this
        for (let i = 0; i < res.data.length; i++) {
          that.citys.push({ text: res.data[i].name, value: i, id: res.data[i].id })
        }
        this.getStore()
      })
    },
    getStore: function () {
      var url = './report/condition'
      const data = {
        city: this.citys[this.city].text
      }
      this.$http.get(url, { params: data }).then((res) => {
        var that = this
        console.log('获取的store', res.data)
        for (let j = 0; j < res.data.length; j++) {
          that.stores.push({ text: res.data[j].name, value: j, id: res.data[j].id })
        }
        this.getNewStoreId()
      })
    }
  },
  created () {
    this.getCity()
    if (this.currentName === './index.html') {
      this.store = this.indexinit
    } else if (this.currentName === './member.html') {
      this.store = this.initpick
    }
    // if (this.storepick === undefined) {
    //   this.store = 0
    // } else {
    //   this.store = this.storepick
    // }
  },
  mounted () {

  }
}
</script>

<style lang="stylus">
.top-wrap
  margin-top 26px

  .van-dropdown-menu
    width 580px
    border 0px

    .van-dropdown-menu__item
      .van-dropdown-menu__title
        font-size 33px
        line-height 1

        .van-ellipsis
          overflow auto
          color #999
          vertical-align middle

    .van-dropdown-item
      .van-popup
        .van-cell
          padding 32px
          font-size 30px

  [class*=van-hairline]::after
    display none

  .swipe-tab
    margin-top 66px
    width 100%
    box-shadow 0px 10px 10px -10px rgb(212, 212, 212)

    .van-tabs--line
      .van-tabs__wrap
        height 66px

        .van-tabs__nav--line
          box-sizing border-box

        .van-tab
          span
            display block
            font-size 30px
            padding-bottom 10px

        .van-tabs__line
          background-color #74ACFA
          background-image linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            transparent 75%,
            transparent
          )

      .van-tabs__line
        bottom 0
</style>