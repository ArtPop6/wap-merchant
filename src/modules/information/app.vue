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
      <div class="detail">会员档案</div>
    </div>
    <div class="personal">
      <div class="name">
        <img
          :src="personalData.img?personalData.img:require('../../assets/tabBar/avatarnull.png')"
          class="avatar"
          alt=""
        >
        <div class="real-name">{{personalData.real_name}}</div>
        <div class="remain">
          {{'剩' + personalData.remain + '天'}}
        </div>
      </div>
      <div class="nick-name">
        <div class="wechat-name">微信名称</div>
        <span class="common-style">{{personalData.nick_name}}</span>
      </div>
      <div class="tele">
        <div class="tele-num">
          电话
        </div>
        <span class="common-style">{{personalData.phone}}</span>
      </div>
    </div>
    <p class="card-info">会员卡信息</p>
    <div class="card">
      <div class="start">
        <div class="start-date">
          开卡日期
        </div>
        <span class="common-style">{{personalData.add_time}}</span>
      </div>
      <div class="end">
        <div class="end-date">
          到期日期
        </div>
        <span class="common-style">{{personalData.expired_time}}</span>
      </div>
      <div class="number">
        <div class="card-num">
          会员卡数
        </div>
        <span class="common-style">{{personalData.card_number + '张'}}</span>
      </div>
    </div>
    <p class="enter-info">到馆信息</p>
    <div class="entrance-info">
      <div class="times">
        <div class="month-times">
          近30天入馆次数
        </div>
        <span class="common-style">{{personalData.times + '次'}}</span>
      </div>
      <div class="days">
        <div class="month-days">
          近30天入馆天数
        </div>
        <span class="common-style">{{personalData.days + '天'}}</span>
      </div>
      <div class="last-time">
        <div class="latest">
          最近一次入馆
        </div>
        <span class="common-style">{{personalData.last_enter}}</span>
      </div>
    </div>

    <div class="button-group">
      <button
        class="default-button"
        type="default"
        @click="callPhone"
      >拨打电话</button>
      <button
        class="default-button"
        type="default"
        v-clipboard:copy="personalData.nick_name"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
      >复制微信名</button>
    </div>
  </div>
</template>

<script>
import './style.stylus'
import param from '@utils/url-param'

export default {
  data: function () {
    return {
      date: '',
      personalData: {}
    }
  },
  methods: {
    getPersonalData: function () {
      var url = './report/detail'
      var year = new Date().getFullYear()
      var month = new Date().getMonth() + 1
      var day = new Date().getDate()
      var curDate = year + '-' + month + '-' + day
      if (!param('date')) {
        this.date = curDate
      } else {
        this.date = param('date')
      }
      const data = {
        open_id: '',
        store_id: 0,
        date: this.date
      }

      data.open_id = param('open_id')
      data.store_id = param('store_id')

      this.$http.get(url, { params: data }).then((res) => {
        var that = this
        that.personalData = res.data
      }).catch((err) => { console.log(err) })
    },
    goBack: function () {
      window.history.back()
    },
    onCopy: function (e) {
      alert('已复制微信名: ' + e.text)
    },
    onError: function (e) {
      alert('Failed to copy texts')
    },
    callPhone: function () {
      window.location.href = 'tel:' + this.personalData.phone
      alert('即将拨打: ' + this.personalData.phone)
    }
  },
  mounted: function () {
    this.getPersonalData()
  }
}
</script>