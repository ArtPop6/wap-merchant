<template>
  <div class="list-wrap">
    <div class="course-desc">
      <div class="course-desc__wrap">
        <div class="course-desc__store">{{ storeName }}</div>
        <div class="course-desc__info">
          <div class="course-desc__left">
            <img alt class="coach-avatar" :src="courseInfo.coach_avatar" />
            <div class="course-detail">
              <div class="course-name">{{ courseInfo.course_name }}</div>
              <div class="course-price-count">
                <div class="course-price">￥{{ courseInfo.price }}</div>
                <div class="course-count"></div>
              </div>
            </div>
          </div>
          <div class="course-desc__right">
            <div class="course-desc__time">
              {{ courseInfo.begin_time + '-' + courseInfo.end_time }}
            </div>
            <div class="course-count">
              {{ courseInfo.sign_count + '人/' + courseInfo.course_capacity + '人' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="student-list__wrap">
      <div class="student-list" v-for="(item, index) in studentList" :key="index">
        <div class="student-list__left">
          <div class="seat">{{ item.seat_number + '号位' }}</div>
          <img alt class="student-avatar" :src="item.img" />
          <div class="student-info">
            <div class="student-info__name">{{ item.nick_name }}</div>
            <div class="student-info__tele">{{ item.phone }}</div>
          </div>
        </div>
        <div class="time" :class="item.sign_date ? 'sign-blue' : ''">
          {{ item.sign_date ? item.sign_date : '待签到' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './style.stylus'
import param from '@utils/url-param'

export default {
  data() {
    return {
      storeName: '',
      courseInfo: {},
      studentList: [],
      coachId: '',
      timetableId: param('timetable'),
      storeId: param('store_id'),
      date: param('date')
    }
  },
  methods: {
    getCoachInfo() {
      return this.$http
        .get('./group_exercise/coach_info')
        .then(res => {
          this.coachId = res.data.id
        })
        .catch(err => {
          console.log(err)
        })
    },
    getStudentList() {
      const data = {
        coach_id: this.coachId,
        timetable_id: this.timetableId,
        store_id: this.storeId,
        date: this.date
      }
      this.$http.get('./group_exercise/course_book_detail', { params: data }).then(res => {
        this.studentList = res.data.users
        this.courseInfo = res.data.course
        this.storeName = res.data.store_name
      })
    }
  },
  created() {
    this.getCoachInfo().then(() => {
      this.getStudentList()
    })
  }
}
</script>
