<template>
  <div class="personal-trainer">
    <div class="student-info__wrap">
      <div class="class-desc">
        <div class="class-name__desc">
          <div class="class-name__title">课程:</div>
          <div class="class-name">{{ className }}</div>
        </div>
        <div class="class-time__desc">
          <div class="class-time__title">时间:</div>
          <div class="class-time">{{ classDate + ' / ' + classTime }}</div>
        </div>
      </div>

      <div class="member-desc">
        <div class="member-title">会员:</div>
        <div class="member-name">{{ memberName }}</div>
      </div>
    </div>

    <div class="class-proccess">
      <div class="class-plan__wrap">
        <div class="class-plan">课程规划:</div>
        <van-uploader
          v-model="planList"
          max-count="5"
          max-size="10485760"
          preview-size="70"
          :after-read="afterPlan"
          @delete="deletePlan"
          :disabled="planLoading"
        />
        <!--        <van-field v-model="classDesc" label="课程描述" />-->
        <van-field
          v-model="classDesc"
          rows="5"
          type="textarea"
          maxlength="200"
          placeholder="请输入课程规划"
          show-word-limit
          autosize
        />
      </div>

      <div class="class-summary__wrap">
        <div class="class-summary">课后总结:</div>
        <van-uploader
          v-model="sumList"
          max-count="5"
          preview-size="70"
          max-size="10485760"
          :after-read="afterSummary"
          @delete="deleteSum"
          :disabled="sumLoading"
        />
        <van-field
          v-model="classSum"
          rows="5"
          autosize
          type="textarea"
          maxlength="200"
          placeholder="请输入课后总结"
          show-word-limit
        />
      </div>
    </div>

    <div class="button-group">
      <div class="confirm-button" v-if="buttonState" @click="changeState">
        {{ buttonState }}
      </div>
      <van-button
        @click="onSubmit"
        :loading="planLoading || sumLoading ? true : false"
        type="info"
        loading-text="图片上传中..."
        :disabled="courseState === '已旷课'"
        :class="courseState === '已旷课' || courseState === '已上课' ? 'absent' : 'noabsent'"
        >提&nbsp;&nbsp;交
      </van-button>
    </div>
  </div>
</template>

<script>
import toast from '../../components/toast'
import param from '@utils/url-param'
import './takePic.stylus'

export default {
  data() {
    return {
      planList: [],
      sumList: [],
      camera: 'camera',
      className: '',
      classTime: '',
      memberName: '',
      classDesc: '',
      classSum: '',
      courseUserId: param('course_user_id'),
      classDate: '',
      parentId: '',
      planId: '',
      sumId: '',
      courseId: '',
      userId: '',
      planLoading: false, // 课程规划图片加载情况
      sumLoading: false, // 课后总结图片加载情况
      courseState: '',
      stateChange: ''
    }
  },
  computed: {
    buttonState() {
      if (this.courseState === '未上课') {
        return '确认上课'
      }
      if (this.courseState === '上课中') {
        return '确认下课'
      }
      if (this.courseState === '已上课') {
        return ''
      }
      if (this.courseState === '已旷课') {
        return ''
      }
    }
  },
  methods: {
    afterPlan(file) {
      console.log('规划图片前', file)
      const formData = new FormData()
      formData.append('img', file.file)
      this.planLoading = true
      this.$http
        .post('./files', formData)
        .then(res => {
          this.planList[this.planList.length - 1].url = res.data.url
          this.planList[this.planList.length - 1].file_store_id = res.data.file_store_id
          this.planLoading = false
        })
        .catch(err => {
          console.log(err)
        })
      console.log('获取url后', this.planList)
    },
    deletePlan(file) {
      console.log('删除操作', this.planList, file)
    },
    afterSummary(file) {
      console.log('总结图片前', file)
      const formData = new FormData()
      formData.append('img', file.file)
      this.sumLoading = true
      this.$http
        .post(`./files`, formData)
        .then(res => {
          this.sumList[this.sumList.length - 1].url = res.data.url
          this.sumList[this.sumList.length - 1].file_store_id = res.data.file_store_id
          this.sumLoading = false
        })
        .catch(err => {
          console.log(err)
        })
      console.log('获取url后', this.sumList)
    },

    deleteSum(file) {
      console.log('删除操作', this.sumList, file)
    },
    // 更改上课状态
    changeState() {
      if (this.buttonState === '确认上课') {
        this.stateChange = 'START'
      }
      if (this.buttonState === '确认下课') {
        this.stateChange = 'FINISH'
      }
      // const data = {
      //   course_user_id: this.courseUserId,
      //   state: this.stateChange
      // }
      this.$http
        .put(`./pt/course_state?course_user_id=${this.courseUserId}&state=${this.stateChange}`)
        .then(res => {
          this.courseState = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    onSubmit() {
      const postData = {
        id: this.parentId,
        course_id: this.courseId,
        user_id: this.userId,
        planing: {
          id: this.planId,
          title: '课程规划',
          description: this.classDesc,
          imgs: this.planList
        },
        summary: {
          id: this.sumId,
          title: '课后总结',
          description: this.classSum,
          imgs: this.sumList
        }
      }
      console.log('提交的数据是', postData)
      this.$http
        .post('./pt/training_log', postData)
        .then(res => {
          toast('提交成功')
          // setTimeout(() => {
          //   go('./myCoach.html')
          // }, 1000)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 初始化数据
    getInitPic() {
      this.$http
        .get(`./pt/training_log?id=${this.courseUserId}`)
        .then(res => {
          this.planList = res.data.planing.imgs
          this.classDesc = res.data.planing.description
          this.sumList = res.data.summary.imgs
          this.classSum = res.data.summary.description
          this.className = res.data.course_name
          this.classDate = res.data.begin_date
          this.classTime = res.data.begin_time + '-' + res.data.end_time
          this.memberName = res.data.user_name
          this.parentId = res.data.id
          this.planId = res.data.planing.id
          this.sumId = res.data.summary.id
          this.courseId = res.data.course_id
          this.userId = res.data.user_id
          this.courseState = res.data.course_state
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getInitPic()
  }
}
</script>

<style lang="stylus"></style>
