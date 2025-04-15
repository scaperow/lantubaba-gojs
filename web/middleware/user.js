import _ from 'lodash'
import parse from 'parse'
export default function ({ store, redirect, route }) {
  // If the user is not authenticated

  //console.log(store)
  return new Promise(async (resolve, reject) => {
    var user = await store.dispatch('user/getUser')

    if (user) {
      resolve()
    } else {
      redirect(`/login?message=请先登录&redirect=${route.fullPath}`)
      resolve()
    }
  })
}