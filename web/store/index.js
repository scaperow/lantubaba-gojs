import Vuex from "vuex";
import user from "./modules/user";
import go from "./modules/go";
import style from "./modules/style";
import maps from "./modules/maps";
import works from "./modules/works";
import history from "./modules/history";
import shape from "./modules/shape";
import icon from "./modules/icon";
import system from "./modules/system";
import square from "./modules/square";

export default {
  strict: false,
  modules: {
    user,
    go,
    style,
    maps,
    works,
    history,
    shape,
    icon,
    system,
    square,
  },
  actions: {
    async nuxtClientInit({ commit, dispatch }, { req }) {
      await dispatch("user/getUser", { root: true });
      // await dispatch("system/getSummary", { root: true });
      // const autho = localStorage.getItem('auth._token.local') //or whatever yours is called
      // commit('SET_AUTHO', autho)
      // console.log('From nuxtClientInit - ' + autho)
    },
  },
};
