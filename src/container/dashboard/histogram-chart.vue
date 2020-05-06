<!--
 * @Description: In User Settings Edit
 * @Author: nemo
 * @Date: 2019-08-12 10:42:46
 * @LastEditTime: 2019-08-14 20:18:56
 * @LastEditors: Please set LastEditors
 -->

<template>
  <div class="histogram-chart" ref="echartContainer" style="height:252px;">
    <!-- <v-histogram
      :data="chartData"
      height="252px"
      :extend="extendEcharts"
      :settings="lineShow ? chartSettings : {}"
    ></v-histogram>-->
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'histogram-chart',
  // components: {
  //   'v-histogram': () => import('v-charts/lib/histogram.common')
  // },
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  watch: {
    options: {
      handler: function(val) {
        this.init()
      },
      deep: true
    }
  },
  data() {
    return {
      contanst: null,
      option: {}
    }
  },
  async mounted() {
    await this.$nextTick()
    this.init()
  },
  methods: {
    resize() {
      this.contanst.resize()
    },
    init() {
      this.contanst = echarts.init(this.$refs['echartContainer'])
      this.contanst.setOption(this.options)
      window.onresize = this.resize
    }
  }
}
</script>
