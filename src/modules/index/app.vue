<template>
  <div class='try'>
    <AreaSelect
      class='selects'
      @onSelected='getStoreId'
      :indexinit="this.indexInit"
      :storepickindex="this.storepickindex"
      activeName='./index.html'
    ></AreaSelect>
    <!-- <SwipeTab activeName='./index.html' :pickStore="this.pickStore"/> -->
    <form>

      <div class='md-example-child md-example-child-date-picker md-example-child-date-picker-3'>
        <md-field>
          <md-field-item
            name='name'
            arrow='arrow-right'
            align='right'
            :content='datePickerValue'
            @click.native='isDatePickerShow = true'
          ></md-field-item>
        </md-field>
        <md-date-picker
          ref='datePicker'
          v-model='isDatePickerShow'
          type='custom'
          title='选择年月'
          large-radius
          :text-render='textRender'
          :custom-types="['yyyy', 'MM']"
          :default-date='currentDate'
          @change='onDatePickerChange'
          @confirm='onDatePickerConfirm'
        ></md-date-picker>
      </div>

      <div class='button-group'>
        <button
          class='last'
          :class="{'disabled': currentWeek === 1}"
          type='button'
          @click='toLast'
        >上一周</button>
        <button
          class='next'
          :class="{'disabled': currentWeek === 5}"
          type='button'
          @click='toNext'
        >下一周</button>
      </div>
    </form>

    <div
      class='wrap'
      ref='wrap'
    >
      <div
        v-show='showChart'
        ref="bar_dv"
        id='echartContainer'
        :style='chartStyle'
      ></div>
    </div>

    <div class="tryclick">
      <p
        class='tip'
        v-if='tryClick'
      >点击柱子试试</p>
    </div>

    <div
      class='click-info'
      v-if='clicked'
    >
      <p class='valid-members'>本月有效会员 {{daily.members}}人</p>
      <div class='click-time'>{{visibleYearMonth}}</div>
      <div class='percent document'>
        <div class='doc-percent'>入馆人数占比</div>
        <div
          class='statistic'
          v-if='daily.enter_number > deathline'
        >{{daily.percent}}%</div>
        <div
          class='statistic red'
          v-if='daily.enter_number < deathline'
        >{{daily.percent}}%</div>
      </div>

      <div class='num document'>
        <div class='doc-num'>入馆人数</div>
        <div class='statistic'>{{daily.enter_number}}人</div>
        <div
          class='right-arrow'
          @click='goDetail'
        >
          <img
            src='../../assets/tabBar/right.svg'
            alt
          />
        </div>
      </div>
    </div>

    <Tabbar />
  </div>
</template>

<script>
import './main.stylus'
import { go } from '@utils/goto'
import Share from '@/components/share'
import echarts from 'echarts'
import param from '@utils/url-param'

import Tabbar from '../../components/tab'
import AreaSelect from '../../components/area-select'

export default {
  components: {
    Share,
    Tabbar,
    AreaSelect
  },
  data () {
    return {
      storepickindex: 0,
      indexInit: 0,
      isDatePickerShow: false,
      datePickerValue: '',
      currentDate: new Date(),
      currentSelected: {},
      tab1: 1,
      tryClick: true,
      clicked: false,
      reportData: {},
      beginTime: '2019-09-16',
      endTime: '2019-09-22',
      times: [],
      days: [],
      date: '',
      storeId: '',
      pickStore: 0,
      daily: {},
      yearPick: 0,
      monthPick: 0,
      deathline: '',
      visibleYearMonth: '',
      currentWeek: 1,
      chartStyle: {
        width: '1600px',
        height: '195px'
      },
      showChart: false
    }
  },
  methods: {
    initData () {
      if (!param('pickStoreIndex')) {
        this.indexInit = 0
      } else {
        this.indexInit = param('pickStoreIndex') - 0
      }
      if (!param('datePick')) {
        var currentYear = new Date().getFullYear()
        var currentMonth = new Date().getMonth() + 1
        this.datePickerValue = currentYear + '年' + currentMonth + '月'
        // this.datePickerValue = this.currentDate.getFullYear() + '年' + '0' + this.currentDate.getMonth() + '月'
      } else {
        var pickYear = param('datePick').substr(0, 4)
        var pickMonth = param('datePick').substr(5, 2)
        var pmonth = pickMonth - 1
        this.datePickerValue = pickYear + '年' + pickMonth + '月'
        this.currentDate = new Date(pickYear, pmonth)
      }
      // var currentYear = new Date().getFullYear()
      // var currentMonth = new Date().getMonth() + 1
      // this.datePickerValue = currentYear + '年' + currentMonth + '月'
      this.getReport()
    },
    // mand
    textRender () {
      // const args = Array.prototype.slice.call(arguments)
      // const typeFormat = args[0] // 类型
      // const column0Value = args[1] // 第1列选中值
      // const column1Value = args[2] // 第2列选中值
      // if (typeFormat === 'dd') {
      //   return `*${column2Value}日`
      // }
    },
    onDatePickerChange (columnIndex, itemIndex, value) {
    },
    onDatePickerConfirm (columnsValue) {
      this.datePickerValue =
        this.$refs.datePicker.getFormatDate('yyyy/MM/').substring(0, 4) +
        '年' +
        this.$refs.datePicker.getFormatDate('yyyy/MM/').substring(5, 7) +
        '月'
      this.clicked = false
      this.tryClick = true
      var pickerValue = this.$refs.datePicker.getFormatDate('yyyy-MM')
      console.log('格式的', pickerValue)
      this.getReport()
    },
    formatter (type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return value
    },
    pickMonth: function () {
      this.pick = true
    },
    toLast: function () {
      this.currentWeek = (this.currentWeek === 1) ? this.currentWeek : --this.currentWeek
      this.handerScroll()
    },
    toNext: function () {
      this.currentWeek = (this.currentWeek === 5) ? this.currentWeek : ++this.currentWeek
      this.handerScroll()
    },
    // scrollLeft By this.currentWeek
    handerScroll () {
      var _step = 0
      // hack code 校准偏移量
      if (this.currentWeek === 1) {
        _step = 44
      } else {
        _step = 50
      }
      const _distance = (7 * (this.currentWeek - 1) + 1) * _step
      this.$refs['wrap'].scrollLeft = _distance
    },
    goto () {
      go('./mine.html')
    },
    getReport: function () {
      var url = './report/stores'
      var curYear = new Date().getFullYear()
      var curMonth = new Date().getMonth() + 1
      var curDate = new Date().getDate()
      var curYearMonth = curYear + '年' + curMonth + '月'
      var curTime = curYear + '-' + curMonth + '-'
      var pickValue = this.datePickerValue.replace('年', '-').replace('月', '-')
      var pickYear = this.datePickerValue.substring(0, 4)
      var pickMonth = this.datePickerValue.substr(-3, 2)
      var dayofMonth = new Date(pickYear, pickMonth, 0).getDate()
      var beginDate = pickValue + '01'
      var curEndDate = curTime + curDate
      var endDate = pickYear + '-' + pickMonth + '-' + dayofMonth
      if (this.datePickerValue === curYearMonth) {
        const data = {
          store_id: this.storeId,
          begin_date: beginDate,
          end_date: curEndDate
        }
        this.$http
          .get(url, { params: data })
          .then(res => {
            var that = this
            var arr1 = []
            // that.chartStyle.width = `${res.data.active_number.length * 50 + 100} px`
            // console.log('宽度', that.chartStyle.width, res.data.active_number.length)
            // that.showChart = true
            that.deathline = res.data.death_line
            for (let i = 0; i < res.data.active_number.length; i++) {
              arr1.push(res.data.active_number[i].times)
            }
            that.times = arr1
            var arr2 = []
            const day = new Date().getDate()
            for (let j = 0; j < res.data.active_number.length; j++) {
              if (j === res.data.active_number.length - 1 && res.data.active_number.length === day) {
                arr2.push('今日')
              } else {
                arr2.push(res.data.active_number[j].date.substr(-2, 2) + '日')
              }
            }
            that.days = arr2
            that.showChart = true
            that.renderChart()
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        // var begindate = '2018-01-01'
        // var enddate = '2018-01-15'
        const data = {
          store_id: this.storeId,
          begin_date: beginDate,
          // begin_date: begindate,
          end_date: endDate
          // end_date: enddate
        }
        this.$http
          .get(url, { params: data })
          .then(res => {
            var that = this
            // that.chartStyle.width = '1600px'
            // that.chartStyle.height = '195px'
            that.chartStyle.width = `${res.data.active_number.length * 0 + 50} px`
            // console.log('设置了宽度', that.chartStyle.width)
            // console.log('数据长度是:', res.data.active_number.length)
            // console.log('./report/report数据2是', res.data)
            var arr1 = []
            that.deathline = res.data.death_line
            for (let i = 0; i < res.data.active_number.length; i++) {
              arr1.push(res.data.active_number[i].times)
            }
            that.times = arr1

            var arr2 = []
            for (let j = 0; j < res.data.active_number.length; j++) {
              arr2.push(res.data.active_number[j].date.substr(-2, 2) + '日')
            }
            that.days = arr2
            that.showChart = true
            that.renderChart()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    getDaily: function () {
      var url = './report/daily'
      const data = {
        store_id: this.storeId,
        date: this.date
      }
      this.$http
        .get(url, { params: data })
        .then(res => {
          var that = this
          that.daily = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    goDetail: function () {
      go(`./detail.html?store_id=${this.storeId}&date=${this.date}&storePick=${this.storepickindex}`)
    },
    getStoreId (st, stid) {
      this.storepickindex = st
      this.storeId = stid
      this.getReport()
    },
    getInit: function (itid) {
      this.storeId = itid
    },
    renderChart () {
      const that = this
      // 基于准备好的dom，初始化echarts实例
      // var bar = that.$refs.bar_dv
      // var myChart = echarts.init(bar)
      var myChart = echarts.init(document.getElementById('echartContainer'))
      // 绘制图表
      myChart.setOption({
        grid: {
          left: '30px',
          right: '30px',
          top: '5%',
          bottom: '12%'
        },
        tooltip: {},
        xAxis: {
          data: that.days,
          barGap: '500%',
          axisLable: {
            barGap: '500%',
            inside: false,
            textStyle: {
              color: '#333',
              fontSize: 11
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#333',
              fontSize: 13
            }
          }
        },

        series: [
          {
            type: 'bar',
            barWidth: '20px',
            barCategoryGap: '20px',
            itemStyle: {
              barGap: '500%',
              normal: {
                barGap: '500%',
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#aad6ff' },
                  { offset: 1, color: '#188df0' }
                ]),
                barBorderRadius: [1000, 1000, 0, 0]
              },
              emphasis: {
                barGap: '500%',
                barCategoryGap: '500%',
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 1, color: '#83bff6' },
                  { offset: 0, color: '#2378f7' }
                ]),
                barBorderRadius: [1000, 1000, 0, 0]
              }
            },
            data: this.times
          }
        ]
      })
      if (myChart._$handlers.click) {
        myChart._$handlers.click.length = 0
      }
      myChart.on('click', function (params) {
        that.currentSelected = Object.assign(
          {
            index: params.dataIndex
          },
          params
        )

        var month = that.datePickerValue.replace('年', '-').replace('月', '-')
        if (params.name === '今日') {
          const day = new Date().getDate()
          that.date = month + day
        } else {
          that.date = month + params.name.substring(0, 2)
        }
        that.visibleYearMonth = that.datePickerValue + params.name
        that.getDaily()
        that.tryClick = false
        that.clicked = true
      })
    },
    onClick1 () {
      go('./member.html')
    },
    onClick2 () {
      go('./index.html')
    }
  },
  created () {
    this.initData()
  }
}
</script>
