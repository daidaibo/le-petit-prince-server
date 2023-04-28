class HttpException extends Error {
  constructor(message = 'Internal Sever Error', errcode = 999, code = 500) {
    super()
    this.code = code
    this.message = message
    this.errcode = errcode
  }
}

class Success extends HttpException {
  constructor(message, errcode) {
    super()
    this.code = 201
    this.message = message || 'Created'
    this.errcode = errcode || 0
  }
}

class ParameterException extends HttpException {
  constructor(message, errcode) {
    super()
    this.code = 400
    this.message = message || 'Bad Request'
    this.errcode = errcode || 10000
  }
}

class AuthFailed extends HttpException {
  constructor(message, errcode) {
    super()
    this.code = 401
    this.message = message || 'Unauthorized'
    this.errcode = errcode || 10001
  }
}

class Forbbiden extends HttpException {
  constructor(message, errcode) {
    super()
    this.code = 403
    this.message = message || 'Forbidden'
    this.errcode = errcode || 10003
  }
}

class NotFound extends HttpException {
  constructor(message, errcode) {
    super()
    this.code = 404
    this.message = message || 'Not Found'
    this.errcode = errcode || 10004
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbbiden
}
