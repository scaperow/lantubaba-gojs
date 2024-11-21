// import Parse from "parse";
import planes from "../predefine/planes";

const state = () => {
  return {
    user: null,
    orderObjects: [],
    orderList: [],
  };
};

// getters
const getters = {
  user: (state, getters) => {
    return state.user;
  },
  services: (state, getters) => {
    return state.serviceList;
  },
  orders: (state) => state.orderList,
  plane: (state) => {
    if (state.user) {
      return planes[state.user.plane] || planes.planeA;
    }

    return planes.planeA;
  },
};

// actions
const actions = {
  async getUser({ state, commit }) {
    var user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      commit("SET_USER", user);
    }

    return user;
  },
  async logout({ commit }) {
    // await Parse.User.logOut()
    commit("SET_USER", null);
  },
  async getOrder({ commit }) {
    // var orders = await new Parse.Query(OrderClass).equalTo('status', 'success').find()
    // commit('SET_ORDERS', orders)
  },
};

// mutations
const mutations = {
  SET_USER(state, user) {
    state.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  },
  UPDATE_AVATAR(state, avatar) {
    state.user = { ...state.user, avatar };
    localStorage.setItem("user", JSON.stringify(user));
  },
  SET_ORDERS(state, orders) {
    state.orderObjects = orders;
    state.orderList = _.map(orders, (o) => o.toJSON());
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
