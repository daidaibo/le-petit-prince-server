const util = require('util')
const axios = require('axios')

const { User } = require('@models/user')
const { Auth } = require('@root/middlewares/auth')
const { generateToken } = require('@root/core/util')

class WXManager {
  static async codeToToken(code) {
    const url = util.format(
      global.config.wx.loginUrl,
      global.config.wx.appId,
      global.config.wx.appSecret,
      code
    )
    const result = await axios.get(url)
    if (result.status !== 200) {
      throw new global.errs.AuthFailed('openid 获取失败')
    }
    const errcode = result.data.errcode
    const errmsg = result.data.errmsg
    if (errcode) {
      throw new global.errs.AuthFailed('openid 获取失败: ' + errmsg)
    }

    let user = await User.getUserByOpenid(result.data.openid)
    if (!user) {
      user = await User.registerByOpenid(result.data.openid)
    }
    return token = generateToken(user.id, Auth.USER)
  }
}

module.exports = {
  WXManager
}
