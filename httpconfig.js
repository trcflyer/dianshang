/**
 * 小程序网络请求配置文件
 * post : 6010
 */
var host = "https://naru.net.cn:6010/ssh_eshop_mysql"
var httpconfig = {
  // host
  hostUri: `${host}`,
  
  // 获取用户openID
  getOpenIdServlet: `${host}/GetOpenIdServlet.servlet`,

  // 首页顶部swiper
  topImagesPathListServlet: `${host}/TopImagesPathListServlet.servlet`,

  // 首页顶部tab栏
  categoryListServlet: `${host}/CategoryListServlet.servlet`,

  // 首页产品列表
  productListByCategoryServlet: `${host}/ProductListByCategoryServlet.servlet`,

  // 产品详情页数据
  productDetailByProductIdService: `${host}/ProductDetailByProductIdServlet.servlet`,

  // 添加购物车
  saveCarProductServlet: `${host}/SaveCarProductServlet.servlet`,

  // 获取用户的购物车产品数据
  getCarProductServlet: `${host}/GetCarProductServlet.servlet`,

  // 获取用户地址数据
  getUserByUserIdServlet: `${host}/GetUserByUserIdServlet.servlet`,

  // 保存用户地址数据
  updateUserInformationServlet: `${host}/UpdateUserInformationServlet.servlet`,

  //获取历史订单数据
  getIndentHistoryServlet: `${host}/GetIndentHistoryServlet.servlet`,

  //下单
  buyProductServlet: `${host}/BuyProductServlet.servlet`,

  //我的订单界面继续支付
  buyIndentServlet: `${host}/BuyIndentServlet.servlet`,

  //意见反馈
  saveFeedBackServlet: `${host}/SaveFeedBackServlet.servlet`,

  //商品收藏和取消收藏
  collectServlet: `${host}/CollectServlet.servlet`,

  //获取用户某一商品的收藏状态
  isCollectServlet: `${host}/IsCollectServlet.servlet`,

  //获取用户收藏的商品列表
  getUserCollectServlet: `${host}/GetUserCollectServlet.servlet`,

  //获取积分的商品列表
  getGiftsServlet: `${host}/GetGiftsServlet.servlet`,

  //积分兑换
  giftsServlet: `${host}/GiftsServlet.servlet`,

  //物流信息
  getCarrieInfoServlet: `${host}/GetCarrieInfoServlet.servlet`,
  
  //物流信息
  shareServlet: `${host}/ShareServlet.servlet`,
};

module.exports = httpconfig