// pages/home/home.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [], // 商品列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("进入 onLoad 状态，开始准备抓取产品列表")
    this.getProductList()
    // console.log(this.data)
  },

  // 将商品读取的功能封装到getProductList函数中
  getProductList(){
    wx.showLoading({
      title: '商品数据加载中',
    })
    qcloud.request({
      url: config.service.productList,
      // 当我们请求发送成功时
      success: response => {
        // 加载成功后关闭loading标识
        wx.hideLoading()

        // 返回的 response.data.code 作为是否成功下载的依据
        // 为零,则成功下载了数据;如果为-1,则下载有问题 判断条件 为零还是不为零
        // 加载失败时的 data.code 是在 server/middlewares/response.js 文件中的第26行定义的
        if (!response.data.code){
          this.setData({
            // console.log(response.data)
            productList: response.data.data
          })
        } else {
          wx.showToast({
            title: '商品数据加载失败',
          })
        }
      },

      // 当我们请求发送失败时，使用 wx.showToast 来弹出一个下载失败的提示
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '商品数据加载失败',
        })
      }
    });
  },

  addToTrolley(event) {
    let productId = event.currentTarget.dataset.id
    let productList = this.data.productList
    let product

    for (let i = 0, len = productList.length; i < len; i++) {
      if (productList[i].id === productId) {
        product = productList[i]
        break
      }
    }

    if (product) {
      qcloud.request({
        url: config.service.addTrolley,
        login: true,
        method: 'PUT',
        data: product,
        success: result => {
          // console.log(result)
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
          wx.showToast({
            title: '添加到购物车失败',
          })
        }
      })
    }
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