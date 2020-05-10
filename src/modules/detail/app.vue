<template>
  <div class="wrapper">
    <div class="title">
      <div
        class="left"
        @click="goBack"
      >
        <img
          src="../../assets/tabBar/left.svg"
          alt=""
        >
      </div>
      <p class="detail">到馆详情</p>
    </div>
    <div class="timer">
      <p class="time">{{date}}</p>
      <div class="button-group">
        <button
          class="last-day"
          @click="getLast"
        >上一天</button>
        <button
          class="next-day"
          @click="getNext"
        >下一天</button>
      </div>
    </div>
    <div class="detail-list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :offset="offset"
        @load="onLoad"
      >
        <van-cell
          v-for="(item, index) in enterDetail"
          :key="index"
        >
          <ul
            class="form"
            style="list-style: none"
          >
            <li class="member-detail">
              <div class="all">
                <img
                  class="avatar"
                  :src="item.img?item.img:require('../../assets/tabBar/avatarnull.png')"
                  alt=""
                >
                <div class="right">
                  <div class="top">
                    <div class="name">
                      {{item.real_name}}
                    </div>
                    <div class="remain">
                      {{'剩' + item.remain + '天'}}
                    </div>
                  </div>
                  <div class="bottom">
                    <div class="times">
                      <div class="enter-times">
                        {{'本日入馆次数: &nbsp;' + item.times +'次'}}
                      </div>
                      <div class="last-enter">
                        {{'最后入馆: &nbsp;' + item.last_enter}}
                      </div>
                    </div>
                    <div
                      class="arrow"
                      @click="goInfo(item.open_id, item.store_id)"
                    >
                      <img
                        src="../../assets/tabBar/right.svg"
                        alt=""
                        class="right-arrow"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import { go } from '@utils/goto'
import param from '@utils/url-param'
import dayjs from 'dayjs'

export default {
  data: function () {
    return {
      offset: 100,
      storeId: 0,
      page: 1,
      size: 10,
      allItems: 0,
      total: 0,
      date: '',
      enterDetail: [],
      loading: false,
      finished: false,
      pickStore: 0
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        this.getEnterDetail()
      }, 500)
    },
    getEnterDetail: function () {
      var url = './report/enterlog'
      const storeId = param('store_id')
      this.storeId = storeId
      const data = {
        store_id: this.storeId,
        page: this.page,
        size: this.size,
        date: this.date
      }
      this.page++
      this.$http.get(url, { params: data }).then((result) => {
        const that = this
        that.enterDetail = that.enterDetail.concat(result.data.items)
        that.total = result.data.total
        // that.page++
        that.allItems = that.allItems + result.data.items.length
        that.loading = false
        if (that.allItems >= that.total) {
          this.finished = true
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 点击上一天
    getLast: function () {
      this.date = dayjs(this.date).subtract(1, 'day').format('YYYY-MM-DD')
      this.finished = false
      this.enterDetail = []
      this.page = 1
      this.allItems = 0
      this.getEnterDetail()
    },
    // 点击下一天
    getNext: function () {
      this.date = dayjs(this.date).add(1, 'day').format('YYYY-MM-DD')
      this.finished = false
      this.enterDetail = []
      this.allItems = 0
      this.page = 1
      this.getEnterDetail()
    },
    goInfo: function (opid, stid) {
      go(`./information.html?open_id=${opid}&store_id=${stid}&date=${this.date}`)
    },
    goBack: function () {
      // window.history.back(-1)
      go(`./index.html?pickStoreIndex=${this.pickStore}&datePick=${this.date}`)
    }
  },
  mounted: function () {
    var date = param('date')
    this.date = date
    var pickStore = param('storePick')
    this.pickStore = pickStore
  }
}
</script>

<style lang="stylus">
body
  background-color #fff

  .title
    display flex
    position relative
    box-shadow 0 3px 10px rgb(212, 212, 212)
    width 100%
    height 150px

    .left
      padding-left 40px
      // margin-bottom: 28px
      margin-top 66px

    p.detail
      margin-left 240px
      margin-top 60px
      font-size 36px
      color #333333

  .timer
    position relative
    display flex
    height 100px

    p.time
      margin-left 44px
      margin-top 38px
      font-size 28px
      // color: #6295ff
      color #2296ce

    .button-group
      position absolute
      top 26px
      right 40px
      width 300px
      display flex
      justify-content space-between

      button
        padding 0
        width 135px
        height 60px
        border-radius 50px
        outline none
        text-overflow ellipsis
        // border: 1px solid #95B9FF
        border 1px transparent solid
        color #249fdb
        font-size 27px
        background-color #fff
        position relative

      button:after
        content ''
        position absolute
        top -3px
        bottom -3px
        left -3px
        right -3px
        background linear-gradient(135deg, #000781, #23b7cb)
        // background: linear-gradient(130deg, #C0E9F6,  #2296ce);
        // background: linear-gradient(130deg, #3494e6,  #ec6ead);
        border-radius 50px
        content ''
        z-index -1

      .last-day
        margin-right 30px

  .detail-list
    // height: 1800px
    position absolute
    top 250px
    bottom 0
    overflow auto
    border-top 2px solid rgb(238, 238, 238)
    margin-top 8px

    .van-list
      .van-list__finished-text
        font-size 30px
        margin-top 30px

      .van-loading__text
        font-size 30px

      .van-cell
        padding 0
        border-bottom 1px solid rgb(238, 238, 238)

        .van-cell__value
          .form
            margin 0
            padding 0

            .member-detail
              height 212px
              width 750px

              .all
                display flex

                .avatar
                  width 90px
                  height 90px
                  border-radius 100%
                  margin-left 30px
                  margin-top 30px

                .right
                  width 630px

                  .top
                    display flex
                    position relative
                    width 620px
                    margin-left 30px
                    margin-top 40px
                    margin-bottom 43px

                    .name
                      font-weight bold
                      font-size 37px

                    .remain
                      position absolute
                      color #ff7b4f
                      right 56px
                      font-size 28px

                  .bottom
                    position relative
                    margin-top 16px
                    display flex

                    .times
                      margin-left 24px
                      color #999999
                      font-size 28px

                    .enter-times
                      margin-bottom 19px

                    .arrow
                      position absolute
                      width 100px
                      height 80px
                      // top: 30px
                      // margin-left: 560px
                      right 2px

                      .right-arrow
                        position absolute
                        right 24px
                        bottom 12px
                        margin-top 0
</style>