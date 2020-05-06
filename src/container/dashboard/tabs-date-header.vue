<!--
 * @Description: In User Settings Edit
 * @Author: nemo
 * @Date: 2019-08-12 10:43:18
 * @LastEditTime: 2019-08-14 15:58:35
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="tabs-header-date">
    <ul class="tabs-header-left">
      <li
        v-for="(item, index) in tabsList"
        :key="item.value"
        :class="curTypeIndex == index && 'active-tabs'"
        @click="tabsClick(index)"
      >
        {{ item.label }}
      </li>
    </ul>
    <div class="tabs-header-right">
      <ul class="date-tabs">
        <li
          class="date-tabs-item"
          v-for="(date, index) in dateList"
          :key="date.value"
          :class="curDateIndex == index && 'active-date'"
          @click="dateClick(index, date.value)"
        >
          {{ date.label }}
        </li>
      </ul>
      <el-date-picker
        v-model="timeSpace"
        range-separator="至"
        format="yyyy 年 MM 月 dd 日"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  name: 'dashboard-tabs-header',
  components: {},
  props: {
    tabsList: {
      type: Array,
      default: () => [
        {
          label: '销售量',
          value: 'marketing'
        },
        {
          label: '退货量',
          value: 'returnSales'
        },
        {
          label: '订货量',
          value: 'orders'
        }
      ]
    }
  },
  data() {
    return {
      timeSpace: [],
      curTypeIndex: 0,
      curDateIndex: 0,
      dateList: [
        {
          label: '今日',
          value: 'today'
        },
        {
          label: '本周',
          value: 'week'
        },
        {
          label: '本月',
          value: 'month'
        },
        {
          label: '本年',
          value: 'year'
        }
      ]
    }
  },
  watch: {},
  async mounted() {
    await this.$nextTick()
    this.setTimeSpace('today')
  },
  methods: {
    tabsClick(index) {
      this.curTypeIndex = index
      this.$emit('tab-click', index)
    },
    dateClick(index, prop) {
      this.curDateIndex = index
      this.setTimeSpace(prop)
      this.$emit('date-click', {type: index, prop, times: this.timeSpace})
    },
    setTimeSpace(prop) {
      const nowTimes = new Date().getTime()
      const nowTime = dayjs(nowTimes).format('YYYY-MM-DD')
      const onday = 24 * 60 * 60 * 1000
      switch (prop) {
        case 'today':
          this.timeSpace = [nowTime, nowTime]
          break
        case 'week':
          const week = dayjs().day()
          const start = nowTimes - week * onday
          const startTime = dayjs(start).format('YYYY-MM-DD')
          this.timeSpace = [startTime, nowTime]
          break
        case 'month':
          const curMonth = dayjs(nowTimes).format('YYYY-MM')
          const startMonth = curMonth.concat('-01')
          this.timeSpace = [startMonth, nowTime]
          break
        case 'year':
          const curYear = dayjs(nowTimes).year()
          const startYear = [curYear, '01', '01'].join('-')
          this.timeSpace = [startYear, nowTime]
          break
      }
      this.$emit('input', {type: this.curTypeIndex, time: this.timeSpace})
    }
  }
}
</script>
<style lang="less">
@mainColor: #409eff;
.tabs-header-date {
  height: 45px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
  .active-tabs {
    color: @mainColor;
    border-bottom: 2px solid @mainColor;
  }
  .active-date {
    color: @mainColor;
  }
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  display: flex;
  justify-content: space-between;
  justify-items: center;

  .tabs-header-left {
    width: 22%;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    font-size: 15px;
    > li {
      cursor: pointer;
    }
  }
  .tabs-header-right {
    line-height: 40px;
    width: 60%;
    display: flex;
    justify-content: space-between;
    .date-tabs {
      width: 40%;
      display: flex;
      justify-content: space-between;
      &-item {
        cursor: pointer;
      }
    }
  }
}
</style>
