require('module-alias/register')

const Koa = require('koa')
const views = require('koa-views')
const static = require('koa-static')
const parser = require('koa-bodyparser')

const path = require('path')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')

const app = new Koa()

app.use(catchError) /* AOP 面向切面编程 */
app.use(parser())
app.use(static(path.join(__dirname, './static')))
app.use(views(path.join(__dirname, './app/views')), {
  map: {
    html: 'pug'
  }
})

// const router = require('./router')
// router(app)
InitManager.initCore(app)

app.listen(3000)
