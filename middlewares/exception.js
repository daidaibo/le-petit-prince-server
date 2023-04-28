const { HttpException } = require('@root/core/http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const isHttpException = error instanceof HttpException
    const isDev = global.config.environment === 'dev'

    if (isDev && !isHttpException) {
      throw error
    }

    if (isHttpException) {
      ctx.body = {
        message: error.message,
        error_code: error.errcode,
        request_url: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    } else {
      ctx.body = {
        message: 'Internal Sever Error',
        error_code: 999,
        request_url: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError
