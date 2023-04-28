const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
  constructor(level) {
    Auth.ADMIN = 16
    Auth.SUPER_ADMIN = 32
    this.level = level || Auth.USER
  }

  get m() {
    return async (ctx, next) => {
      const userToken = basicAuth(ctx.req)
      let errMsg = 'Token 不合法'

      if (!userToken || !userToken.name) {
        throw new global.errs.Forbbiden(errMsg)
      }

      let auth
      try {
        auth = jwt.verify(userToken.name, global.config.security.secretKey)
      } catch (error) {
        if (error.name == 'TokenExpiredError') {
          errMsg = 'Token 已过期'
        }
        throw new global.errs.Forbbiden(errMsg)
      }

      if (auth.scope < this.level) {
        errMsg = '权限不足'
        throw new global.errs.Forbbiden(errMsg)
      }

      ctx.auth = {
        uid: auth.uid,
        scope: auth.scope
      }

      await next()
    }
  }

  static verify(token) {
    try {
      jwt.verify(token, global.config.security.secretKey)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = {
  Auth
}
