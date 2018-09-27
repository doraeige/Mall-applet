//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

let userInfo
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
  },

  data: {
    locationAuthType: UNPROMPTED
  },

  login({ success, error }) {
    wx.getSetting({
      success: res => {
        // 返回用户授权结果 key 为 scope 值，value 为 Bool 值
        if (res.authSetting['scope.userInfo'] === false) {
          this.setData({
            locationAuthType: UNAUTHORIZED
          })
          // 已拒绝授权
          wx.showToast({
            title: '提示',
            content: '请授权我们的获取您的用户信息',
            showCancel: false
          })
        } else {
          this.data.locationAuthType = AUTHORIZED
          this.doQcloudLogin({ success, error })
        }
      },
      fail: () => {
        error && error()
      }
    })
  },

  doQcloudLogin({ success, error }) {
    // 调用 qcloud 登陆接口
    // qcloud.setLoginUrl(config.service.loginUrl)
    qcloud.login({
      success: result => {
        // console.log('登录成功', result)
        if (result) {
          let userInfo = result
          success && success({
            userInfo
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          this.getUserInfo({ success, error })
        }
      },
      fail: err => {
        error && error()
      }
    })
  },

  // 非第一次登陆的情况下，再调用获取个人信息的功能。
  getUserInfo({ success, error }) {
    if (userInfo) return userInfo

    qcloud.request({
      url: config.service.user,
      login: true,
      success: res => {
        // console.log(res)
        if (!res.data.code) {
          let userInfo = res.data.data
          success && success({
            userInfo
          })
        } else {
          error && error()
        }
      },
      fail: () => {
        error && error()
      }
    });
  },

  // 检查会话是否过期
  checkSession({ success, error }) {
    if (userInfo) {
      return success && success({
        userInfo
      })
    }

    wx.checkSession({
      success: () => {
        //session_key 未过期，并且在本生命周期一直有效
        this.getUserInfo({
          success: res => {
            userInfo = res.userInfo

            success && success({
              userInfo
            })
          }
        })
      },
      fail: () => {
        // session_key 已经失效，需要重新执行登录流程
        error && error()
      }
    })
  }
})