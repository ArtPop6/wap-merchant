<template>
  <div class="wrap2">
    <div class="info">
      <div class="description">
        <div class="name">{{ personalData.real_name }}</div>
        <div class="career">研发经理 &nbsp; | &nbsp; 产品研发部</div>
      </div>
      <img
        :src="personalData.img_url ? personalData.img_url : require('../../assets/tabBar/timg.png')"
        alt
        class="leaderImg"
      />
    </div>

    <div class="my-student__wrap">
      <div @click="goMyCourse" class="my-student">
        <div class="my-student__desc">
          <!-- <van-icon name="records" size="20" /> -->
          <van-icon name="label-o" size="20" />
          <div class="my-student__title">团课</div>
        </div>
        <van-icon name="arrow" color="#797979" />
      </div>
      <div @click="goMyCoach" class="my-student">
        <div class="my-student__desc">
          <!-- <van-icon name="records" size="20" /> -->
          <van-icon name="label-o" size="20" />
          <div class="my-student__title">私教</div>
        </div>
        <van-icon name="arrow" color="#797979" />
      </div>
    </div>

    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/tab'
import { go } from '@utils/goto'

export default {
  components: {
    Tabbar
  },
  data: function() {
    return {
      personalData: []
    }
  },
  methods: {
    getPersonalData() {
      this.$http
        .get('/users')
        .then(result => {
          this.personalData = result.data
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    goMyCourse() {
      go('./myStudents.html')
    },
    goMyCoach() {
      go('./myCoach.html')
    }
  },
  created() {
    this.getPersonalData()
  }
}
</script>

<style lang="stylus">
body
  background-color #fff

  .wrap2
    .info
      display flex
      width 750px
      height 300px
      // border-bottom 1px solid rgb(238, 238, 238)

      .description
        margin-top 160px

        .name
          margin-left 50px
          font-size 40px
          height 50px
          line-height 50px

        .career
          margin-left 50px
          margin-top 10px
          font-size 28px
          color #797979

      .leaderImg
        position absolute
        width 120px
        height 120px
        border-radius 50%
        margin-top 150px
        right 56px
        border 2px solid #ebebeb

    // border 2px solid transparent
    // background linear-gradient(30deg, #3494e6, #ec6ead)

    .department
      width 750px
      height 100px
      color #797979
      font-size 32px
      padding-top 28px
      padding-left 50px
      border-bottom 1px solid rgb(238, 238, 238)

    .my-student__wrap
      width 100%
      border-top 1px solid rgb(238, 238, 238)

      .my-student
        display flex
        height 100px
        width 100%
        padding 0 46px
        justify-content space-between
        align-items center
        border-bottom 1px solid rgb(238, 238, 238)
        // box-shadow 0 -3px 6px #ebebeb

        .my-student__desc
          display flex
          align-items center

          .my-student__title
            font-size 32px
            margin-left 16px
            color #797979
</style>
