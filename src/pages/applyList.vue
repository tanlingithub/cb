<template>
  <div class="apply-list">
    <el-data-table v-bind="tableConfig"></el-data-table>
  </div>
</template>

<script>
import ElDataTalbe from '@/components/el-data-table'
import dayjs from 'dayjs'
export default {
  components: {
    ElDataTalbe
  },
  data() {
    return {
      tableConfig: {
        // role:JSON.parse(localStorage.getItem('role')).role,
        // canSearchCollapse: true,
        hasPagination: false,
        hasEdit: false,
        hasDelete: false,
        dataPath: 'payload.data',
        hasNew: false,
        url: '/poc/api/v1/kabin/apply/list?role=admin',
        headerButtons: [],
        extraButtons: [
          {
            text: '审批',
            disabled: true,
            style: {color: '#C0C4CC'},
            show: row => {
              return !row.canUse
            }
          },
          {
            text: '审批',
            show: row => {
              return row.canUse
            },
            atClick: row => {
              if (row.canUse) {
                this.$router.push({
                  path: '/apply-detail',
                  query: {detailId: row._id, isApply: true}
                })
                return Promise.resolve(false)
              }
            }
          },
          {
            text: '查看详情',
            atClick: row => {
              this.$router.push({
                path: '/apply-detail',
                query: {detailId: row._id}
              })
              return Promise.resolve(false)
            }
          }
        ],
        operationAttrs: {
          width: 120,
          align: 'center'
        },
        columns: [
          {
            prop: '_id',
            label: '审批编号',
            align: 'center'
          },
          {
            prop: 'createdAt',
            label: '创建时间',
            align: 'center',
            width: 160,
            formatter: data => {
              return dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            prop: 'step',
            label: '当前阶段',
            align: 'center',
            formatter: data =>
              [, '开店申请', '空间图纸', '装修进度', '开业上报'][data.step]
          },
          {
            prop: 'currentIndex',
            label: '订单状态',
            align: 'center',
            formatter: data => {
              return this.orderStatus(data.currentIndex)
            }
          },
          //   {
          //     prop: 'type',
          //     align: 'center',
          //     label: '审批状态',

          //     formatter: data => {
          //       if (data.status === 1) {
          //         return '已完成'
          //       } else {
          //         if (data.currentIndex === 0 || data.currentIndex === 6) {
          //           return '待处理'
          //         } else {
          //           return '待审批'
          //         }
          //       }
          //     }
          //   },
          {
            prop: 'updatedAt',
            label: '更新时间',
            align: 'center',
            width: 160,
            formatter: data => {
              return dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            prop: 'company',
            label: '所在机构',
            align: 'center'
          },
          {
            prop: 'name',
            align: 'center',
            label: '门店名称'
          }
        ],
        searchForm: [
          {
            type: 'input',
            id: '_id',
            label: '审批编号',
            el: {
              placeholder: '请输入审批编号'
            }
          },
          {
            type: 'select',
            id: 'type',
            label: '订单状态',
            options: [
              {
                label: '待经销商处理',
                value: '0'
              },
              {
                label: '待大区审批',
                value: '1'
              },
              {
                label: '待渠道部审批',
                value: '2'
              },
              {
                label: '待空间部审批',
                value: '3'
              },
              {
                label: '已完成',
                value: '4'
              }
            ],
            el: {
              size: 'medium',
              placeholder: '请选择订单状态'
            }
          }
        ]
      }
    }
  },
  computed: {},
  methods: {
    async approve() {
      try {
        const result = await this.$axios.get('/poc/api/v1/kabin/approve')
        console.log('result :', result)
      } catch (error) {
        console.log('error: ', error)
      }
    },
    orderStatus(data) {
      switch (data) {
        case 0:
          return '待经销商处理'
          break
        case 1:
          return '待大区审批'
          break
        case 2:
          return '待渠道部审批'
          break
        case 3:
          return '待经销商处理'
          break
        case 4:
          return '待空间部审批'
          break
        case 5:
          return '待经销商处理'
          break
        case 6:
          return '待空间部审批'
          break
        case 7:
          return '待经销商处理'
          break
        case 8:
          return '待渠道部审批'
          break
        case 9:
          return '已完成'
      }
    }
  }
}
</script>
<style lang="less">
.apply-list {
  background: #fff;
  padding: 2rem;
  margin-top: 20px;
  .el-input--mini .el-input__inner {
    height: 36px;
    line-height: 28px;
  }
}
.dis-class {
  color: #c0c4cc;
}
</style>
