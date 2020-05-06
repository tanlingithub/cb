<template>
  <div class="index">
    <div class="apply">
      <div class="title">
        <span class="line"></span>
        基本信息
      </div>

      <div class="apply-form">
        <el-form-renderer
          :content="applyContent"
          ref="applyForm"
          label-width="120px"
        ></el-form-renderer>
      </div>
      <div class="footer-btn">
        <el-button class="return-btn" @click="resetForm('applyForm')"
          >返回</el-button
        >
        <el-button type="primary" @click="submitForm('applyForm')"
          >提交</el-button
        >
      </div>
    </div>

    <el-dialog
      lock-scroll
      title="地图"
      ref="mapDialog"
      close="map-dialog"
      @close="closeDialog"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <current-loation @mapSearch="getPosition"></current-loation>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CurrentLoation from '@/components/currentLocation/index.vue'
import {Message} from 'element-ui'
import {ElDialog} from 'element-ui'
import UploadToAli from '@femessage/upload-to-ali'
import ElSelectArea from '@femessage/el-select-area'
import {importMember} from '../const/api'
export default {
  components: {
    CurrentLoation
  },
  data() {
    return {
      addressDatas: [],
      formattedAddress: '',
      dialogVisible: false,
      applyContent: [
        {
          type: 'input',
          id: 'name',
          label: '门店名称',
          attrs: {'data-name': 'form1'},
          el: {
            placeholder: '请输入门店名称'
          },
          rules: [
            {required: true, message: '请输入门店名称', trigger: 'blur'}
            // { min: 3, max: 5, message: 'length between 3 to 5', trigger: 'blur' }
          ]
        },
        {
          type: 'select',
          id: 'storeType',
          label: '门店类型',
          options: [
            {
              label: '其他',
              value: 0
            },
            {
              label: '百货商场',
              value: 1
            },
            {
              label: '商场连锁卖场',
              value: 2
            }
          ],
          el: {
            placeholder: '请选择门店类型'
          },
          rules: [{required: true, message: '请选择门店类型', trigger: 'blur'}]
        },
        {
          component: {
            props: {
              value: String
            },
            model: {
              event: 'input',
              prop: 'value'
            },
            methods: {
              change() {
                this.$emit('input', this.value)
              },
              clickHandler: () => {
                this.dialogVisible = true
              }
            },
            render() {
              return (
                <div class="position-select">
                  <el-input
                    readonly
                    placeholder="请选择所在地区"
                    onChange={this.change}
                    value={this.value}
                  />
                  <el-button onClick={this.clickHandler} type="text">
                    选择位置
                  </el-button>
                </div>
              )
            }
          },
          // type: 'input',
          id: 'addressData',
          label: '所在地区',
          attrs: {'data-name': 'form1'},
          on: {
            click: () => {
              this.dialogVisible = true
            }
          },
          el: {
            placeholder: '请选择门店所在地区'
          },
          rules: [
            {
              required: true,
              message: '请选择门店所在地区',
              trigger: 'change'
            }
            // { min: 3, max: 5, message: 'length between 3 to 5', trigger: 'blur' }
          ]
        },
        {
          type: 'input',
          id: 'detailAddress',
          label: '详细地址',
          attrs: {'data-name': 'form1'},
          el: {
            placeholder: '请输入门店详细地址'
          },
          rules: [
            {required: true, message: '请输入门店详细地址', trigger: 'blur'}
            // { min: 3, max: 5, message: 'length between 3 to 5', trigger: 'blur' }
          ]
        },
        {
          type: 'input',
          id: 'amount',
          label: '开店租金(元)',
          attrs: {'data-name': 'form1'},
          el: {
            placeholder: '请输入门店租金'
          },
          rules: [
            {required: true, message: '请输入门店租金', trigger: 'blur'}
            // {min: 3, max: 5, message: '门店租金不得少于3位数', trigger: 'blur'}
          ]
        },
        {
          type: 'input',
          id: 'people',
          label: '业务对接人',
          attrs: {'data-name': 'form1'},
          el: {
            placeholder: '请输入业务对接人'
          },
          rules: [
            {required: true, message: '请输入业务对接人', trigger: 'blur'}
            // { min: 3, max: 5, message: 'length between 3 to 5', trigger: 'blur' }
          ]
        },
        {
          type: 'input',
          id: 'peoplePhone',
          label: '对接人电话',
          attrs: {'data-name': 'form1'},
          el: {
            placeholder: '请输入对接人电话'
          },
          rules: [
            {required: true, message: '请输入对接人电话', trigger: 'blur'}
            // { min: 3, max: 5, message: 'length between 3 to 5', trigger: 'blur' }
          ]
        },
        {
          component: UploadToAli,
          type: 'upload-to-ali',
          id: 'contractsImages',
          label: '合同',
          el: {
            accept: 'image/*',
            multiple: true,
            max: 3,
            size: 1024,
            tip: '支持png,jpg格式,1M以内'
          },
          rules: [
            {
              required: true,
              message: '请上传合同照片',
              trigger: 'change',
              type: 'array'
            }
            // { min: 3, max: 5, message: 'length between 3 to 5', trigger: 'blur' }
          ]
        }
      ]
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submit(this.$refs[formName].getFormValue())
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submit(data) {
      data.addressData = this.addressDatas
      try {
        const result = await this.$axios.post(
          '/poc/api/v1/kabin/apply/create',
          data
        )
        if (result.data.success) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.addressDatas = []
          this.$refs.applyForm.resetFields()
          this.$router.push({path: '/applySuccess'})
        }
      } catch (error) {
        console.log('error: ', error)
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },
    getPosition() {
      this.addressDatas = JSON.parse(localStorage.getItem('location'))
      this.addressMap = JSON.parse(localStorage.getItem('regecode'))
      let {
        province,
        city,
        district,
        township,
        street
      } = this.addressMap.addressComponent
      this.formattedAddress = `${province}${city}${district}${township}${street}${
        this.addressDatas.name
      }`
      this.addressDatas.formattedAddress = this.formattedAddress
      this.$refs.applyForm.updateForm({
        addressData: this.formattedAddress
      })
      this.closeDialog()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({
        path: '/dashboard'
      })
    }
  }
}
</script>
<style lang="less">
.index {
  .home-img {
    width: 100%;
  }
  .footer-btn {
    text-align: center;
  }
  .return-btn {
    border-color: #409eff;
    color: #409eff;
  }
  .apply {
    background: #fff;
    padding: 20px 20px;
    .title {
      padding-bottom: 15px;
      font-size: 14px;
      color: #2d303b;
      .line {
        border-left: 1px solid #2d303b;
        border-width: 3px;
        margin-right: 10px;
      }
    }
    .apply-form {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      .el-form {
        width: 658px;
      }
      .position-select {
        display: flex;
        .el-input {
          flex: 8;
        }
        .el-button {
          flex: 2;
        }
      }
    }
  }
  .map-dialog {
  }
}
</style>
