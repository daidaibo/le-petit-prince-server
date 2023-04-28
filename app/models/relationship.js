const { Sequelize, Model, Op } = require('sequelize')
const { sequelize } = require('@root/core/db')
const {
  CoupleException,
  LoveTriangleException,
  SingleException
} = require('@exceptions/relationship')

class Relationship extends Model {
  static async together({ inviter, invitee }) {
    const couple = await Relationship.findOne({
      where: {
        [Op.or]: [
          { inviter: inviter, invitee: invitee },
          { inviter: invitee, invitee: inviter }
        ]
      },
      paranoid: false
    })
    if (couple && !couple.isSoftDeleted()) {
      throw new CoupleException() /* 你们已经是情侣啦 */
    }

    const relationship = await Relationship.findAll({
      where: {
        [Op.or]: [
          {
            inviter: {
              [Op.in]: [inviter, invitee]
            }
          },
          {
            invitee: {
              [Op.in]: [inviter, invitee]
            }
          }
        ]
      },
      // group: ['inviter'],
      // attributes: ['inviter', [Sequelize.fn('COUNT', '*'), 'count']]
    })
    if (relationship.length > 1) {
      throw new LoveTriangleException() /* 有人脚踏两只船哦 */
    }

    if (couple) {
      await couple.restore()
    } else {
      await Relationship.create({
        inviter,
        invitee
      })
    }
  }

  static async break(uid) {
    const couple = await Relationship.findOne({
      where: {
        [Op.or]: [
          { inviter: uid },
          { invitee: uid }
        ]
      }
    })
    if (!couple) {
      throw new SingleException() /* 加油啊你还未脱单 */
    }
    await couple.destroy({
      force: false,
    })
  }
}

Relationship.init({
  inviter: Sequelize.INTEGER,
  invitee: Sequelize.INTEGER
}, {
  sequelize,
  tableName: 'relationship'
})

module.exports = {
  Relationship
}
