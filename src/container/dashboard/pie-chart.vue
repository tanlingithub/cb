<!--
 * @Description: In User Settings Edit
 * @Author: nemo
 * @Date: 2019-08-12 11:03:27
 * @LastEditTime: 2019-08-14 14:09:07
 * @LastEditors: Please set LastEditors
 -->

<template>
  <div class="pie-chart">
    <v-pie
      :data="chartData"
      :settings="chartSettings"
      :extend="extendEcharts"
      height="252px"
      width="100%"
    ></v-pie>
  </div>
</template>
<script>
import 'v-charts/lib/style.css'
import 'echarts/lib/component/title'
export default {
  name: 'pie-chart',
  components: {
    'v-pie': () => import('v-charts/lib/pie.common')
  },
  props: {
    title: String,
    data: {
      type: Array,
      default: () => [
        {
          name: 'T恤',
          icon: 'rect'
        },
        {
          name: '裤子',
          icon: 'rect'
        },
        {
          name: '帽子',
          icon: 'rect'
        },
        {
          name: '衬衣',
          icon: 'rect'
        },
        {
          name: '包',
          icon: 'rect'
        },
        {
          name: '鞋',
          icon: 'rect'
        }
      ]
    },
    rows: {
      type: Array,
      default: () => [
        {key: 'T恤', value: 9},
        {key: '裤子', value: 8},
        {key: '帽子', value: 7},
        {key: '衬衣', value: 6},
        {key: '包', value: 4},
        {key: '鞋', value: 3}
      ]
    }
  },
  data() {
    this.chartSettings = {
      dataType: 'percent'
    }

    this.extendEcharts = {
      title: {
        text: this.title,
        top: 10,
        left: 10
      },
      legend: {
        right: '30%',
        top: 50,
        itemWidth: 20,
        itemHeight: 10,
        orient: 'right',
        data: this.data
      },
      series: {
        type: 'pie',
        // hoverAnimation: false,
        radius: ['50%', '70%'],
        center: ['25%', '50%'],
        label: {
          position: 'inside',
          verticalAlign: 'bottom',
          align: 'right',
          formatter: ''
        },
        center: ['35%', '50%'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: ￥{c} ({d}%)'
        }
      }
    }
    return {
      chartData: {
        columns: ['key', 'value'],
        rows: this.rows
      }
    }
  }
}
</script>
