import Vuedl from 'vuedl/src/index'
import DialogLayout from './components/DialogLayout.vue'
import Confirm from './components/Confirm.vue'
import Toast from './components/Toast.vue'
import Alert from './components/Alert.vue'
import SnackbarLayout from './components/SnackbarLayout.vue'
import Prompt from './components/Prompt.vue'
import DialogActions from './components/DialogActions.vue'
import DialogCard from './components/DialogCard.vue'
import Overlay from './components/Overlay.vue'
import NotificationLayout from 'vuedl/src/components/NotificationLayout.vue'
import Vue from 'vue'

export default (({ app }) => {
  var options = {}
  if (!options.context) {
    options.context = {
      vuetify: app.vuetify
    }
  }
  if (!options.property) {
    options.property = '$overlay'
  }

  if (!options.container) {
    options.container = '[data-app=true]'
  }

  const property = options.property || '$overlay'
  const actionsFn = options.actions || (() => {
    return {
      false: '取消',
      true: {
        text: '确定',
        color: 'primary'
      }
    }
  })
  
  Vue.use(Vuedl, options)

  const manager = Vue.prototype[property]
  manager.layout('default', DialogLayout)
  manager.layout('snackbar', SnackbarLayout)
  manager.layout('notification', NotificationLayout)
  manager.overlay('default', Overlay)

  Vue.component('DialogActions', DialogActions)
  Vue.component('DialogCard', DialogCard)
  manager.component('confirm', Confirm, {
    waitForResult: true,
    actions: actionsFn,
    ...options.confirm
  })

  manager.component('warning', Confirm, {
    type: 'warning',
    waitForResult: true,
    actions: actionsFn,
    ...options.warning
  })

  manager.component('error', Confirm, {
    type: 'error',
    waitForResult: true,
    actions: ['关闭'],
    icon:'mdi-close-circle',
    dark:true,
    ...options.error
  })

  manager.component('toast', Toast, {
    waitForResult: true,
    ...options.toast
  })

  manager.message = {
    info: (message, options) => manager.toast({ text: message, color: 'info', icon: 'mdi-information', ...options }),
    error: (message, options) => manager.toast({ text: message, color: 'error', icon: 'mdi-close-circle', ...options }),
    success: (message, options) => manager.toast({ text: message, color: 'success', icon: 'mdi-check-circle', ...options }),
    warning: (message, options) => manager.toast({ text: message, color: 'warning', icon: 'mdi-alert-circle', ...options })
  }

  manager.component('notification', Alert, {
    waitForResult: true,
    ...options.notification
  })

  manager.notify = {
    info: (message, options) => manager.notification({ text: message, color: 'info', ...options }),
    error: (message, options) => manager.notification({ text: message, color: 'error', ...options }),
    success: (message, options) => manager.notification({ text: message, color: 'success', ...options }),
    warning: (message, options) => manager.notification({ text: message, color: 'warning', ...options })
  }

  manager.component('prompt', Prompt, {
    waitForResult: true,
    actions: actionsFn,
    ...options.prompt
  })
})