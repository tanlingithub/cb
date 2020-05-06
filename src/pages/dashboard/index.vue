<!--
 * @Description: In User Settings Edit
 * @Author: nemo
 * @Date: 2019-08-12 10:38:43
 * @LastEditTime: 2019-08-15 19:37:39
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="dashboard-index">
    <el-row class="area-box" type="flex" justify="space-between" :gutter="24">
      <el-col :span="16" class="area-chart">
        <sub-container>
          <histogram-chart :options="headOptions" v-loading="areaLoading"></histogram-chart>
        </sub-container>
      </el-col>
      <el-col :span="8">
        <sub-container title="商圈" class="area-tabs" style="height:272px;">
          <div class="area-tbas-box">
            <div
              v-for="(area, index) in chartAreas"
              :key="area.value"
              class="area-tbas-item"
              :style="{
                color: COLOR_MAP[index],
                'font-size': parseInt(Math.random() * 8 + 12) + 'px'
              }"
              @click="fetchAreaMap"
            >{{ area.label }}</div>
          </div>
        </sub-container>
      </el-col>
    </el-row>

    <div class="map-box">
      <div class="simulate-tabs">
        <div class="simulate-tabs-box">
          <b
            v-for="(tab, index) in tabsList"
            :key="tab.value"
            @click="tabsClick(index)"
            :class="[
              'simulate-tabs-item',
              index == brandType && 'active-tabs active-primary'
            ]"
          >{{ tab.label }}</b>
        </div>

        <div id="map-container" v-loading="areaLoading"></div>
      </div>
    </div>

    <div class="shop-charts-box">
      <sub-container style="marginTop:20px;">
        <tabs-date-header v-model="timeInfo" @tab-click="simulateAsync" @date-click="formateChart"></tabs-date-header>
        <el-row
          class="tabs-container"
          type="flex"
          justify="space-between"
          :gutter="24"
          style="paddingTop:20px;"
        >
          <el-col :span="17">
            <histogram-chart :options="salesOptions" v-loading="sumiLoading"></histogram-chart>
          </el-col>
          <el-col :span="6" style="paddingTop:15px;">
            <h3 class="shop-rank-title">门店销售量排名</h3>
            <rank-list
              :rankList="rankList"
              ref="rankLsit"
              v-if="rankCount"
              v-loading="sumiLoading"
            />
          </el-col>
        </el-row>
      </sub-container>

      <el-row class="sales-rank-pie" type="flex" justify="space-between" :gutter="24">
        <el-col :span="12">
          <sub-container class="pie-box" v-loading="sumiLoading">
            <pie-chart title="销售量类别占比" />
            <div class="position-sub-center">
              <p class="label">销售量</p>
              <ICountUp
                :endVal="122212"
                class="count-num"
                :options="{prefix: '￥'}"
                v-if="chartCount"
              />
            </div>
            <sales-list :salesList="salesList" :swtich="legendCount" class="postion-sales-list" />
          </sub-container>
        </el-col>
        <el-col :span="12">
          <sub-container class="pie-box" v-loading="sumiLoading">
            <pie-chart title="退货量类别占比" />
            <div class="position-sub-center">
              <p class="label">退货量</p>
              <ICountUp
                :endVal="9998"
                class="count-num"
                :options="{prefix: '￥'}"
                v-if="chartCount"
              />
            </div>
            <sales-list :salesList="salesList" :swtich="legendCount" class="postion-sales-list" />
          </sub-container>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.2.1/echarts.min.js"></script>
<script src="https://avuejs.com/cdn/echarts-wordcloud.min.js"></script>
<script>
const RankList = {
  name: 'rank-list',
  props: {
    rankList: {
      type: Array,
      required: true
    }
  },
  render(h) {
    return (
      <div class="shop-rank-list">
        {this.rankList.map((shop, index) => {
          const data = {
            start: 0,
            decimals: 0,
            duration: 10,
            endVal: shop.num
          }
          return (
            <div class="shop-rank-item">
              <span class="rank-index">
                <i class={index < 3 ? 'top-three' : ''}>{index + 1}</i>
              </span>
              <span class="rank-name">{shop.name}</span>
              <ICountUp {...{props: data}} />
            </div>
          )
        })}
      </div>
    )
  }
}

const SalesList = {
  name: 'sales-list',
  props: {
    salesList: {
      type: Array,
      required: true
    },
    swtich: {
      type: Boolean,
      default: true
    }
  },
  render(h) {
    const {salesList, swtich} = this
    return (
      <div class="sales-list">
        {salesList.map(sale => {
          const data = {
            start: 0,
            decimals: 0,
            duration: 10,
            endVal: sale.num,
            options: {prefix: '￥'}
          }
          return (
            <p class="sales-item">
              <span class="sales-percent">{sale.percent}%</span>
              {swtich && <ICountUp class="sales-num" {...{props: data}} />}
            </p>
          )
        })}
      </div>
    )
  }
}

const COLOR_MAP = {
  0: '#409EFF',
  1: '#E6A23C',
  2: '#67C23A',
  3: '#909399'
}

const MAP_KEYS = {
  0: 'kabing',
  1: 'taipingniao',
  2: 'jack',
  3: 'all'
}

const DATE_UNIT = {
  0: '时',
  1: '', // 下面直接显示日期,
  2: '', // 同理上
  3: '月'
}

const FUNCTIONALNAME_MAP = {
  0: 'setTodayDate',
  1: 'setWeekDate',
  2: 'setMonthDate',
  3: 'setYearDate'
}

const HEAD_OPTIONS = (keys, datas) => ({
  title: {
    text: '地区分布'
  },
  color: '#5793f3',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  grid: {
    right: '20%'
  },
  toolbox: {
    feature: {
      dataView: {show: true, readOnly: false},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      data: keys
    }
  ],
  yAxis: {
    show: false
  },
  series: [
    {
      name: '蒸发量',
      type: 'bar',
      data: datas
    }
  ]
})

const TITILE_MAP = {
  0: '销售量趋势',
  1: '退货量趋势',
  2: '订货量趋势'
}

const SALES_OPTIONS = (keys = [], data = [], type = 0) => ({
  color: ['#5793f3', '#67C23A', '#F56C6C'],
  title: {
    text: TITILE_MAP[type]
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    right: 60,
    data: [
      {
        name: '环比',
        icon: 'rect'
      },
      {
        name: '同比',
        icon: 'rect'
      }
    ]
  },
  xAxis: [
    {
      type: 'category',
      data: keys,
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '环比',
      show: false
    },
    {
      type: 'value',
      name: '同比',
      show: false
    }
  ],
  series: [
    {
      name: '销售量',
      type: 'bar',
      data: data[0]
    },
    {
      name: '环比',
      type: 'line',
      yAxisIndex: 1,
      data: data[1]
    },
    {
      name: '同比',
      type: 'line',
      yAxisIndex: 1,
      data: data[2]
    }
  ]
})

const COUNT_KEYS = ['rankCount', 'chartCount', 'legendCount']

const getTimes = time => dayjs(time).valueOf()

const getRandom = (space, min) => parseInt(min + space * Math.random(), 10)

import ICountUp from 'vue-countup-v2'
import dayjs from 'dayjs'
import {mapMutations} from 'vuex'

const MOCK_AMPAREAE = 'http://39.100.141.76:3000/mock/109/operation/areaAndMap'

export default {
  name: 'dashboard-index',
  components: {
    'histogram-chart': () => import('@/container/dashboard/histogram-chart'),
    'tabs-date-header': () => import('@/container/dashboard/tabs-date-header'),
    'pie-chart': () => import('@/container/dashboard/pie-chart'),
    'sub-container': () => import('@/container/dashboard/sub-container'),
    'rank-list': RankList,
    'sales-list': SalesList,
    ICountUp
  },
  data() {
    return {
      activeName: '0',
      type: 0,
      brandType: 0,
      timeInfo: {},
      rankCount: false,
      chartCount: false,
      legendCount: false,
      positionInfo: {},
      areaLoading: false,
      sumiLoading: false,
      map: {},
      salesChart: [],
      headOptions: {},
      salesOptions: {},
      rankList: [
        {
          name: '广州天河城一号店',
          num: 9998
        },
        {
          name: '广州天河城一号店',
          num: 6666
        },
        {
          name: '广州太古汇店',
          num: 2888
        },
        {
          name: '广州正价广场店',
          num: 1234
        }
      ],
      salesList: [
        {
          percent: 36,
          num: 99982
        },
        {
          percent: 20,
          num: 21121
        },
        {
          percent: 18,
          num: 12331
        },
        {
          percent: 8,
          num: 8843
        },
        {
          percent: 6,
          num: 998
        },
        {
          percent: 3,
          num: 228
        }
      ],
      tabsList: [
        {
          label: '卡宾',
          value: '0'
        },
        {
          label: '太平鸟',
          value: '1'
        },
        {
          label: '杰克琼斯',
          value: '2'
        },
        {
          label: '全选',
          value: '3'
        }
      ],
      chartAreas: [
        {
          label: '天河商圈',
          value: '1'
        },
        {
          label: '广州东商圈',
          value: '2'
        },
        {
          label: '东山商圈',
          value: '3'
        },
        {
          label: '番禺祈福商圈',
          value: '4'
        }
      ]
    }
  },
  created() {
    this.COLOR_MAP = COLOR_MAP
  },
  async mounted() {
    this.setUserInfo({
      username: 'admin',
      nickName: '管理员',
      password: 'abcd1234',
      role: 'admin'
    })

    await this.$nextTick()
    // 默认定位
    this.addMarker()
    this.formateChart({type: 0})
    this.fetchAreaMap()

    window.addEventListener('scroll', e => {
      const scrolltop =
        document.documentElement.scrollTop || document.body.scrollTop
      // console.log(scrolltop, 'scrolltop')
      // 300  560  600
      if (scrolltop < 300) {
        this.allCtrolCount()
      }
      if (scrolltop >= 300 && scrolltop < 560) {
        this.rankCount = true
        this.chartCount = false
        this.legendCount = false
      }
      if (scrolltop >= 560 && scrolltop < 600) {
        this.legendCount = true
        this.rankCount = true
        this.chartCount = false
      }
      if (scrolltop >= 600) {
        this.allCtrolCount(true)
      }
    })
  },
  // destroyed() {
  //   window.removeEventListener('scroll')
  // },
  methods: {
    ...mapMutations(['setUserInfo']),
    formateChart(params) {
      const nowtimes = new Date()
      const nowFormate = dayjs(nowtimes).format('YYYY-MM-DD')
      const {type = 0, times = [nowFormate, nowFormate]} = params
      const [start, end] = times

      const onday = 24 * 60 * 60 * 1000

      const dayLength = parseInt((getTimes(end) - getTimes(start)) / onday, 10)

      const datas = this[FUNCTIONALNAME_MAP[type]]({
        nowtimes,
        start,
        dayLength
      })
      const arrMap = (arr, key) => arr.map(item => key && item[key])
      const keys = arrMap(datas, 'key')
      const data1 = arrMap(datas, 'value')
      const data2 = datas.map(
        item => item.value - parseInt(Math.random() * 10, 10)
      )
      const data3 = datas.map(
        item => item.value - parseInt(Math.random() * 20, 10)
      )
      this.salesOptions = SALES_OPTIONS(keys, [data1, data2, data3], this.type)
      // this.simulateAsync()
    },
    allCtrolCount(flag = false) {
      COUNT_KEYS.forEach(key => {
        this[key] = flag
      })
    },
    async fetchAreaMap(params) {
      try {
        this.areaLoading = true
        const {payload, msg, code} = await this.$axios.$get(MOCK_AMPAREAE)
        const keys = payload.area.map(item => item.key)
        const datas = payload.area.map(item => item.value)
        this.headOptions = HEAD_OPTIONS(keys, datas)
        this.positionInfo = payload.map
        this.addMarker()
      } catch (err) {
        this.$message.error(err)
      } finally {
        setTimeout(() => {
          this.areaLoading = false
        }, 300)
      }
    },
    simulateAsync(type) {
      this.sumiLoading = true
      this.type = type
      this.formateChart({type: 0})
      // this.allCtrolCount()
      setTimeout(() => {
        this.sumiLoading = false
        // this.allCtrolCount(true)
      }, 300)
    },
    tabsClick(type) {
      this.brandType = type
      this.addMarker(type)
    },
    initMap() {
      this.map = new AMap.Map('map-container', {
        resizeEnable: true,
        center: [113.327147, 23.147585],
        zoom: 15
      })
    },
    setTodayDate({nowtimes}) {
      const curHour = dayjs(nowtimes).hour()
      return new Array(curHour).fill('').reduce((cur, next, index) => {
        cur.push({
          key: [index, '时'].join(' '),
          value: getRandom(50, 10)
        })
        return cur
      }, [])
    },
    setWeekDate({nowtimes}) {
      const curWeek = dayjs(nowtimes).day()
      return new Array(curWeek).fill('').reduce((cur, next, index) => {
        cur.push({
          key: ['周', index + 1].join(' '),
          value: getRandom(200, 40)
        })
        return cur
      }, [])
    },
    setMonthDate({start, dayLength}) {
      return new Array(dayLength).fill('').reduce((cur, next, index) => {
        cur.push({
          key: dayjs(start)
            .add(index, 'day')
            .format('YYYY-MM-DD'),
          value: getRandom(100, 20)
        })
        return cur
      }, [])
    },
    setYearDate({nowtimes}) {
      const curMonth = dayjs(nowtimes).month() + 1
      return new Array(curMonth).fill('').reduce((cur, next, index) => {
        cur.push({
          key: [index + 1, '月份'].join(' '),
          value: getRandom(2000, 500)
        })
        return cur
      }, [])
    },
    addMarker(type = 0) {
      // 存在一些问题 暂时先写死数据
      const positionInfo = {
        kabing: {
          icon:
            'https://bucket-cdn-dev.oss-cn-shenzhen.aliyuncs.com/poc/kabin/kabing.png',
          pointData: [
            [113.327147, 23.147585],
            [113.335086, 23.144349],
            [113.319465, 23.14652],
            [113.324744, 23.141469]
          ]
        },
        taipingniao: {
          icon:
            'https://bucket-cdn-dev.oss-cn-shenzhen.aliyuncs.com/poc/kabin/taipingniao.png',
          pointData: [
            [113.324743, 23.142021],
            [113.326869, 23.143879],
            [113.321048, 23.140009]
          ]
        },
        jack: {
          icon:
            'https://bucket-cdn-dev.oss-cn-shenzhen.aliyuncs.com/poc/kabin/jack.png',
          pointData: [
            [113.324744, 23.148021],
            [113.323829, 23.143876],
            [113.321053, 23.140009]
          ]
        }
      }

      const {initMap, addPositionImg} = this

      // 重置map
      initMap()
      if (type == 3) {
        Object.keys(positionInfo).forEach(key => {
          addPositionImg(key, positionInfo)
        })
      } else {
        addPositionImg(MAP_KEYS[type], positionInfo)
      }
    },
    addPositionImg(key, info) {
      info[key].pointData.forEach(ps => {
        const icon = new AMap.Icon({
          size: new AMap.Size(80, 20),
          image: info[key].icon,
          imageSize: new AMap.Size(80, 20)
        })

        const marker = new AMap.Marker({
          size: new AMap.Size(40, 50),
          icon,
          position: ps,
          offset: new AMap.Pixel(-13, -30),
          imageSize: new AMap.Size(40, 50)
        })

        marker.setMap(this.map)

        AMap.event.addListener(marker, 'click', () => {
          this.openInfo(marker.getPosition())
        })
      })
    },
    openInfo(position) {
      //构建信息窗体中显示的内容
      var info = []
      info.push('<div style="padding:7px 0px 0px 0px;"><h4>高德软件</h4>')
      let infoWindow = new AMap.InfoWindow({
        content: info.join(''),
        offset: new AMap.Pixel(16, -50)
      })

      infoWindow.open(this.map, position)
    }
  }
}
</script>

<style lang="less">
.dashboard-index {
  .area-box {
    .area-tabs {
      &-title {
        font-size: 20px;
      }
      .area-tbas-box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .area-tbas-item {
          margin-top: 8px;
          text-align: center;
          line-height: 66px;
          height: 66px;
          display: block;
          width: 48%;
          font-size: 22px;
          border-radius: 6px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
  .map-box {
    /deep/.simulate-tabs {
      margin-top: 20px;
      padding: 12px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      background-color: #fff;
      &-box {
        font-size: 16px;
        display: flex;
        height: 50px;
        line-height: 50px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ccc;
        .simulate-tabs-item {
          text-align: center;
          flex: 1;
          cursor: pointer;
        }
        .active-tabs {
          border-top: 2px solid #409eff;
        }
        .active-primary {
          color: #409eff;
        }
      }
    }
    #map-container {
      width: 100%;
      height: 400px;
    }
    .tabs-container {
    }
  }
  .shop-rank-list {
    padding: 20px 0;
    position: relative;
    .shop-rank-item {
      display: flex;
      padding: 5px 0;
      > span {
        display: block;
      }
      .rank-index {
        width: 10%;
        text-align: left;
        > i {
          display: block;
          background: #ccc;
          color: black;
          width: 20px;
          border-radius: 100%;
          text-align: center;
          text-decoration: none;
        }
        .top-three {
          background: #666;
          color: white;
        }
      }
      .rank-name {
        width: 60%;
        padding: 0 10px;
      }
    }
  }
  .sales-rank-pie {
    margin-top: 20px;
    .pie-box {
      position: relative;
      .position-sub-center {
        // top: '35%', '55%'
        position: absolute;
        top: 50%;
        left: 35%;
        text-align: center;
        transform: translate(-50%, -50%);
        .label {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.427450980392157);
        }
        .count-num {
          font-weight: bold;
          font-size: 20px;
        }
      }
      .postion-sales-list {
        position: absolute;
        right: 10%;
        top: 61px;
        .sales-item {
          display: flex;
          height: 22px;
          width: 120px;
          > span {
            flex: 1;
          }
          .sales-percent {
            color: rgba(0, 0, 0, 0.427450980392157);
          }
        }
      }
    }
  }
}
</style>
