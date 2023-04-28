const jwt = require('jsonwebtoken')

const findMembers = function (instance, {
  prefix,
  specifiedType,
  filter
}) {
  function _find(instance) {
    if (instance.__proto__ === null) return []

    let keys = Reflect.ownKeys(instance)
    keys = keys.filter((key) => {
      return _shouldKeep(key)
    })

    return [...keys, ..._find(instance.__proto__)]
  }

  function _shouldKeep(key) {
    if (filter && filter(key)) return true
    if (prefix)
      if (key.startsWith(prefix))
        return true
    if (specifiedType)
      if (instance[key] instanceof specifiedType)
        return true
  }

  return _find(instance)
}

const generateToken = function (uid, scope) {
  const secretKey = global.config.security.secretKey
  const expiresIn = global.config.security.expiresIn
  const token = jwt.sign({
    uid,
    scope
  }, secretKey, {
    expiresIn
  })
  return token
}

module.exports = {
  findMembers,
  generateToken
}
