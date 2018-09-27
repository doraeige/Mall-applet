// pages/detail/detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {}
  },

  getProduct(id) {
    wx.showLoading({
      title: '商品数据加载中',
    })
    qcloud.request({
      url: config.service.productDetail + id,
      success: response => {
        // 加载成功后关闭loading标识
        wx.hideLoading()

        // 获取数据失败，返回上一个页面
        if(!response.data.code){
          this.setData({
            product: response.data.data
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: err => {
        wx.hideLoading()
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    });
  },

  buy() {
    wx.showLoading({
      title: '商品购买中',
    })
    let product = Object.assign({
      count: 1
    }, this.data.product)
    
    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: [product]
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          wx.showToast({
            title: '商品购买成功',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '商品购买失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '商品购买失败',
        })
      }
    })
  },

  addToTrolley(){
    wx.showLoading({
      title: '添加到购物车中',
    })

    qcloud.request({
      url: config.service.addTrolley,
      login: true,
      method: 'PUT',
      data: this.data.product,
      success: result => {
        wx.hideLoading()

        if (!result.data.code) {
          wx.showToast({
            title: '已添加到购物车',
          })
        } else {
          wx.showToast({
            title: '添加到购物车失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading

        wx.showToast({
          title: '添加到购物车失败',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProduct(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})