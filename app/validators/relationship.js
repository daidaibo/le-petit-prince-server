const { LinValidator, Rule } = require('@root/core/lin-validator')

class RelationshipValidator extends LinValidator {
  constructor() {
    super()
    this.inviter = [
      new Rule('isLength', '邀请者不能为空', {
        min: 1
      })
    ]
    this.invitee = [
      new Rule('isLength', '被邀请者不能为空', {
        min: 1
      })
    ]
  }

  async validateInvite(vals) {
    const inviter = vals.body.inviter
    const invitee = vals.body.invitee
    if (inviter && (inviter === invitee)) {
      throw new Error('不能自己邀请自己')
    }
  }
}

module.exports = {
  RelationshipValidator
}
