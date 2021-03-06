/**
 * 获取APP信息
 * @author barret
 * @date 2019/05/02
 */
import {getAppConfig} from '@/service/dapi'

export const state = () => ({
  logo: require('../assets/img/logo.png'),
  copyright: '滴普科技 版权所有',
  appName: '卡宾 POC',
  htmlTitle: '',
  favicon: '',
  homePageImg: ''
})

export const mutations = {
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k]
    })
  }
}

export const actions = {
  // 配置的元信息
  async fetchMetaInfo({commit}) {
    try {
      const res = await getAppConfig()
      const dataList = res.payload || []
      commit('update', dataList)

      return dataList
    } catch (err) {
      return err
    }
  }
}
