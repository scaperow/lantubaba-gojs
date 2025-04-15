
import Parse from 'parse'
import planes from '../predefine/planes'

const OrderClass = Parse.Object.extend('order')

const state = () => {
  return {
    object: null,
    user: null,
    orderObjects: [],
    orderList: []
  }
}

// getters
const getters = {
  object: (state, getters) => {
    return state.object
  },
  user: (state, getters) => {
    return state.user
  },
  services: (state, getters) => {
    return state.serviceList
  },
  orders: (state) => state.orderList,
  plane: (state) => {
    if (state.user) {
      return planes[state.user.plane] || planes.planeA
    }

    return planes.planeA
  }
}

// actions
const actions = {
  updateAvatar({ state, commit }, avatar) {
    commit('UPDATE_AVATAR', avatar)
  },
  setUser({ state, commit }, user) {
    commit('SET_USER', user)
  },
  async getUser({ state, commit }) {
    var user = state.object

    if (!user) {
      user = await Parse.User.current()

      if (user) {
        commit('SET_USER', user)
      }
    }

    return user
  },
  async logout({ commit }) {
    await Parse.User.logOut()
    commit('SET_USER', null)
  },
  async getOrder({ commit }) {
    var orders = await new Parse.Query(OrderClass).equalTo('status', 'success').find()
    commit('SET_ORDERS', orders)
  }
}

// mutations
const mutations = {
  SET_USER(state, user) {
    state.object = user

    if (user) {
      state.user = user.toJSON()
    } else {
      state.user = null
    }
  },
  UPDATE_AVATAR(state, avatar) {
    state.user = { ...state.user, avatar }
  },
  SET_ORDERS(state, orders) {
    state.orderObjects = orders
    state.orderList = _.map(orders, o => o.toJSON())
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}