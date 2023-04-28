function success(message, errcode) {
  throw new global.errs.Success(message, errcode)
}

module.exports = {
  success
}
