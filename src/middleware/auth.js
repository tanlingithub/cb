/**
 * Created by levy on 2018/7/10.
 */

export default async function({store, app}) {
  // if (process.server) return
  const user = JSON.parse(localStorage.getItem('user'))

  if (user) {
    const list = [
      {
        name: '运营数据',
        icon: 'el-icon-setting',
        url: '/dashboard'
      },
      {
        name: '渠道管理',
        icon: 'el-icon-edit',
        url: '/applyList',
        children: []
      }
    ]

    if (user.role === 'jxs') {
      list[1].children.push({
        name: '开店申请',
        url: '/apply'
      })
    } else {
      list[1].children.push({
        name: '渠道列表',
        url: '/applyList'
      })
    }

    store.commit('setUserInfo', user)
    store.commit('setMenuList', list)
  }
}
