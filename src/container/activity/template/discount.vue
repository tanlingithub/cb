<template>
  <div class="discount">
    <!-- 满额打折  -->
    <div v-for="(item, index) in rules" class="mb10 item">
      满
      <el-input-number
        class="limit-input"
        v-model="item.limit"
        :min="0"
        controls-position="right"
      ></el-input-number>
      元，打
      <el-input-number
        class="limit-input"
        v-model="item.discount"
        controls-position="right"
        :precision="1"
        :step="1"
        :max="10"
        :min="1"
      ></el-input-number>
      折

      <el-button
        v-if="index > 0"
        class="ml10"
        :min="0"
        type="text"
        @click="delHandle(index)"
        >删除</el-button
      >
    </div>

    <el-button type="text" icon="el-icon-plus" @click="add">添加级</el-button>
  </div>
</template>

<script>
const DEFAULT_DATA = {
  limit: '',
  discount: '',
  policyName: ''
}

export default {
  name: 'Discount',
  components: {},
  data() {
    return {
      rules: []
    }
  },
  methods: {
    resetData() {
      this.rules = [
        {
          ...DEFAULT_DATA,
          id: +new Date()
        }
      ]
    },
    add() {
      this.rules.push({...DEFAULT_DATA, id: +new Date()})
    },
    delHandle(index) {
      this.rules.splice(index, 1)
    },
    valid() {
      return new Promise((resole, reject) => {
        for (let i = 0; i < this.rules.length; i++) {
          let item = this.rules[i]

          if (item.limit <= 0) {
            return reject('满额设置请输入大于0的数字')
          }

          this.rules[i].policyName = `满${item.limit}元${item.discount}折`
        }

        resole(JSON.parse(JSON.stringify(this.rules)))
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/var.less';

.discount {
  margin-bottom: 40px;

  .item {
    &:not(:first-child) {
      border-top: 1px solid #ddd;
      padding-top: 20px;
      margin-top: 20px;
    }
  }

  .limit-input {
    width: 100px;
  }
}
</style>
