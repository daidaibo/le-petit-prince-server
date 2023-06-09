const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
  static initCore(app) {
    InitManager.app = app
    InitManager.loadConfig()
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
  }

  static loadConfig() {
    const configPath = `${process.cwd()}/config/config`
    const config = require(configPath)
    global.config = config
  }

  static initLoadRouters() {
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }

  static loadHttpException() {
    const errors = require('./http-exception')
    global.errs = errors
  }
}

module.exports = InitManager
