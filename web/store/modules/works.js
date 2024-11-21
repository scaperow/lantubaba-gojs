// import Parse from "parse";
// import Http from '~/api/common'
import _, {
  last,
  find,
  indexOf,
  chain,
  map,
  get,
  toUpper,
  camelCase,
  each,
  pull,
  pullAllWith,
  toNumber,
} from "lodash";

// import go from "gojs";

// const FavoriteClass = Parse.Object.extend('favorite')
// const WorksClass = Parse.Object.extend('works')
// const Works = Http.create('works')

// const http = axios.create("maps");

const allowedCurrentOn = ["mine", "favorite", "recycle"];

const asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const state = () => ({
  // folderId: null,
  // list: [],
  // objects: [],
  // count: 0,
  // searchObjects: [],
  // searchList: [],
  // folderObjects: [],
  // folderList: [],
  // folder: null,
  // privates: 0,
  // publics: 0,
  searchIndex: 0,
  searchCount: 20,
  searchList: [],
  currentOn: "mine",
  files: {}, // {['works/recycle']}
  folders: {},
  mine: {
    maps: [],
    folders: [],
    index: -1,
    size: 20,
    folder: [],
    total: 0,
    loading: false,
  },
  recycle: {
    maps: [],
    folders: [],
    index: -1,
    size: 20,
    folder: [],
    total: 0,
    loading: false,
  },
  favorite: {
    maps: [],
    folders: [],
    index: -1,
    size: 20,
    folder: [],
    total: 0,
    loading: false,
  },
});

const processList = function (objectList) {
  return (
    chain(objectList)
      .map((item) => item.toJSON())
      // .orderBy(['updatedAt'], ['desc'])
      .map((item) => {
        item.isShare =
          get(item, "isPrivate") !== true &&
          get(item, "share.isShare") === true;
        return item;
      })
      .value()
  );
};

// getters
const getters = {
  // mineList: (state) => state.mineList,
  // shareList: (state) => state.shareList,
  // shareList: (state) => state.shareList
  // list: (state) => state.list,
  folders: (state) => {
    return state[state.currentOn].folders;
  },
  currentFolder: (state) => {
    return last(state[state.currentOn].folder) || { id: 0 };
  },
  maps: (state) => {
    return state[state.currentOn].maps;
  },
  total: (state) => {
    return state[state.currentOn].total;
  },
  size: (state) => {
    return state[state.currentOn].size;
  },
  index: (state) => {
    return state[state.currentOn].index;
  },
  currentView: (state) => {
    return state[state.currentOn];
  },
};

const actions = {
  async fetchMaps({ state }, { reset } = {}) {
    const folderId = getters.currentFolder(state).id;
    console.log(getters.currentFolder(state).id);
    const index = reset ? 0 : getters.currentView.index + 1;
    const { data: list } = await this.$axios.get(`/maps`, {
      params: {
        parentId: getters.currentFolder.id,
        mode: state.currentOn,
        index,
        size: getters.currentView(state).size,
      },
    });

    mutations.SET_MAPS(state, list, index);
  },
  async fetchFolders({ getters, state }) {
    const { data: folders } = await this.$axios.get(`/folders`, {
      params: {
        parentId: getters.currentFolder.id,
      },
    });
    mutations.SET_FOLDERS(state, folders);
  },
  async getMineList(
    { commit, state, dispatch },
    { folderId = null, index = 0, size = 20 } = {}
  ) {
    // var user = await dispatch("user/getUser", null, { root: true });
    // folderId =
    //   folderId ||
    //   state.folderId ||
    //   localStorage.folderId ||
    //   (state.folderList.length > 0 && state.folderList[0].objectId);
    // if (folderId) {
    // var { count, results } = await new Parse.Query(WorksClass)
    //   .notEqualTo('isDelete', true)
    //   .notEqualTo('isFolder', true)
    //   .equalTo('parentId', folderId)
    //   .include('style')
    //   .include('share')
    //   .equalTo('user', user)
    //   .limit(size)
    //   .skip(index * size)
    //   .withCount()
    //   .find()
    // if (index === 0) {
    //   commit('SET_LIST', { count, results, folderId })
    // } else {
    //   commit('SET_LIST', { count, results: [...state.objects, ...results], folderId })
    // }
    // }
  },
  async getRecycleList({ commit, dispatch }, { index = 0, size = 20 } = {}) {
    // var user = await dispatch('user/getUser', null, { root: true })
    // var { count, results } = await new Parse.Query(WorksClass)
    //   .equalTo('isDelete', true)
    //   .equalTo('user', user)
    //   .notEqualTo('isFolder', true)
    //   .skip(index * size)
    //   .limit(size)
    //   .withCount()
    //   .find()
    // if (index === 0) {
    //   commit('SET_LIST', { count, results, folderId: 'recycle' })
    // } else {
    //   commit('SET_LIST', {
    //     count, results: [...(state.objects || []), ...(results || [])], folderId: 'recycle'
    //   })
    // }
  },
  async getFavoriteList({ commit, dispatch }, { index = 0, size = 20 } = {}) {
    // var user = await dispatch('user/getUser', null, { root: true })
    // var { count, results } = await new Parse.Query(FavoriteClass)
    //   .equalTo('user', user)
    //   .select('works.user', 'works.name')
    //   .notEqualTo('works.isFolder', true)
    //   .skip(index * size)
    //   .limit(size)
    //   .withCount()
    //   .find()
    // if (index === 0) {
    //   commit('SET_LIST', { count, results, folderId: 'favorite' })
    // } else {
    //   commit('SET_LIST', {
    //     count, results: [...(state.objects || []), ...(results || [])], folderId: 'favorite'
    //   })
    // }
  },
  // async getShareList({ commit, dispatch }, { folder = null } = {}) {
  //   var user = await dispatch('user/getUser', null, { root: true })

  //   var shareFilter =
  //     Parse.Query.or(
  //       new Parse.Query(ShareClass).equalTo('shareWithPicture', true),
  //       new Parse.Query(ShareClass).equalTo('shareWithMedia', true),
  //       new Parse.Query(ShareClass).equalTo('shareWithLink', true))

  //   var worksFilter = getWorksFilter(user.objectId, folder)
  //     .matchesKeyInQuery('objectId', 'source', shareFilter)

  // var worksFilter = getWorksFilter(user.objectId, folder)ate

  // var shareFilter = Parse.Query.or(
  //   new Parse.Query(WorksClass).equalTo('share.shareWithPicture', true),
  //   new Parse.Query(WorksClass).equalTo('share.shareWithMedia', true),
  //   new Parse.Query(WorksClass).equalTo('share.shareWithLink', true))

  // var filter = Parse.Query.and(worksFilter, shareFilter)
  //   commit('SET_LIST', await worksFilter.find())
  // },
  // async getTeamList({ commit, dispatch }, { folder } = {}) {
  //   var user = await dispatch('user/getUser', null, { root: true })

  //commit('SET_TEAMLIST', await getWorksFilter(user.objectId, folder).find())
  //   commit('SET_LIST', await getWorksFilter(user.objectId, folder).find())
  // },
  // async getRecycleList({ commit }) {
  //   var filter = new Parse.Query(WorksClass)
  //     .equalTo('isDelete', true)
  //     .doesNotExist('isFolder')

  //   commit('SET_LIST', await filter.find())
  // },
  async favorite({ commit, dispatch, state }, { id, worksId, isFavorite }) {
    // var user = await dispatch('user/getUser', null, { root: true })
    // var favorite = FavoriteClass.createWithoutData(id)
    // var works = WorksClass.createWithoutData(worksId)
    // if (isFavorite) {
    //   await this.favoriteObject.save({
    //     user,
    //     works,
    //   });
    //   if (state.folderId === 'favorite') {
    //     state.objects.splice(0, 0, favorite)
    //     commit('SET_LIST', {
    //       count: state.count + 1,
    //       results: [...state.objects, favorite],
    //       folderId: 'favorite'
    //     })
    //   }
    // } else {
    //   await favorite.destroy()
    //   if (state.folderId === 'favorite') {
    //     var index = _.findIndex(state.objects, { id: id })
    //     if (index >= 0) {
    //       state.objects.splice(index, 1)
    //       commit('SET_LIST', {
    //         count: state.count - 1,
    //         results: state.objects,
    //         folderId: 'favorite'
    //       })
    //     }
    //   }
    // }
  },
  async search({ state }, { keyword, folder } = {}) {
    if (keyword) {
      const filter = {};

      if (folder) {
        filter.parentId = folder.id;
      }

      if (keyword) {
        filter.keyworks = keyword;
      }

      const { data: list } = this.$axios.get("/works", { params: filter });
      mutations.SET_SEARCH_LIST(state, list);
    }
  },
  async createMap({ state }, model) {
    const { data: res, status } = await this.$axios.post("maps", model);
    const newModel = { ...model, ...res };

    if (status === 201) {
      mutations.SET_MAPS(
        state,
        [...getters.maps, newModel],
        getters.index(state)
      );
    }

    return newModel;
  },
  async createFolder({ commit }, model) {
    const { data: res, status } = await this.$axios.post("folders", model);
    const newModel = { ...model, ...res };

    if (status === 201) {
      commit("NEW_FOLDER", newModel);
    }

    return newModel;
  },
  async update({ state, commit }, object) {
    var works = find(state.objects, { id: object.id || object.objectId });
    var index = indexOf(state.objects, works);

    if (works) {
      var newly = await works.save(object);
      state.objects.splice(index, 1, newly);

      commit("SET_LIST", { results: state.objects });
    }
  },

  async recovery({ state, commit }, id) {
    var list = state.objects;
    var ids = id instanceof Array ? id : [id];

    await asyncForEach(ids, async (id) => {
      var model = find(list, { id });
      var index = indexOf(list, model);

      model.unset("isDelete");
      await model.save();

      list.splice(index, 1);
    });

    commit("SET_LIST", { results: list });
  },
  async removeFolder({ state }, { id, isDeleted }) {
    const ids = id instanceof Array ? id : [id];
    const { data: deletedIds } = await this.$axios.delete(`folders`, {
      params: {
        isDeleted,
        id: ids.join(","),
      },
    });

    const list = pullAllWith(
      getters.folders(state),
      deletedIds,
      (map, deletedId) => toNumber(map.id) === toNumber(deletedId)
    );

    mutations.SET_FOLDERS(state, list, getters.index(state));
  },
  async remove({ state }, { id, isDeleted }) {
    const ids = id instanceof Array ? id : [id];
    const { data: deletedIds } = await this.$axios.delete(`maps`, {
      params: {
        isDeleted,
        id: ids.join(","),
      },
    });

    const list = pullAllWith(
      getters.maps(state),
      deletedIds,
      (map, deletedId) => toNumber(map.id) === toNumber(deletedId)
    );

    mutations.SET_LIST(state, list, getters.index(state));
    // await asyncForEach(ids, async (id) => {
    //   var model = _.find(list, { id });
    //   var index = _.indexOf(list, model);

    //   if (model.has("isDelete")) {
    //     // physics delete
    //     await model.destroy();
    //   } else {
    //     // logic delete
    //     model.set("isDelete", true);
    //     await model.save();
    //   }

    //   // dispatch('system/putSummary', {
    //   //   code: model.get('isPrivate') ? 'privateFile' : 'publicFile',
    //   //   value: -1
    //   // })

    //   list.splice(index, 1);
    // });
  },
  // async clearRecycle({ commit }) {
  //   var success = false;

  //   try {
  //     await Parse.Cloud.run("clearRecycle");
  //     success = true;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }

  //   if (success) {
  //     commit("SET_LIST", {
  //       results: [],
  //       count: 0,
  //     });
  //   }
  // },
  async move({ state, commit }, { folderId, fileId }) {
    var isOtherFolder = false;
    var file = _.find(state.objects, { id: fileId });
    var index = _.findIndex(state.objects, { id: fileId });

    if (file) {
      isOtherFolder = file.get("parentId") !== folderId;

      file.set("parentId", folderId);
      await file.save();

      if (isOtherFolder) {
        state.objects.splice(index, 1);
        commit("SET_LIST", { results: state.objects });
      }
    }
  },
  async copy({ state, commit }, { folderIds, fileId }) {
    var file = _.find(state.objects, { id: fileId });
    var fileModel = null;
    var sameFolder = [];
    if (file) {
      await asyncForEach(folderIds, async (folderId) => {
        fileModel = file.clone();
        fileModel.set("parentId", folderId);
        //fileModel.set('name', file.get('name') + '(复制)')
        await fileModel.save();

        if (folderId === (file.get("parentId") || null)) {
          sameFolder.push(fileModel);
        }

        // dispatch('system/putSummary', {
        //   code: model.get('isPrivate') ? 'privateFile' : 'publicFile',
        //   value: 1
        // })
      });

      state.objects = [...state.objects, ...sameFolder];
      commit("SET_LIST", { results: state.objects });
    }
  },
};

// mutations
const mutations = {
  SET_LIST(
    state,
    {
      count = state.count,
      results = state.results,
      folderId = state.folderId,
      index = state.index,
      size = state.size,
    }
  ) {
    state.count = count;
    state.folderId = folderId;
    state.index = index;
    state.size = size;
    localStorage.folderId = folderId;

    state.objects = results;
    state.list = processList(results);
  },
  SET_SEARCH_LIST(state, list) {
    state.searchObjects = list.results;
    state.searchList = processList(list.results);
  },
  NEW_MAP(state, map) {
    state[state.currentOn].files.push(map);
  },
  NEW_FOLDER(state, folder) {
    state[state.currentOn].folders.push(folder);
  },
  SET_FOLDERS(state, folders) {
    const index = getters.index(state);

    if (index === 0) {
      state[state.currentOn].folders = [...folders];
    } else {
      state[state.currentOn].folders = [
        ...state[state.currentOn].folders,
        ...folders,
      ];
    }
  },
  SET_MAPS(state, maps, index) {
    state[state.currentOn].maps =
      index === 0 ? maps : [...getters.currentView(state).maps, ...maps];
    state[state.currentOn].index = index;
  },
  SET_FOLDER(state, folder) {
    state[state.currentOn].folder = folder;
    state[state.currentOn].index = -1;
  },
  SET_CURRENTON(state, currentOn) {
    if (!allowedCurrentOn.includes(currentOn)) {
      throw new Error(
        "currentOn can only be a anyone of list:" + allowedCurrentOn
      );
    }

    state.currentOn = camelCase(currentOn);
  },
  SET_CURRENTON_WORKS(state, currentState) {
    state[state.currentOn] = {
      ...state[state.currentOn],
      ...currentState,
    };
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
