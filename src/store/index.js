import cookie from 'js-cookie'
import cookieKeys from '@/const/cookie-keys'
import {userInfoApi, mockServer} from '@/const/api'

import {loginByUsername} from '@/service/xpaas-enterprise-contact'

import {formatData} from '@/utils/breadcrumb'
import {commonList} from '@/const/api'

const cookiePath = process.env.COOKIE_PATH

const BASE_PAGE = [
  {
    name: '运营数据',
    url: '/dashboard'
  },
  {
    name: '开店申请',
    url: '/apply'
  },
  {
    name: '渠道列表',
    url: '/applyList'
  }
]

export const state = () => ({
  userId: '',
  token: '',
  tenantId: '',
  username: '',
  user: {},
  menuList: BASE_PAGE,
  permission: {},
  segmentInfo: [],
  cardData: [],
  couponData: [],
  routePath: '/',
  breadCrumbList: [],
  routerTree: null
})

export const mutations = {
  setUserInfo(state, userInfo) {
    state.user = userInfo
  },
  setMenuList(state, list) {
    state.menuList = list
  },
  login(state, payload) {
    cookieKeys.forEach(key => {
      state[key] = payload[key]
      cookie.set(key, payload[key], {
        path: cookiePath
      })
    })
  },
  logout(state) {
    state.user = {}
    localStorage.removeItem('user')
    this.$router.replace('/login')
  },
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k]
    })
  },
  addSegment(state, data) {
    state.segmentInfo.push(data)
  },
  initSegment(state, data) {
    state.segmentInfo = data
  },
  updateSegment(state, data) {
    state.segmentInfo.map(item => {
      if (item.segementID == data.segementID) {
        Object.keys(data).forEach(k => {
          item[k] = data[k]
        })
      }
    })
  },
  addCardData(state, data) {
    state.cardData.push.apply(state.cardData, data)
  },
  updateCardData(state, data) {
    state.cardData.map(item => {
      if (item.cardID == data.cardID) {
        Object.keys(data).forEach(k => {
          item[k] = data[k]
        })
      }
    })
  },
  changeCardState(state, ids) {
    state.cardData.map(item => {
      if (ids.indexOf(item.cardID) > -1) {
        item.cardState = '付印'
      }
    })
  },
  addcouponData(state, data) {
    state.couponData.push(data)
  },
  updateCouponData(state, data) {
    state.couponData.map(item => {
      if (item.couponID == data.couponID) {
        Object.keys(data).forEach(k => {
          item[k] = data[k]
        })
      }
    })
  }
}

export const actions = {
  async fetchUserAndMenuList({commit, dispatch}, {userId}) {
    let user = await this.$axios.$get(`${userInfoApi}?id=${userId}`)

    commit('update', {user: user.payload || {}})

    let menuResources = await this.$axios.$get(
      `${mockServer}/security/api/v1/users/${userId}/menuResources`
    )
    if (!menuResources.payload)
      menuResources.payload = {
        menu: [],
        permission: {}
      }

    commit('update', {
      menuList: menuResources.payload.menu,
      permission: menuResources.payload.permission
    })

    dispatch('updateBreadcrumd', menuResources.payload.menu)
  },
  // 用户名账号登录
  async loginByUsername({commit, dispatch}, userInfo) {
    try {
      // const res = await loginByUsername(userInfo)
      const res = await this.$axios.$post(`/poc/api/v1/kabin/login`, userInfo)

      const data = res.payload

      commit('login', data)

      // commit('update', {user: data})
      // dispatch('permission/fetchThirdId', {tenantId: data.tenantId}
      dispatch('fetchUserAndMenuList', {userId: data.userId})
      return data
    } catch (err) {
      return err
    }
  },
  updateBreadcrumd({commit, route, state}) {
    if (state.routePath === '/' || state.routePath === '/login') {
      return
    }

    const item = BASE_PAGE.find(i => i.url === state.routePath)

    if (!item) {
      return
    }

    commit('update', {
      breadCrumbList: [item]
    })
  },
  getSegmentList({commit}, data) {
    this.$axios.get(`${commonList}?collection=segments`).then(res => {
      commit('initSegment', res.data.payload || [])
    })
  }
}
