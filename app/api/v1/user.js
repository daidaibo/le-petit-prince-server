const Router = require('koa-router')
const { success } = require('@app/lib/helper')
const { LoginType } = require('@app/lib/enum')
const { WXManager } = require('@app/services/wx')
const { User } = require('@models/user')
const { Auth } = require('@root/middlewares/auth')
const { NotEmptyValidator } = require('@validators/common')
const {
  LoginValidator,
  RegisterValidator
} = require('@validators/user')

const router = new Router({
  prefix: '/v1/user'
})

router.post('/register', async (ctx) => {
  const v = await new RegisterValidator().validate(ctx)

  const user = {
    email: v.get('body.email'),
    nickname: v.get('body.nickname'),
    password: v.get('body.password2')
  }

  await User.create(user)
  success()
})

router.post('/login', async (ctx) => {
  const v = await new LoginValidator().validate(ctx)
  let token
  switch (v.get('body.type')) {
    case LoginType.USER_EMAIL:
      token = await User.emailLogin(v.get('body.account'), v.get('body.secret'))
      break
    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeToToken(v.get('body.account'))
      break
    case LoginType.USER_MOBILE:
      break
    case LoginType.ADMIN_LOGIN:
      break
    default:
      throw new global.errs.ParameterException('没有相应的处理函数')
  }
  ctx.body = {
    token
  }
})

router.post('/verify', async (ctx) => {
  const v = await new NotEmptyValidator().validate(ctx)
  const result = Auth.verify(v.get('body.token'))
  ctx.body = {
    is_valid: result
  }
})

module.exports = router
