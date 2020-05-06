<template>
  <div class="success-page">
    <div class="success">
      <img src="../assets/img/success.png" />
      <div class="success-title">提交成功!</div>
      <div class="success-btn">
        <el-button @click="returnList">返回列表</el-button>
        <el-button type="primary" @click="continueApply">继续创建</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    returnList() {
      this.$router.push({path: '/dashboard'})
    },
    continueApply() {
      this.$router.push({path: '/apply'})
    }
  }
}
</script>

<style lang="less">
.success-page {
  background: #ffffff;
  padding: 10px;
  height: 100%;
  .success {
    text-align: center;
    margin-top: 50px;
    img {
      width: 155px;
      height: 155px;
    }
    .success-title {
      margin-top: 20px;
      color: #2d303b;
    }
    .success-btn {
      margin-top: 30px;
    }
  }
}
</style>
