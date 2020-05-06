<template>
  <div class="login">
    <!--样式在layout/login-->
    <div class="main">
      <el-form :model="form" status-icon :rules="rules" ref="loginForm" class="login-content">
        <!-- <el-form-item label="" prop="code">
          <el-input
            placeholder="租户ID"
            type="code"
            v-model.trim="form.code"
            auto-complete="off"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>-->
        <el-form-item label prop="username">
          <el-input placeholder="用户名/邮箱" v-model.trim="form.username"></el-input>
        </el-form-item>
        <el-form-item label prop="password">
          <el-input
            placeholder="密码"
            type="password"
            v-model.trim="form.password"
            auto-complete="off"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <!--<p style="margin-bottom: 24px">用户名：{{test.username}}; 密码：{{test.password}}</p>-->
        <el-form-item>
          <el-button
            type="primary"
            @click="login"
            :loading="loading"
            size="medium"
            class="login-button primary-button"
          >登录</el-button>
        </el-form-item>
      </el-form>
      <!--<div style="text-align: right">-->
      <!--<nuxt-link to="/register">未有账号，直接注册</nuxt-link>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
const USERS = [
  {
    username: 'jingxiaoshang',
    nickName: '经销商',
    password: 'abcd1234',
    role: 'jxs'
  },
  {
    username: 'daqu',
    nickName: '大区经理',
    password: 'abcd1234',
    role: 'dq'
  },
  {
    username: 'zongbu',
    password: 'abcd1234',
    nickName: '总部',
    role: 'zb'
  },
  {
    username: 'kongjianbu',
    password: 'abcd1234',
    nickName: '空间部',
    role: 'kj'
  },
  {
    username: 'admin',
    nickName: '管理员',
    password: 'abcd1234',
    role: 'admin'
  }
]

import {mapMutations} from 'vuex'

export default {
  layout: 'login',
  name: 'login',
  head() {
    return {
      title: '卡宾 POC 登录'
    }
  },
  data() {
    const validateUserName = (rules, value, callback) => {
      if (!value) {
        callback('请输入账号')
      } else {
        callback()
      }
    }
    const validatePsw = (rules, value, callback) => {
      if (!value) {
        callback('请输入密码')
      } else {
        callback()
      }
    }

    return {
      test: {
        username: 'guest',
        password: 'guest1234'
      },
      loading: false,
      form: {
        username: '',
        password: '',
        code: ''
      },
      rules: {
        username: [{validator: validateUserName, trigger: 'blur'}],
        password: [{validator: validatePsw, required: true, trigger: 'blur'}],
        code: [{required: true, trigger: 'blur', message: '请输入租户ID'}]
      }
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          const userInfo = {
            username: this.form.username,
            password: this.form.password
          }

          const user = USERS.find(u => u.username === userInfo.username)

          if (!user) {
            this.$message.error('用户不存在，请重试')
            this.loading = false
            return
          }

          if (user.password !== userInfo.password) {
            this.$message.error('用户密码错误，请重试')
            this.loading = false
            return
          }

          this.setUserInfo(user)
          localStorage.setItem('user', JSON.stringify(user))
          this.loading = false

          // this.$router.replace('/')
          if (user.role === 'jxs') {
            this.$router.push({path: '/apply'})
          } else {
            this.$router.push({path: '/applyList'})
          }
        } else {
          this.loading = false
          return false
        }
      })
    },

    toSignUp() {
      this.$router.push('/register')
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .login-button {
    font-weight: 400;
  }
}

.main {
  margin-bottom: 30px;
}
</style>
