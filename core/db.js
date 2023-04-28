const { Sequelize, Model } = require('sequelize')
const { unset, clone, isArray } = require('lodash')
const {
  dbName,
  host,
  port,
  user,
  password
} = require('@root/config/config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true,
  timezone: '+08:00',
  define: {
    charset: 'utf8mb4',
    timestamps: true, // create_time update_time
    paranoid: true, // 软删除 delete_time
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    freezeTableName: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at']
        }
      }
    }
  }
})

sequelize.sync({
  force: false
})

/* 序列化 */
Model.prototype.toJSON = function () {
  let data = clone(this.dataValues)
  // unset(data, 'updated_at')
  // unset(data, 'created_at')
  // unset(data, 'deleted_at')

  for (key in data) {
    if (key === 'image') {
      if (!data[key].startsWith('http'))
        data[key] = global.config.host + data[key]
    }
  }

  if (isArray(this.exclude)) {
    this.exclude.forEach(
      (value) => {
        unset(data, value)
      }
    )
  }

  return data
}

module.exports = {
  sequelize
}
