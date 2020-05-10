<template>
  <div class='wrap'>
    <AreaSelect
      @onSelected='getStoreId'
      :storepick="this.storepick"
      :initpick="this.initpick"
      :pickdate="this.pickdate"
      activeName='./member.html'
    />
    <!-- :storepick="this.storepick" -->
    <!-- @change='getNewStoreId' -->
    <!-- <SwipeTab activeName='./member.html' :storepick="this.storepick"/> -->
    <!-- @onSelected='getStorePick' -->
    <div class="search">
      <input
        type="text"
        class="search-input"
        v-model="user"
        maxlength="20"
        placeholder="输入姓名或手机号"
        @keyup.enter="search"
      />
      <van-icon
        class="search-icon"
        name="search"
        size="20px"
        color="#D9D9D9"
        @click="search"
      />
    </div>

    <div class='button-group'>
      <van-button
        type='primary'
        class='new'
        :class="[type==='new'?'new-use':'new']"
        :disabled="disableBtn"
        @click='showNew()'
      >{{'今日新增('+this.typeNum.daily_increase +')'}}</van-button>
      <van-button
        type="primary"
        class='renew'
        :class="[type==='old'?'renew-use':'renew']"
        :disabled="disableBtn"
        @click='showRenew()'
      >{{'今日续费('+this.typeNum.daily_repurchase+')'}}</van-button>
      <van-button
        type="primary"
        class='dead'
        :class="[type==='expired'?'dead-use':'dead']"
        :disabled="disableBtn"
        @click='showDead()'
      >{{'今日到期('+this.typeNum.daily_expired+')'}}</van-button>
    </div>
    <div class='form'>
      <van-list
        v-model='loading'
        :finished='finished'
        finished-text='没有更多了'
        @load='onLoad'
        :offset="offset"
      >
        <van-cell
          v-for='(item, index) in membersData'
          :key='index'
        >
          <ul>
            <li>
              <div class='member-detail'>
                <img
                  :src="item.img?item.img:require('../../assets/tabBar/avatarnull.png')"
                  alt=''
                  class='avatar'
                >
                <div class='right'>
                  <div class='top'>
                    <div class='name'>
                      {{item.real_name}}
                    </div>
                    <div
                      class='category-orange'
                      v-if="item.type == '今日过期'"
                    >
                      {{item.type}}
                    </div>
                    <div
                      class='category-blue'
                      v-if="item.type == '今日续费'"
                    >
                      {{item.type}}
                    </div>
                    <div
                      class='category-green'
                      v-if="item.type == '今日新增'"
                    >
                      {{item.type}}
                    </div>
                    <div
                      class='remain-orange'
                      v-if='item.remain < 5'
                    >
                      {{'剩' + item.remain + '天'}}
                    </div>
                    <div
                      class='remain'
                      v-if='item.remain >= 5'
                    >
                      {{'剩' + item.remain + '天'}}
                    </div>
                  </div>
                  <div class='bottom'>
                    <div class='times'>
                      <div class='start-time'>
                        {{'开卡时间: &nbsp;' + item.add_time}}
                      </div>
                      <div class='expire-time'>
                        {{'过期时间: &nbsp;' +  item.expired_time}}
                      </div>
                    </div>
                    <div
                      class='arrow'
                      @click='getInfo(item.open_id, item.store_id)'
                    >
                      <img
                        src='../../assets/tabBar/right.svg'
                        alt=''
                        class='right-arrow'
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
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import { go } from '@utils/goto'
import Tabbar from '@/components/tab'
import AreaSelect from '../../components/area-select'
import param from '@utils/url-param'

export default {
  components: {
    Tabbar,
    AreaSelect
  },
  props: {
    open_id: String
  },
  data: function () {
    return {
      disableBtn: false,
      pickdate: '',
      offset: 100,
      storepick: 0,
      initpick: 0,
      allItems: 0,
      total: 0,
      page: 1,
      size: 10,
      loading: false,
      finished: false,
      all: true,
      storeId: '',
      type: 'all',
      typeNum: [],
      new: 1,
      continue: 20,
      expire: 100,
      membersData: [],
      // newMembersData: [],
      // renewMembersData: [],
      // deadMembersData: [],
      date: '',
      user: ''
    }
  },
  methods: {
    getStorePick () {
      this.initpick = param('pickStore') - 0
      // this.pickdate = param('datepick')
    },
    onLoad () {
      setTimeout(() => {
        this.getMemberData()
      }, 500)
    },
    search () {
      this.page = 1
      this.membersData = []
      this.allItems = 0
      this.loading = false
      this.finished = false
      this.type = 'all'
      this.user = this.user.replace(/\s/g, '')
      this.getMemberData()
    },
    getMemberData () {
      this.disableBtn = true
      var url = './report/members'
      var curDate = new Date()
      var currentYear = curDate.getFullYear()
      var currentMonth = curDate.getMonth() + 1
      var currentDate = curDate.getDate()
      this.date = currentYear + '-' + currentMonth + '-' + currentDate
      const data = {
        store_id: this.storeId,
        type: this.type,
        page: this.page,
        size: this.size,
        date: this.date,
        user: this.user
      }
      this.page++
      this.$http.get(url, { params: data }).then((result) => {
        this.membersData = this.membersData.concat(result.data.items)
        this.allItems = this.allItems + result.data.items.length
        this.total = result.data.total
        this.loading = false
        this.disableBtn = false
        if (this.allItems >= this.total) {
          this.finished = true
        }
      }).catch(function (err) {
        this.disableBtn = false
        console.log(err)
      })
    },
    getTypeNum: function () {
      var url = './report/type'
      var curDate = new Date()
      var currentYear = curDate.getFullYear()
      var currentMonth = curDate.getMonth() + 1
      var currentDate = curDate.getDate()
      this.date = currentYear + '-' + currentMonth + '-' + currentDate
      const data = {
        store_id: this.storeId,
        date: this.date
      }
      this.$http.get(url, { params: data }).then((res) => {
        const that = this
        that.typeNum = res.data
      })
    },
    getStoreId (st, stid) {
      this.storepick = st
      this.storeId = stid
      // this.membersData = []
      this.getTypeNum()
      this.type = 'all'
      this.allItems = 0
      this.membersData = []
      this.page = 1
      this.finished = false
      this.onLoad()
    },
    getNewStoreId () {
      this.type = 'all'
      this.page = 1
      this.finished = false
      this.getMemberData()
      // this.onLoad()
    },
    mgError (item) {
      item.img = '../../assets/tabBar/user.svg'
    },
    getInfo: function (oid, sid) {
      go(`./information.html?open_id=${oid}&store_id=${sid}`)
    },
    showNew () {
      // this.loading = false
      this.allItems = 0
      this.membersData = []
      this.type = 'new'
      this.page = 1
      this.user = ''
      this.finished = false
      this.getMemberData()
    },
    showRenew () {
      // this.loading = false
      this.allItems = 0
      this.membersData = []
      this.type = 'old'
      this.page = 1
      this.finished = false
      this.getMemberData()
    },
    showDead () {
      // this.loading = false
      this.allItems = 0
      this.membersData = []
      this.type = 'expired'
      this.page = 1
      this.finished = false
      this.getMemberData()
    }
  },
  created: function () {
    this.getTypeNum()
    this.getStorePick()
  }
}
</script>

<style lang='stylus'>
body
  background #fff

  .wrap
    .search
      margin-top 10px
      display flex
      width 750px

      .search-input
        min-width 400px
        width 98%
        border-radius 10px
        height 60px
        border 2px solid rgb(238, 238, 238)
        padding 10px 10px 10px 16px
        margin 16px 20px
        -webkit-appearance none

      .search-input::-webkit-input-placeholder
        color #ebebeb
        font-size 30px
        margin-left 10px

      .search-icon
        position absolute
        margin-top 20px
        right 32px
        padding 7px

    .button-group
      display flex
      justify-content space-around
      margin-top 8px
      margin-bottom 46px

      button
        width 216px
        height 58px
        border-radius 10px
        color #EEFFFC
        font-size 26px
        outline none
        border 0px

      button.new
        background #94D8EF

      button.new-use
        background #83C3D8

      button.renew
        background #6699FF

      button.renew-use
        // background #5C8AE6
        background #1871d1

      button.dead
        background #FF6633

      button.dead-use
        background #E65C2E

    .form
      width 750px
      position absolute
      top 396px
      bottom 150px
      overflow scroll
      border-top 2px solid rgb(238, 238, 238)

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
            ul
              margin 0
              padding 0

              .member-detail
                display flex
                width 750px
                height 212px

                .avatar
                  width 90px
                  height 90px
                  border-radius 100%
                  margin-top 30px
                  margin-left 30px
                  border 2px solid transparent
                  // background: linear-gradient(120deg, #6dd5fa, #fff);
                  background #e3e3e3

                .right
                  position relative
                  margin-top 38px
                  margin-left 30px

                  .top
                    display flex
                    height 60px
                    position relative
                    width 586px
                    margin-top 0

                    .name
                      padding-top 10px
                      font-size 36px
                      font-weight bold
                      margin-left 0

                    .category-orange
                      position absolute
                      text-align center
                      font-size 20px
                      padding 6px 6px
                      background #FF6633
                      color #fff
                      height 36px
                      border-radius 8px
                      left 190px

                    .category-blue
                      position absolute
                      font-size 20px
                      text-align center
                      padding 6px 6px
                      background #6699FF
                      color #fff
                      width 112px
                      border-radius 8px
                      left 190px

                    .category-green
                      position absolute
                      font-size 20px
                      text-align center
                      padding 6px 6px
                      background #94D8EF
                      color #fff
                      // width: 112px
                      height 36px
                      border-radius 8px
                      left 190px

                    .remain-orange
                      position absolute
                      font-size 30px
                      right 24px
                      top 5px
                      color #FF7E33

                    .remain
                      position absolute
                      font-size 30px
                      right 24px
                      top 5px
                      color #888

                  .bottom
                    position relative
                    margin-top 18px
                    display flex

                    .times
                      color #999999
                      font-size 28px

                      .start-time
                        margin-bottom 19px

                    .arrow
                      position absolute
                      right 2px
                      height 100px
                      width 100px

                      .right-arrow
                        position absolute
                        right 24px
                        bottom 33px
                        margin-top 0

    .form-filt
      ul
        margin 0
        padding 0

        .member-detail
          display flex
          width 750px
          height 214px
          border-bottom 1px solid rgb(238, 238, 238)

          .avatar
            width 90px
            height 90px
            border-radius 100%
            margin-left 30px
            margin-top 30px

          .right
            position relative
            margin-top 34px
            margin-left 30px

            .top
              display flex
              height 60px
              position relative
              width 586px
              margin-top 0

              .name
                font-size 36px
                font-weight bold
                margin-left 0

              .category-orange
                position absolute
                font-size 20px
                padding 0px 6px
                text-align center
                background #FF6633
                color #fff
                width 112px
                height 36px
                border-radius 8px
                left 190px
                top 7px

              .category-blue
                position absolute
                font-size 20px
                padding 0px 6px
                text-align center
                background #6699FF
                color #fff
                width 112px
                height 36px
                border-radius 8px
                left 190px
                top 7px

              .category-green
                position absolute
                font-size 20px
                padding 0px 6px
                text-align center
                background #94D8EF
                color #fff
                width 112px
                height 36px
                border-radius 8px
                left 190px
                top 8px

              .remain-orange
                position absolute
                font-size 30px
                right 24px
                color #FF7E33

              .remain
                position absolute
                font-size 30px
                right 24px
                color #888

            .bottom
              position relative
              margin-top 15px
              display flex

              .times
                color #999999
                font-size 28px

              .right-arrow
                position absolute
                right 24px
                bottom 3px
                margin-top 0
</style>