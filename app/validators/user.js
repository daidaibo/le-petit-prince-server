const { LinValidator, Rule } = require('@root/core/lin-validator')
const { LoginType } = require('@app/lib/enum')
const { User } = require('@models/user')

class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.nickname = [
      new Rule('isLength', '昵称 4-8 个字符', {
        min: 4,
        max: 8
      })
    ]
    this.email = [
      new Rule('isEmail', '邮箱不符合规范')
    ]
    this.password1 = [
      new Rule('isLength', '密码 6-10 个字符', {
        min: 6,
        max: 10
      }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ]
  }

  validatePassword(vals) {
    const pwd1 = vals.body.password1
    const pwd2 = vals.body.password2
    if (pwd1 !== pwd2) {
      throw new Error('密码不一致')
    }
  }

  async validateEmail(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (user) {
      throw new Error('邮箱已存在')
    }
  }
}

class LoginValidator extends LinValidator {
  constructor() {
    super()
    this.account = [
      new Rule('isLength', '账号 4-32 个字符', {
        min: 4,
        max: 32
      })
    ]
    this.secret = [
      new Rule('isOptional'),
      new Rule('isLength', '至少 6 个字符', {
        min: 6,
        max: 128
      })
    ]
  }

  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error('loginType 是必须参数')
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error('loginType 参数不合法')
    }
  }
}

module.exports = {
  RegisterValidator,
  LoginValidator
}
