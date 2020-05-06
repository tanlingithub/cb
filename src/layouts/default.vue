<template>
  <el-container style="background: #f0f2f5;">
    <el-menu
      :collapse="collapse"
      class="aside-menu"
      :default-active="$route.path"
      router
      background-color="#282828"
      text-color="hsla(0,0%,100%,.67)"
    >
      <div class="logo">
        <img class="logo-img" :src="$store.state.meta.logo" alt="logo" />
      </div>
      <menu-item class="menu-list" :menuList="menuList"></menu-item>
      <el-button class="collapse-btn" @click="collapse = !collapse">
        <i class="el-icon-sort"></i>
      </el-button>
    </el-menu>

    <el-container>
      <el-header>
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          style="margin-top: 2px;"
        >
          <el-col>
            <bread-crumb></bread-crumb>
          </el-col>
          <el-col style="text-align: right">
            <el-dropdown @command="handleDropdown">
              <span class="el-dropdown-link">
                <img class="avatar-png" :src="imgUrl" alt />
                {{ $store.state.user.nickName }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>

      <el-main class="nuxt-main">
        <nuxt></nuxt>
      </el-main>

      <el-footer>
        <copyright></copyright>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import Copyright from '@/components/Copyright.vue'
import MenuItem from '@/components/MenuItem.vue'
import BreadCrumb from '@/components/bread-crumb.vue'
import {mapState} from 'vuex'
import auth from '@/mixins/auth'

export default {
  name: 'default-layout',
  mixins: [auth],
  components: {
    Copyright,
    MenuItem,
    BreadCrumb
  },
  data() {
    return {
      collapse: false
    }
  },
  methods: {
    handleDropdown(action) {
      this.$store.commit(action)
    }
  },
  computed: {
    ...mapState(['permission', 'menuList', 'breadCrumbList']),
    imgUrl() {
      const avatarMap = {
        admin: require('../assets/img/admin.png'),
        dq: require('../assets/img/dq.png'),
        kj: require('../assets/img/kj.png'),
        zb: require('../assets/img/zb.png'),
        jxs: require('../assets/img/jxs.png')
      }
      let role = ''
      if (JSON.parse(localStorage.getItem('user'))) {
        role = JSON.parse(localStorage.getItem('user')).role
      }
      return avatarMap['jxs']
    }
  }
}
</script>

<style lang="less">
#__nuxt {
  .el-icon-sort {
    transform: rotate(-90deg);
  }
  .avatar-png {
    margin-right: 10px;
    width: 30px;
    height: 30px;
  }
  // aside-menu
  .logo {
    position: relative;
    height: 60px;
    background: #333;
    display: flex;
    justify-content: center;
    align-items: center;

    .logo-img {
      width: 95px;
      vertical-align: middle;
    }

    .logo-text {
      color: #fff;
      display: inline-block;
      vertical-align: middle;
      font-size: 20px;
      margin: 0 0 0 12px;
      font-weight: 400;
      opacity: 1;
    }
  }

  // 折叠
  .aside-menu.el-menu--collapse {
    /* width: 80px; */
    min-width: 64px;

    .logo-text {
      opacity: 0;
    }

    .el-tooltip {
      margin-left: 4px;

      [class*='icon'] {
        font-size: 16px;
        margin: 0;
      }
    }

    // 有子菜单
    .el-submenu__title {
      margin-left: 4px;

      .sub-menu-title,
      .el-submenu__icon-arrow {
        display: none;
      }

      [class*='icon'] {
        font-size: 16px;
        margin: 0;
      }
    }
  }

  // 子菜单
  .el-menu--vertical {
    .el-menu-item,
    .el-submenu__title {
      height: @menuHeight;
      line-height: @menuHeight;
    }

    .iconfont {
      display: none;
    }
  }

  // 未折叠
  .aside-menu:not(.el-menu--collapse) {
    min-width: 206px;
    // max-width: @min-width;

    [class*='icon'] {
      font-size: 14px;
      margin-right: 5px;
    }
  }

  @menuBg: #1c3b64;
  @submenuBg: #000c17;
  @mainColor: #1890ff;
  // antd menu 高度
  @menuHeight: 50px;

  .aside-menu {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    border-right: none;
    font-weight: 300;
    .menu-list {
      flex: 1;
    }

    .collapse-btn {
      padding: 18px 0;
      outline: none;
      border: 0;
      color: #fff;
      background-color: #333;
    }
    /* transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); */
    /* transition-duration: .3s; */
    .el-submenu__title {
      height: @menuHeight;
      line-height: @menuHeight;
      // background: @menuBg !important;
    }

    .el-submenu {
      margin: 8px 0;

      &.is-active {
        margin-bottom: 8px;
      }
    }

    .el-menu-item {
      height: @menuHeight;
      line-height: @menuHeight;
      margin: 1rem 0;

      &:hover {
        color: #fff !important;
        border-right: 4px solid #6483f1;
        opacity: 0.8;
      }

      &.is-active {
        color: #fff;
        border-right: 4px solid #6483f1;
        opacity: 0.8;
      }
    }
  }

  // header
  .el-header {
    padding: 10px 20px;
    /* height: 60px !important; */
    box-shadow: 6px 1px 4px rgba(0, 21, 41, 0.08);
    background: #fff;
    z-index: 100;
  }

  // main
  .nuxt-main {
    margin: 12px;
    padding: 1rem;
    border-radius: 8px;
    // background: #fff;
  }

  // dropdown
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    display: flex;
    align-items: center;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>
