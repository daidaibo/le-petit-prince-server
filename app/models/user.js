const bcrypt = require('bcryptjs')
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('@root/core/db')
const { Auth } = require('@root/middlewares/auth')
const { generateToken } = require('@root/core/util')

class User extends Model {
  static async emailLogin(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (!user) {
      throw new global.errs.AuthFailed('账号不存在')
    }
    const correct = bcrypt.compareSync(plainPassword, user.password)
    if (!correct) {
      throw new global.errs.AuthFailed('密码错误')
    }
    return token = generateToken(user.id, Auth.USER)
  }

  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid
      }
    })
    return user
  }

  static async registerByOpenid(openid) {
    return await User.create({
      openid
    })
  }
}

User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nickname: Sequelize.STRING(64),
  email: {
    type: Sequelize.STRING(128),
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    set(val) {
      const salt = bcrypt.genSaltSync(10)
      const pwd = bcrypt.hashSync(val, salt)
      this.setDataValue('password', pwd)
    }
  },
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  }
}, {
  sequelize,
  tableName: 'user'
})

module.exports = {
  User
}
