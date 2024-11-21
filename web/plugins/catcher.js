
import Vue from 'vue'
import Parse from 'parse'
import store from '~/store/'

const parseErrorCode = function (code) {
  switch (code) {
    case 200:
      return '未知错误'

    case 100:
      return '无法连接到 API 服务器, 请刷新页面重试'

    case 101:
      return '对象不存在'

    case 119:
      return '无权执行该操作'

    case 124:
      return '请求超时, 请重试'

    case 129:
      return '文件过大, 请重试'

    case 142:
      return '验证失败, 请检查输入的内容'

    case 153:
      return '文件删除失败'

    case 206:
      return '请登录'

    case 209:
      return '请重新登录'

    default:
      return '发生错误, 请稍后再试'
  }
}

class ErrorHandler {
  loginUrl = '/login'
  denyUrl = '/403'
  missingUrl = '/404'

  constructor({ handleDirect, handleNotify, handleError, handleWaring, handleBlock, handleConfirm }) {
    this.handleDirect = handleDirect
    this.handleNotify = handleNotify
    this.handleError = handleError
    this.handleWaring = handleWaring
    this.handleBlock = handleBlock
    this.handleConfirm = handleConfirm
  }

  direct(url) {
    this.handleDirect && this.handleDirect(url)
  }

  notify(message) {
    this.handleNotify && this.handleNotify(message)
  }

  error(message) {
    this.handleError && this.handleError(message)
  }

  warning(message) {
    this.handleWarning && this.handleWarning(message)
  }

  block(message) {
    this.handleBlock && this.handleBlock(message)
  }

  confirm(message) {
    this.handleConfirm && this.handleConfirm(message)
  }

  /**
   * 拦截错误
   * @param {*} error
   * @param {String} message 200 status message
   * @returns {Boolean} isStop
   */
  catch(error, message, errorHandler) {
    console.error(error)

    if (error instanceof Parse.Error) {
      return this.catchServerError(error, message, errorHandler)
    } else {
      return this.catchClientError(error, errorHandler)
    }
  }

  /**
   * 拦截浏览器错误
   * @param {*} error 
   * @returns {Boolean} isStop
   */
  catchClientError(error, errorHandler) {
    var message = '发生未知错误, 请稍后再试'
    var isHandler = false

    if (errorHandler instanceof Function) {
      isHandler = !errorHandler(message)
    }

    !isHandler && this.error(message)
    return true
  }

  /**
   * 拦截服务端 API的错误
   * @param {*} error
   * @returns {Boolean} isStop
   */
  catchServerError({ code, message }, unknowMessage, errorHandler) {
    var isHandler = false
    message = parseErrorCode(code)

    if (errorHandler instanceof Function) {
      isHandler = !errorHandler(message)
    }

    if (!isHandler) {
      switch (code) {
        case 100:
          this.block(message)
          break

        case 206:
          this.notify('请登录')
          this.direct(`/login?redirect=back`)

          isStop = true
          break;


        case 209:
          this.notify('长时间没有操作，请重新登录')
          this.direct(`/login?redirect=back`)

          isStop = true
          break;

        default:
          this.error('未知错误')
      }
    }

    return true
  }
}




export default ({ app }) => {
  const errorHandler = new ErrorHandler({
    handleDirect(url) {
      //router.push(url)
      app.router.push(url)
    },
    handleError(message) {
      Vue.prototype.$overlay.message.error(message)
    },
    handleNotify(message) {
      Vue.prototype.$overlay.notify.info(message)
    },
    handleWarning(message) {
      // ElementUI.Message({
      //   type: 'warning',
      //   message
      // })
      Vue.prototype.$overlay.message.error(message)
    },
    handleBlock(message) {
      Vue.prototype.$overlay.warning({
        text: message,
        color: 'white',
        dark: false,
        title: '错误',
        icon: 'mdi-alert-circle',
        actions: {
          true: {
            color: 'primary',
            text: '好的'
          }
        }
      })
      // store.dispatch('message/showOverlay', {
      //   isShow: true,
      //   overlayText: message
      // })
    }
  })

  Vue.prototype.$catch = function (error, message) {
    errorHandler.catch(error, message)
  }
}

