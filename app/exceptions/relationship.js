const { ParameterException } = require('@root/core/http-exception')

class CoupleException extends ParameterException {
  constructor() {
    super()
    this.message = '你们已经是情侣啦'
    this.errcode = 20001
  }
}

class LoveTriangleException extends ParameterException {
  constructor() {
    super()
    this.message = '有人脚踏两只船哦'
    this.errcode = 20002
  }
}

class SingleException extends ParameterException {
  constructor() {
    super()
    this.message = '加油啊你还未脱单'
    this.errcode = 20003
  }
}

module.exports = {
  CoupleException,
  LoveTriangleException,
  SingleException
}
