const Router = require('koa-router')
const multer = require('@koa/multer')
// let adminRouter = require('./routers/admin')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd()}/static/images`)
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    let filename = file.originalname.split('.')
    const type = filename.pop()
    cb(null, `${decodeURI(filename.join(''))}-${Date.now().toString(16)}.${type}`)
  }
})
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

const router = new Router({
  prefix: '/test'
})

router.get('/', async (ctx) => {
  const path = ctx.params
  const query = ctx.request.query
  const header = ctx.request.header
  const body = ctx.request.body
  ctx.body = {
    path,
    query,
    header,
    body
  }
})

router.get('/admin.html', async (ctx) => {
  /* app route controller service view */
  await ctx.render('admin.pug', {
    title: '私奔到森林'
  })
})

router.post('/login', (ctx) => {
  console.log(ctx.cookies.get('uid'))
  console.log(ctx.request.body.username, ctx.request.body.password)
  ctx.cookies.set('sessionId', 'Bearer', {
    maxAge: 2 * 60 * 60 * 1000,
    overwrite: false,
    httpOnly: true
  })
  ctx.redirect('/test/admin.html')
})

router.all('/upload/single', upload.single('image'), (ctx) => {
  // koa-body co-body + formidable
  // koa-bodyparser + @koa/multer multer <- busboy async-busboy
  ctx.body = {
    image: ctx.file,
    text: ctx.request.body.text
  }
})

router.all('/upload/multiple', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 2 }
]), (ctx) => {
  ctx.body = {
    text: ctx.request.body.text,
    ...ctx.files
  }
})

module.exports = router
/* module.exports = (app) => {
  app.use(adminRouter.routes())
  app.use(router.routes())
} */
