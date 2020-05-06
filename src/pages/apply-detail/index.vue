<template>
  <section class="apply-detail" v-loading="isLoading">
    <div class="steps">
      <el-steps :active="activeIndex" space="200px">
        <el-step v-for="(node, index) of renderNodes" :key="index">
          <img class="step-image" alt="admin" slot="icon" :src="avatar[node.role]" />
          <p slot="title">
            {{ node.role | formatRole }}
            {{ node | stutsText(index) }}
          </p>
          <div class="text-grey" slot="description">
            <p>{{ node.name }}</p>
            <p>{{ node.doneTime | formatDoneTime }}</p>
          </div>
        </el-step>
      </el-steps>
    </div>

    <div class="details">
      <!-- admin -->
      <template v-if="user.role === 'admin'">
        <el-tabs value="first">
          <el-tab-pane label="开店申请" name="first">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>

                <div class="detail-item">
                  <span class="label">门店类型</span>
                  <span class="text">{{ detail.storeType | storeTypeText }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">业务对接人</label>
                  <span class="text">{{ detail.people }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">合同</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.contractsImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">对接人电话</label>
                  <span class="text">{{ detail.peoplePhone }}</span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <span class="label">门店名称</span>
                  <span class="text">{{ detail.name }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">开店租金</label>
                  <span class="text">{{ detail.amount }} 元</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="空间图纸" name="second">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>

                <div class="detail-item">
                  <span class="label">门店类型</span>
                  <span class="text">
                    {{
                    detail.storeType | storeTypeText
                    }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">图纸</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.spaceDrawingImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <span class="label">门店名称</span>
                  <span class="text">{{ detail.name }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="装修进度" name="third">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">装修类型</span>
                  <span class="text">
                    <span class="text">{{ detail.decorateType }}</span>
                  </span>
                </div>

                <div class="detail-item">
                  <span class="label">现场照片</span>
                  <span class="text">
                    <template v-if="showliveImages">
                      <upload-to-ali
                        preview
                        disabled
                        v-for="img of detail.liveImages"
                        :key="img"
                        :value="img"
                      ></upload-to-ali>
                    </template>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">建设内容</span>
                  <span class="text">
                    <span class="text">{{ detail.buildContent }}</span>
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">上传协议</span>
                  <span class="text">
                    <template v-if="showOpenProtocolImages">
                      <upload-to-ali
                        preview
                        disabled
                        v-for="img of detail.openProtocolImages"
                        :key="img"
                        :value="img"
                      ></upload-to-ali>
                    </template>
                  </span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">完工尺寸</label>
                  <span class="text">{{ detail.size }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">预计完成时间</label>
                  <span class="text">
                    <el-date-picker
                      disabled
                      v-model="detail.buildTime"
                      :placeholder="detail.buildTime"
                    ></el-date-picker>
                  </span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="开业上报" name="fourth">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">开业时间</span>
                  <span class="text">{{ detail.openTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">周边环境</span>
                  <span class="text">{{ detail.nearEnv }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">协议</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.openProtocolImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">跟场负责人</label>
                  <span class="text">{{ detail.followPeople }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">附件</label>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.openAccessoryImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <!-- 开店申请 -->
      <template v-else-if="detail.step === 1">
        <el-tabs value="kdsq">
          <el-tab-pane label="开店申请" name="kdsq">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">门店名称</span>
                  <span class="text">{{ detail.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">门店类型</span>
                  <span class="text">{{ detail.storeType | storeTypeText }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">合同</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.contractsImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">对接人电话</label>
                  <span class="text">{{ detail.peoplePhone }}</span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
                <div class="detail-item" v-if="user.role === 'dq'">
                  <label class="label">开店租金</label>
                  <span class="text">{{ detail.amount }} 元</span>
                </div>
                <div class="detail-item">
                  <label class="label">业务对接人</label>
                  <span class="text">{{ detail.people }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <!-- 空间图纸 -->
      <template v-else-if="detail.step === 2">
        <el-tabs value="kjtz">
          <el-tab-pane label="空间图纸" name="kjtz">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">门店类型</span>
                  <span class="text">{{ detail.storeType | storeTypeText }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">图纸</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.spaceDrawingImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <span class="label">门店名称</span>
                  <span class="text">{{ detail.name }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <!-- 装修进度 -->
      <template v-else-if="detail.step === 3">
        <el-tabs value="zxjd">
          <el-tab-pane label="装修进度" name="zxjd">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">完工尺寸</label>
                  <span class="text">{{ detail.size }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">现场照片</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      multiple
                      tip="支持png，jpg格式，300k以内"
                      :accept="fileAccept"
                      v-model="detail.liveImages"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">装修类型</span>
                  <span class="text">
                    <span class="text">{{ detail.decorateType }}</span>
                  </span>
                </div>
                <div class="detail-item">
                  <label class="label">预计完成时间</label>
                  <span class="text">
                    <el-date-picker
                      v-model="detail.buildTime"
                      :placeholder="detail.buildTime.toString()"
                    ></el-date-picker>
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">协议</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      multiple
                      :accept="fileAccept"
                      v-model="detail.decorateProtocolImages"
                      tip="支持png，jpg格式，300k以内"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">建设内容</span>
                  <span class="text">
                    <span class="text">{{ detail.buildContent }}</span>
                  </span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="空间图纸" name="kjtz">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">门店类型</span>
                  <span class="text">{{ detail.storeType | storeTypeText }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">图纸</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.spaceDrawingImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <span class="label">门店名称</span>
                  <span class="text">{{ detail.name }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <!-- 开业上报 -->
      <template v-else-if="detail.step === 4">
        <el-tabs value="kysb">
          <el-tab-pane label="开业上报" name="kysb">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">周边环境</span>
                  <span class="text">{{ detail.nearEnv }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">协议</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.openProtocolImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
                <div class="detail-item">
                  <label class="label">附件</label>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.openAccessoryImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">开业时间</span>
                  <span class="text">{{ detail.openTime }}</span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">跟场负责人</label>
                  <span class="text">{{ detail.followPeople }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="开店申请" name="kdsq">
            <div class="detail">
              <div class="detail-left">
                <div class="detail-item">
                  <label class="label">审批编号</label>
                  <span class="text">{{ detail._id }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">门店名称</span>
                  <span class="text">{{ detail.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">门店类型</span>
                  <span class="text">{{ detail.storeType | storeTypeText }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">合同</span>
                  <span class="text">
                    <upload-to-ali
                      preview
                      disabled
                      v-for="img of detail.contractsImages"
                      :key="img"
                      :value="img"
                    ></upload-to-ali>
                  </span>
                </div>
              </div>
              <div class="detail-middle">
                <div class="detail-item">
                  <span class="label">所在机构</span>
                  <span class="text">{{ detail.company }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">所在地区</label>
                  <span class="text">{{ areaText }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">对接人电话</label>
                  <span class="text">{{ detail.peoplePhone }}</span>
                </div>
              </div>
              <div class="detail-right">
                <div class="detail-item">
                  <label class="label">详细地址</label>
                  <span class="text">{{ detail.detailAddress }}</span>
                </div>
                <div class="detail-item">
                  <label class="label">业务对接人</label>
                  <span class="text">{{ detail.people }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template v-else>
        <p>请登录后查看</p>
      </template>
    </div>

    <div class="actions" v-if="isApply && canApply">
      <el-button @click="handleApprove(false)" :loading="isApplying">审核不通过</el-button>
      <el-button type="primary" @click="handleApprove(true)" :loading="isApplying">审核通过</el-button>
    </div>
  </section>
</template>

<script>
import {mapState} from 'vuex'
import admin from '@/assets/img/admin.png'
import jxs from '@/assets/img/jxs.png'
import dq from '@/assets/img/dq.png'
import kj from '@/assets/img/kj.png'
import zb from '@/assets/img/zb.png'

export default {
  name: 'ApplyDetail',
  mounted() {
    const {detailId, isApply} = this.$route.query

    this.detailId = detailId
    this.isApply = isApply ? isApply : false

    this.getDetail()
  },
  data() {
    return {
      isApply: false,
      isLoading: false,
      isApplying: false,
      detailId: '',
      detail: {
        buildTime: '',
        liveImages: [],
        decorateProtocolImages: []
      },
      uploadUrl03: '',
      uploadUrl04: '',
      fileAccept: 'image/*',
      avatar: {
        admin,
        jxs,
        dq,
        kj,
        zb
      }
    }
  },
  filters: {
    storeTypeText(type = 0) {
      switch (type) {
        case 0:
          return '其他'
          break
        case 1:
          return '百货商场'
          break
        case 2:
          return '商场连锁卖场'
          break
        default:
          return '未知'
          break
      }
    },
    formatRole(role) {
      switch (role) {
        case 'admin':
          return '管理员'
          break
        case 'dq':
          return '大区经理'
          break
        case 'kj':
          return '空间'
          break
        case 'zb':
          return '总部'
          break
        case 'jxs':
          return '经销商'
          break
      }
    },
    formatDoneTime(timestemp) {
      if (!timestemp) {
        return
      }
      return new Date(timestemp).toLocaleString()
    },
    stutsText(node, index) {
      if (node.status === 0) {
        if (node.role === 'jxs' || index === 6) {
          return '(待提交)'
        } else {
          return '(待审批)'
        }
      }
    }
  },
  computed: {
    ...mapState(['user']),
    renderNodes() {
      if (this.detail.nodes) {
        const step = this.detail.step

        if (this.user.role === 'admin') {
          return this.detail.nodes
        }

        if (step) {
          return this.detail.nodes.filter(node => node.step === step)
        }
      }

      return []
    },
    activeIndex() {
      const renderNodes = this.renderNodes

      if (renderNodes.length) {
        const index = renderNodes.findIndex(node => node.status === 0)
        return index
      }

      return 1
    },
    canApply() {
      if (this.user.role === 'admin') {
        return false
      }

      if (!this.detail) {
        return false
      }

      const index = this.detail.currentIndex

      if (!index) {
        return false
      }
      const node = this.detail.nodes[index]

      return node.status === 0
    },
    areaText() {
      if (this.detail.addressData) {
        if (this.detail.addressData.formattedAddress) {
          return this.detail.addressData.formattedAddress
        }

        return '未知'
      }
    },
    showliveImages() {
      if (this.detail.liveImages) {
        return this.detail.liveImages.every(i => !!i)
      }
      return false
    },
    showOpenProtocolImages() {
      if (this.detail.openProtocolImages) {
        return this.detail.openProtocolImages.every(i => !!i)
      }
      return false
    }
  },
  methods: {
    // 获取申请详细数据
    async getDetail() {
      this.isLoading = true

      try {
        const result = await this.$axios.get(
          `http://dcp.deepexi.top/poc-center/poc/api/v1/common/show?collection=kabin_task&_id=${
            this.detailId
          }`
        )

        if (!result.data.success) {
          this.$message.error('请求数据失败，请重试')
          return
        }

        const payload = result.data.payload

        this.detail = payload
        this.isLoading = false
      } catch (error) {
        this.$message.error('请求数据失败，请重试')
        this.isLoading = false
      }
    },
    // 提交审核通过或驳回请求
    async handleApprove(flag = false) {
      this.isApplying = true

      if (flag) {
        try {
          const data = {
            _id: this.detail._id
          }

          if (this.detail.currentIndex === 6) {
            const {
              liveImages,
              decorateProtocolImages,
              buildTime: _buildTime
            } = this.detail

            data.data = {
              liveImages,
              decorateProtocolImages,
              buildTime: new Date(_buildTime).getTime()
            }
          }

          const result = await this.$axios.post(
            '/poc/api/v1/kabin/apply/apply',
            data
          )

          if (result.data.success) {
            this.$message({
              message: '审核通过成功',
              type: 'success'
            })
          }

          this.isApplying = false
          this.$router.push('/applyList')
        } catch (error) {
          this.isApplying = false
          this.$message.error('提交审核失败，请重试')
        }
      } else {
        try {
          const data = {
            _id: this.detail._id
          }
          const result = await this.$axios.post(
            '/poc/api/v1/kabin/apply/reject',
            data
          )

          if (result.data.success) {
            this.$message({
              message: '驳回成功',
              type: 'success'
            })
          }

          this.isApplying = false
          this.$router.push('/applyList')
        } catch (error) {
          this.isApplying = false
          this.$message.error('驳回失败，请重试')
        }
      }
    },
    imageUpLoaded(url) {
      console.log('url: ', url)
    },
    // update data
    async updateData(data = {}) {
      this.isApplying = true

      try {
        const result = await this.$axios.post(
          '/poc/api/v1/kabin/apply/apply',
          data
        )

        if (result.data.success) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }

        this.isApplying = false
      } catch (error) {
        this.isApplying = false
        this.$message.error('保存失败，请重试')
      }
    }
  }
}
</script>

<style lang="less">
.text-grey {
  color: #909399;
}
.apply-detail {
  height: fit-content;
  .actions,
  .steps,
  .details {
    padding: 2rem;
    margin-bottom: 18px;
    background-color: #fff;
  }

  .actions {
    display: flex;
    justify-content: center;
    background: transparent;
  }

  .steps {
    overflow-x: auto;
    .el-step__icon {
      width: 50px;
      height: 50px;
    }
    .el-step.is-horizontal .el-step__line {
      top: 25px;
    }
    .step-image {
      width: 100%;
      line-height: 0;
    }
  }

  .details {
    padding-top: 0;
    min-height: 400px;
    .el-tabs__item {
      height: auto;
      padding: 10px 20px;
    }
    .detail {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .detail-left,
      .detail-middle,
      .detail-right {
        flex: 1;
      }
      .detail-middle {
        margin: 0 20px;
      }
      .detail-item {
        display: flex;
        align-items: center;
        font-size: 1rem;
        margin: 10px 0;
        .label {
          display: inline-block;
          width: 100px;
          margin-right: 10px;
          text-align: left;
          color: #909399;
        }
        .text {
          flex: 1;
          display: flex;
          color: #303133;
        }
        .detail-image {
          margin-right: 10px;
          width: 90px;
          height: 90px;
        }
      }
    }
  }
}
</style>
