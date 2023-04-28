const Router = require('koa-router')
const { success } = require('@app/lib/helper')
const { Relationship } = require('@models/relationship')
const { Auth } = require('@root/middlewares/auth')
const {
  RelationshipValidator
} = require('@validators/relationship')

const router = new Router({
  prefix: '/v1/relationship'
})

router.post('/together', new Auth().m, async (ctx) => {
  const v = await new RelationshipValidator().validate(ctx)

  const couple = {
    inviter: v.get('body.inviter'),
    invitee: v.get('body.invitee')
  }

  await Relationship.together(couple)
  success()
})

router.post('/break', new Auth().m, async (ctx) => {
  const uid = ctx.auth.uid
  await Relationship.break(uid)
  success()
})

module.exports = router
