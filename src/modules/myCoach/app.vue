<template>
  <div class="student-wrap">
    <div class="coach-info">
      <div class="coach-name">{{ coachName }}教练</div>
      <div class="greet-word">你好，这是你近些天的私教课程</div>
    </div>

    <img alt class="barbell" src="./img/barbell.png" />

    <div class="date-pick__current">
      <div class="date-pick__year">{{ currentYear }}</div>
      <div class="date-pick__title">年</div>
      <div class="date-pick__month">{{ currentMonth }}</div>
      <div class="date-pick__title">月</div>
      <div class="date-pick__date">{{ currentDay }}</div>
      <div class="date-pick__title">日</div>
      <!-- <div class="curren">{{currentDate}}</div> -->
    </div>

    <div class="date-pick__smallwrap">
      <div
        :style="getTransform"
        @touchend="touchEnd"
        @touchmove="touchMove"
        @touchstart="touchStart"
        @transitionend="transitionEnd"
        @webkit-transition-end="transitionEnd"
        class="date-pick__wrap"
        ref="sliders"
      >
        <div :key="index" class="date-pick" v-for="(item, index) in dates">
          <div
            :key="index2"
            @click="clickDate(index2)"
            class="date-pick__threeweeks"
            v-for="(week, index2) in getCurrentWeekDates(item.date)"
          >
            <div :class="currentIndex === index2 ? 'today-week' : ''" class="week-day">
              {{ chineseWeek(week.week) }}
            </div>
            <div :class="currentIndex === index2 ? 'today-date' : ''" class="date">
              {{ week.isToday ? '今' : week.date.substring(8) }}
            </div>
            <div
              :class="currentIndex === index2 ? 'dot-today' : ''"
              class="default-dot"
              v-if="hasCourseDate.includes(getCurrentWeekDates(item.date)[index2].date)"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="course-info__wrap" v-if="courseData.length > 0">
      <div :key="index" class="course-date" v-for="(item, index) in courseData">
        <div class="course-store">
          <div class="store-name">{{ item.store_name }}</div>
        </div>
        <div :key="indexs" class="course-date__class" v-for="(user, indexs) in item.users">
          <div class="course-seat">
            <img :src="user.avatar" alt class="avatar" />
            <div class="course-desc">
              <div class="name-gender">
                <div class="user-name">{{ user.user_name }}</div>
                <img
                  class="gender"
                  :src="user.gender === 'MALE' ? require('./img/male.png') : require('./img/female.png')"
                  alt=""
                />
              </div>

              <div class="price-person">
                <div class="course-price">{{ user.course_name }}</div>
              </div>
            </div>
          </div>
          <div class="course-right">
            <div class="student-list" @click="goStudentList(user.id)">
              训练日志
            </div>
            <div class="course-time">
              {{ user.begin_time + '-' + user.end_time }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="no-data" v-if="courseData.length === 0">
      <div class="no-data__content">
        <div class="no-data__pic" />
        <div class="no-data__context">
          暂无学员预约
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './style.stylus'
import { go } from '@utils/goto'
import moment from 'moment'

export default {
  data() {
    return {
      // new
      dates: [],
      currentWeek: [],
      // old
      currentDate: '',
      weekDates: [[], [], []],
      currentIndex: '',
      weekDay: [
        { date: '', week: 7 },
        { date: '', week: 1 },
        { date: '', week: 2 },
        { date: '', week: 3 },
        { date: '', week: 4 },
        { date: '', week: 5 },
        { date: '', week: 6 }
      ],
      courseData: [],
      endx: 0,
      actIndex: 1,
      sliderWidth: 0,
      distan: { x: 0, y: 0 },
      isAnimation: false,
      start: { x: 0, y: 0 },
      direction: '',
      clickIndex: '',
      coachId: '',
      coachName: '',
      hasCourseDate: [],
      imgUrl: ''
    }
  },
  computed: {
    getTransform() {
      // console.log("getTransform222");
      this.endx = -this.actIndex * this.sliderWidth + this.distan.x
      // this.endx = 1500;
      const style = {}
      style['transform'] = 'translateX(' + this.endx + 'px)'
      // style["color"] = "red";
      style['transition'] = this.isAnimation ? 'transform .5s ease-out' : 'none'
      return style
    },
    imgTransform() {
      const style = {}
      style['background'] = 'url(./img/broken.png)'
      return style
    },
    chineseWeek() {
      return week => {
        if (week === 1) {
          return '一'
        }
        if (week === 2) {
          return '二'
        }
        if (week === 3) {
          return '三'
        }
        if (week === 4) {
          return '四'
        }
        if (week === 5) {
          return '五'
        }
        if (week === 6) {
          return '六'
        }
        if (week === 7) {
          return '日'
        }
      }
    },
    currentYear() {
      // return this.dates[1].date.format("YYYY");
      return moment(this.currentDate).format('YYYY')
    },
    currentMonth() {
      return moment(this.currentDate).format('MM')
    },
    currentDay() {
      return moment(this.currentDate).format('DD')
    }
  },
  watch: {},
  methods: {
    // 获取教练简单信息
    getCoachInfo() {
      return this.$http
        .get('./pt/coach_info')
        .then(res => {
          this.coachId = res.data.id
          this.coachName = res.data.name
          console.log('获取教练信息')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取教练排课情况
    getCourseInfo() {
      const data = {
        coach_id: this.coachId,
        date: this.currentDate
      }
      this.$http
        .get('./pt/user_list', { params: data })
        .then(res => {
          this.courseData = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 判断是否有课
    judgeHasCourse() {
      const _currentWeekDates = this.getCurrentWeekDates(this.dates[1].date)
      console.log('判断', _currentWeekDates)
      const _beginDate = _currentWeekDates[0].date
      const _endDate = _currentWeekDates[6].date
      const data = {
        begin_date: _beginDate,
        end_date: _endDate,
        coach_id: this.coachId
      }
      this.$http
        .get('./pt/timetable', { params: data })
        .then(res => {
          const _hasCourseDates = res.data
          for (let i = 0; i < _hasCourseDates.length; i++) {
            if (_hasCourseDates[i].has_course) {
              this.hasCourseDate.push(_hasCourseDates[i].date)
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取上一周，本周，下一周数据
    getDatesInfo() {
      console.log('测试异步操作')
      this.dates[0] = { date: moment().subtract(7, 'd') }
      this.dates[1] = { date: moment() }
      this.dates[2] = { date: moment().add(7, 'd') }
      console.log(this.dates)
      // 选取默认下标索引
      this.judgeCurrentIndex()
      this.currentDate = this.dates[1].date.format('YYYY-MM-DD')
      this.getCourseInfo()
      this.judgeHasCourse()
    },
    // 点击去学员列表页面
    goStudentList(id) {
      go(`./takePic.html?course_user_id=${id}`)
    },
    // getDate() {
    //   const _currentWeek = Number(moment().format("E"));
    //   const _lastWeek = moment()
    //     .subtract(7, "d")
    //     .format("YYYY-MM-DD");
    //   console.log(_lastWeek);
    //   for (let i = 0; i < this.weekDay.length; i++) {
    //     if (this.weekDay[i].week === _currentWeek) {
    //       this.weekDay[i].date = moment()
    //         .format("YYYY-MM-DD")
    //         .substring(5);
    //     }
    //   }
    //   console.log(this.weekDay);
    // },
    getCurrentWeekDates(date) {
      const weekOfDate = Number(moment(date).format('E'))
      const weeks = [7, 1, 2, 3, 4, 5, 6]
      const today = moment()
      const arr = []
      for (let i = 0; i < 7; i++) {
        const _theDate = moment(date).subtract(weekOfDate - i, 'd')
        arr.push({
          date: _theDate.format('YYYY-MM-DD'),
          moDate: _theDate,
          week: weeks[i],
          isToday: _theDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')
        })
      }
      // console.log(arr);
      return arr
    },
    getThreeWeekDates() {
      // const _date = this.currentDate;
      this.weekDates[0] = this.getCurrentWeekDates(this.currentDate.subtract(7, 'd'))
      // const _datetwo = this.currentDate;
      // console.log("dateTwo", _datetwo);
      this.weekDates[1] = this.getCurrentWeekDates(this.currentDate.add(7, 'd'))
      // console.log("getThreeWeekDates", this.currentDate, this.weekDates[1]);
      // const _datethree = this.currentDate;
      // console.log("date3", _datethree);
      this.weekDates[2] = this.getCurrentWeekDates(this.currentDate.add(7, 'd'))
      console.log('getThreeWeekDates最终结果', this.currentDate, this.weekDates)
    },
    // getLastWeek() {
    //   this.weekDates = [];
    //   this.currentDate = this.currentDate.subtract(7, "d");
    //   this.getCurrentWeekDates(this.currentDate);
    // },
    // getNextWeek() {
    //   this.weekDates = [];
    //   this.currentDate = this.currentDate.add(7, "d");
    //   this.getCurrentWeekDates(this.currentDate);
    // },
    clickDate(index) {
      this.currentIndex = index
      // const _currentWeek = this.weekDates[1]
      // this.currentDate = this.getCurrentWeekDates(
      //   this.dates[this.actIndex].date
      // );
      this.currentWeek = this.getCurrentWeekDates(this.dates[this.actIndex].date)
      this.currentDate = this.currentWeek[index].date
      console.log('那一周数据', this.getCurrentWeekDates(this.dates[this.actIndex].date))
      this.getCourseInfo()
      // this.clickIndex = index;
    },
    // 选取默认选中的值
    judgeCurrentIndex() {
      // 如果是星期日的话下标索引为0
      if (Number(this.dates[this.actIndex].date.format('E')) === 7) {
        this.currentIndex = 0
        return
      }
      // 如果不是星期日的话，星期几则下标索引就是几
      this.currentIndex = Number(this.dates[this.actIndex].date.format('E'))
    },
    // getTransform() {
    //   console.log("getTransform222");
    //   // this.endx = -this.actIndex * this.sliderWidth + this.distan.x;
    //   // this.endx = 1500;
    //   const style = {};
    //   style["transform"] = "translateX(" + this.endx + "px)";
    //   style["color"] = "red";
    //   style["transition"] = this.isAnimation
    //     ? "transform .5s ease-out"
    //     : "none";
    //   return style;
    // },
    touchStart(e) {
      // console.log("touchStart");
      this.start.x = e.touches[0].pageX
      // console.log("start", this.weekDates);
    },
    touchMove(e) {
      // 这里需要过渡动画
      // console.log("touchMove", e);
      this.isAnimation = true
      this.distan.x = e.touches[0].pageX - this.start.x
      // 需要移动的容器
      const dom = this.$refs.sliders
      // 向左
      this.endx = this.endx + this.distan.x
      // this.endx = "350";
      dom.style['transform'] = 'translateX(' + this.endx + 'px)'
    },
    touchEnd(e) {
      console.log('touchEnd')
      this.isAnimation = true
      this.distan.x = e.changedTouches[0].pageX - this.start.x
      // 向右
      if (this.distan.x > 0) {
        this.direction = 'right'
        this.actIndex = 0
        // this.currentDate = this.currentDate.subtract(7, "d");
      } else if (this.distan.x < 0) {
        this.direction = 'left'
        this.actIndex = 2
        // this.currentDate = this.currentDate.add(7, "d");
      }
      this.distan.x = 0
    },
    transitionEnd() {
      this.isAnimation = false
      // console.log("transitionEnd");
      if (this.actIndex === 2) {
        // this.weekDates = [];
        // this.currentDate = this.currentDate.add(7, "d");
        // console.log("shift前", this.weekDates);
        this.dates.push({
          date: moment(this.dates[this.actIndex].date).add(7, 'd')
        })
        this.dates.shift()
        const _currentWeek = this.getCurrentWeekDates(this.dates[1].date)
        this.currentDate = _currentWeek[this.currentIndex].date
        console.log('shift后', this.weekDates)
        this.actIndex = 1
      } else if (this.actIndex === 0) {
        this.dates.unshift({
          date: moment(this.dates[this.actIndex].date).subtract(7, 'd')
        })
        this.dates.pop()
        this.actIndex = 1
        const _currentWeek = this.getCurrentWeekDates(this.dates[1].date)
        this.currentDate = _currentWeek[this.currentIndex].date
        // this.currentDate = this.weekDates[1][this.currentIndex].moDate;
        // this.weekDates.unshift(this.getCurrentWeekDates(this.currentDate));
        // this.weekDates.pop();
        // console.log(this.weekDates);
        // console.log("transitionEnd", this.currentDate, this.weekDates);
        // this.dates.unshift({
        //   date: moment(this.dates[this.actIndex].date)
        //     .subtract(7, "d")
        //     .format("YYYY-MM-DD")
        // });
        // this.dates.pop();
        // this.actIndex = 1;
      }
      console.log(this.currentDate)
      this.getCourseInfo()
      this.judgeHasCourse()
    }
  },
  created() {
    // this.getDate();
    // this.currentDate = moment();
    // this.currentDate.subtract(7, "d");
    // console.log("生命周期测试", this.currentDate);
    // 获取当前一周的日期与星期
    // this.getCurrentWeekDates(moment());
    // this.getThreeWeekDates();
    // this.judgeCurrentIndex();
    this.imageUrl = './img/broken.ong'
    this.sliderWidth = document.body.offsetWidth
    this.getCoachInfo().then(() => {
      this.getDatesInfo()
    })
  }
}
</script>
