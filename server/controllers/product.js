// 将utils/db.js 代码中的功能导入作为 DB
const DB = require('../utils/db.js')

// 将这个内容打包导出，供外界函数调用
// 对象{名字：函数的名称，对应的值：函数的功能}
// DB.query 执行了数据库的 SQL 查询，从商品表中获取了所有的内容，然后这里将这些数据，保存到了 ctx.state.data 中
// Ctx 是小程序的中间件，我们将获取的数据「暂存」到这个 data 变量中，以便服务器稍后返回给用户
module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM product;")
  },
  // 获取 API 中的商品编号;
  // + 号将 id 这个字符变量，转化为了一个整型变量
  detail: async ctx => {
    productID = + ctx.params.id

    // 如果传入API链接的商品编号不正确,并不是一个数,而是其余的字符,需要进行异常处理
    // ctx.state.data = await DB.query("SELECT * FROM product where product.id =?", [productID]) 是一个数组，有且仅有一个，直接获取里面的对象
    if (!isNaN(productID)){
      ctx.state.data = (await DB.query("SELECT * FROM product where product.id =?", [productID]))[0]
    } else {
      ctx.state.data = {}
    }
  }
}