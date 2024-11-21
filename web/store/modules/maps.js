import _ from "lodash";
// import Http from '~/api/common'

const MapsClass = Parse.Object.extend("maps");
// const Maps = Http.create('works')

const mapCategory = [
  {
    category: 1,
    label: "流程图",
    icon: "iconfont icon-liuchengtu",
    color: ["#1565c0", "#0d47a1"],
  },
  {
    label: "思维导图",
    category: 2,
    icon: "iconfont icon-siweidaotu",
    color: ["#EF6C00", "#E65100"],
  },
  {
    label: "实体图",
    category: 3,
    icon: "iconfont icon-shititu",
    color: ["#2E7D32", "#1B5E20"],
  },
];

const state = () => ({
  list: [...mapCategory],
});

const actions = {
  async update({ commit, state }, object) {
    var model = _.find(state.objects, { id: object.id || object.objectId });
    var index = _.indexOf(state.objects, model);

    if (model) {
      // var newly = await Maps.update(model, object)
      // state.objects.splice(index, 1, newly)
      // commit('SET_LIST', state.objects)
    }
  },

  // async getList({ commit, state }) {
  //   var list = [];

  //   if (_.isEmpty(state.list)) {
  //     list = await new Parse.Query(MapsClass).equalTo("disabled", false).find();

  //     commit("SET_LIST", list);
  //   }

  //   return list;
  // },
};

// mutations
const mutations = {
  SET_LIST(state, list) {
    state.objects = list;
    state.list = _.map(list, (item) => item.toJSON());
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
