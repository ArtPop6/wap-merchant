<template>
  <div class="wrap2">
    <!-- <van-loading type="spinner" /> -->
    <!-- <van-loading size="24px" vertical color="red">加载中...</van-loading> -->
    <div class="pic">
      <img src="../../assets/tabBar/circle.jpg" class='avatar' alt="" @click="rotate">
    </div>
    <div class="pict">
      <img class="avatart" src="../../assets/tabBar/AMPM.png" alt="">
    </div>
    <div class="title">     
      服务不能靠吼<br>动脑也要动手
    </div>
  </div>
</template>

<script>
import toast from '../../components/toast'
import { go } from '@utils/goto'
import param from '@utils/url-param'

export default {
  methods: {
    getToken () {
      const code = param('code')
      this.$http.get(`/auth/login?code=${code}`).then((res) => {
        const data = res.data
        if (data.access_token !== 'undefined' && data.access_token != null) {
          localStorage.setItem('access_token', data.access_token)
          go('./index.html')
        } else {
          toast(data.msg)
        }
      }, () => {
        alert('啦啦啦，登录出错了，请联系贵公司的IT人员')
      })
    }
  },
  created () {
    this.getToken()
  }
}
</script>

<style lang="stylus">
body {
  // background: linear-gradient(30deg, #fddc42, #000);
  .wrap2 {
    background-color #F3D924
    height 1624px
    // background: linear-gradient(30deg, #12c2e9,  #c471ed, #f64f59);
    // background: linear-gradient(30deg, #fddc42, #000);
    // .van-loading {
    //   text-align center
    // }
    position relative
    .pic {
      .avatar {
        z-index -1
        animation rotate 0.7s infinite 
        // border 2px solid transparent
        margin-top 150px
        margin-left 225px
        height 300px
        width 300px
        border-radius 50%
        @keyframes rotate
        {
          0% {
            // background:red;
            transform:rotate(0deg)
          }
          10% {
            // background:yellow;
            transform:rotate(36deg)
          }
          20% {
            // background blue
            transform:rotate(72deg)
          }
          30% {
            // background green
            transform:rotate(108deg)
          }
          40% {
            // background orange
            transform:rotate(144deg)
          }
          50% {
            // background purple
            transform:rotate(180deg)
          }
          60% {
            // background pink
            transform:rotate(216deg)
          }
          70% {
            // background purple
            transform:rotate(252deg)
          }
          80% {
            // background purple
            transform:rotate(288deg)
          }
          90% {
            // background purple
            transform:rotate(324deg)
          }
          100% {
            background aqua
            transform:rotate(360deg)
          }
        }
      }
    }
    .pict {
      z-index 3
      .avatart {
        border 20px solid transparent
        position absolute
        left 225px
        top 200px
        height 200px
        width 300px
        border-radius 50%
      }
    }
    .title {
      margin-top 200px
      text-shadow 1px 1px 8px #000
      width 100%
      font-size 46px
      text-align center
      color #fff
    }
  }
}

</style>
