


import Parse from 'parse'
import Http from '~/api/common'
import _ from 'lodash'
import go from 'gojs'

const FavoriteClass = Parse.Object.extend('favorite')
const WorksClass = Parse.Object.extend('works')
const Works = Http.create('works')
const asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const state = () => ({
  folderId: null,
  index: 0,
  size: 20,
  list: [],
  objects: [],
  count: 0,
  searchObjects: [],
  searchList: [],
  folderObjects: [],
  folderList: [],
  folder: null,
  privates: 0,
  publics: 0
})

const processList = function (objectList) {
  return _.chain(objectList)
    .map(item => item.toJSON())
    // .orderBy(['updatedAt'], ['desc'])
    .map(item => {
      item.isShare = _.get(item, 'isPrivate') !== true && _.get(item, 'share.isShare') === true
      return item
    })
    .value()
}

// getters
const getters = {
  // mineList: (state) => state.mineList,
  // shareList: (state) => state.shareList,
  // shareList: (state) => state.shareList
  list: (state) => state.list,
  searchList: (state) => state.searchList,
  folders: (state) => state.folderList,
  folderId: (state) => state.folderId,
  count: (state) => state.count,
  size: (state) => state.size,
  index: (state) => state.index
}

const actions = {
  async getFolders({ commit }) {
    var list = await new Parse.Query(WorksClass)
      .equalTo('isFolder', true)
      .notEqualTo('isDelete', true)
      .find()


    commit('SET_FOLDERS', list)
  },
  async getMineList({ commit, state, dispatch }, { folderId = null, index = 0, size = 20 } = {}) {
    var user = await dispatch('user/getUser', null, { root: true })
    folderId = folderId || state.folderId || localStorage.folderId || (state.folderList.length > 0 && state.folderList[0].objectId)


    if (folderId) {
      var { count, results } = await new Parse.Query(WorksClass)
        .notEqualTo('isDelete', true)
        .notEqualTo('isFolder', true)
        .equalTo('parentId', folderId)
        .include('style')
        .include('share')
        .equalTo('user', user)
        .limit(size)
        .skip(index * size)
        .withCount()
        .find()

      if (index === 0) {
        commit('SET_LIST', { count, results, folderId })
      } else {
        commit('SET_LIST', { count, results: [...state.objects, ...results], folderId })
      }
    }
  },
  async getRecycleList({ commit, dispatch }, { index = 0, size = 20 } = {}) {
    var user = await dispatch('user/getUser', null, { root: true })
    var { count, results } = await new Parse.Query(WorksClass)
      .equalTo('isDelete', true)
      .equalTo('user', user)
      .notEqualTo('isFolder', true)
      .skip(index * size)
      .limit(size)
      .withCount()
      .find()

    if (index === 0) {
      commit('SET_LIST', { count, results, folderId: 'recycle' })
    } else {
      commit('SET_LIST', {
        count, results: [...(state.objects || []), ...(results || [])], folderId: 'recycle'
      })
    }
  },
  async getFavoriteList({ commit, dispatch }, { index = 0, size = 20 } = {}) {
    var user = await dispatch('user/getUser', null, { root: true })
    var { count, results } = await new Parse.Query(FavoriteClass)
      .equalTo('user', user)
      .select('works.user', 'works.name')
      .notEqualTo('works.isFolder', true)
      .skip(index * size)
      .limit(size)
      .withCount()
      .find()

    if (index === 0) {
      commit('SET_LIST', { count, results, folderId: 'favorite' })
    } else {
      commit('SET_LIST', {
        count, results: [...(state.objects || []), ...(results || [])], folderId: 'favorite'
      })
    }
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
    var user = await dispatch('user/getUser', null, { root: true })
    var favorite = FavoriteClass.createWithoutData(id)
    var works = WorksClass.createWithoutData(worksId)

    if (isFavorite) {
      await this.favoriteObject.save({
        user,
        works,
      });

      if (state.folderId === 'favorite') {
        state.objects.splice(0, 0, favorite)
        commit('SET_LIST', {
          count: state.count + 1,
          results: [...state.objects, favorite],
          folderId: 'favorite'
        })
      }
    } else {
      await favorite.destroy()
      if (state.folderId === 'favorite') {
        var index = _.findIndex(state.objects, { id: id })
        if (index >= 0) {
          state.objects.splice(index, 1)

          commit('SET_LIST', {
            count: state.count - 1,
            results: state.objects,
            folderId: 'favorite'
          })
        }
      }
    }


  },
  async search({ commit }, { keyword, folder } = {}) {
    if (keyword) {
      var filter = new Parse.Query(WorksClass)


      if (folder) {
        filter = filter.equalTo('parent', folder)
      }

      if (keyword) {
        filter = filter.contains('name', keyword)
      }

      commit('SET_SEARCH_LIST', await filter.withCount().find())
    }
  },
  async create({ state, commit }, model) {
    var works = await Works.save(model)
    if (model.isFolder) {
      state.folderObjects.splice(0, 0, works)
      commit('SET_FOLDERS', state.folderObjects)
    } else {
      state.objects.splice(0, 0, works)
      commit('SET_LIST', { results: state.objects })
    }

    return works
  },
  async update({ state, commit }, object) {
    var works = _.find(state.objects, { id: object.id || object.objectId })
    var index = _.indexOf(state.objects, works)

    if (works) {
      var newly = await works.save(object)
      state.objects.splice(index, 1, newly)

      commit('SET_LIST', { results: state.objects })
    }
  },

  async recovery({ state, commit }, id) {
    var list = state.objects
    var ids = id instanceof Array ? id : [id]

    await asyncForEach(ids, async id => {
      var model = _.find(list, { id })
      var index = _.indexOf(list, model)

      model.unset('isDelete')
      await model.save()

      list.splice(index, 1)
    })

    commit('SET_LIST', { results: list })
  },
  async removeFolder({ state, commit }, id) {
    var list = state.folderObjects
    var ids = id instanceof Array ? id : [id]

    await asyncForEach(ids, async id => {
      var model = _.find(list, { id })
      var index = _.indexOf(list, model)

      if (model.has('isDelete')) {
        // physics delete
        await model.destroy()
      } else {
        // logic delete
        model.set('isDelete', true)
        await model.save()
      }

      list.splice(index, 1)
    })

    commit('SET_FOLDERS', list)
  },
  async remove({ state, commit }, id) {
    var list = state.objects
    var ids = id instanceof Array ? id : [id]

    await asyncForEach(ids, async id => {
      var model = _.find(list, { id })
      var index = _.indexOf(list, model)

      if (model.has('isDelete')) {
        // physics delete
        await model.destroy()
      } else {
        // logic delete
        model.set('isDelete', true)
        await model.save()
      }

      // dispatch('system/putSummary', {
      //   code: model.get('isPrivate') ? 'privateFile' : 'publicFile',
      //   value: -1
      // })

      list.splice(index, 1)
    })

    commit('SET_LIST', { results: list })
  },
  async clearRecycle({ commit }) {
    var success = false

    try {
      await Parse.Cloud.run('clearRecycle')
      success = true
    } catch (error) {
      console.error(error)
      throw error
    }

    if (success) {
      commit('SET_LIST', {
        results: [],
        count: 0
      })
    }
  },
  async move({ state, commit }, { folderId, fileId }) {
    var isOtherFolder = false
    var file = _.find(state.objects, { id: fileId })
    var index = _.findIndex(state.objects, { id: fileId })

    if (file) {
      isOtherFolder = file.get('parentId') !== folderId

      file.set('parentId', folderId)
      await file.save()

      if (isOtherFolder) {
        state.objects.splice(index, 1)
        commit('SET_LIST', { results: state.objects })
      }
    }
  },
  async copy({ state, commit }, { folderIds, fileId }) {
    var file = _.find(state.objects, { id: fileId })
    var fileModel = null
    var sameFolder = []
    if (file) {
      await asyncForEach(folderIds, async (folderId) => {
        fileModel = file.clone()
        fileModel.set('parentId', folderId)
        //fileModel.set('name', file.get('name') + '(复制)')
        await fileModel.save()

        if (folderId === (file.get('parentId') || null)) {
          sameFolder.push(fileModel)
        }

        // dispatch('system/putSummary', {
        //   code: model.get('isPrivate') ? 'privateFile' : 'publicFile',
        //   value: 1
        // })
      })


      state.objects = [...state.objects, ...sameFolder]
      commit('SET_LIST', { results: state.objects })
    }
  }
}

// mutations
const mutations = {
  SET_LIST(state, { count = state.count, results = state.results, folderId = state.folderId, index = state.index, size = state.size }) {

    state.count = count
    state.folderId = folderId
    state.index = index
    state.size = size
    localStorage.folderId = folderId


    state.objects = results
    state.list = processList(results)
  },
  SET_SEARCH_LIST(state, list) {
    state.searchObjects = list.results
    state.searchList = processList(list.results)
  },
  SET_FOLDERS(state, list) {
    state.folderObjects = list
    state.folderList = _.map(list, item => item.toJSON())

  },

  // SET_MINELIST (state, list) {
  //   state.mineObjects = list
  //   state.mineList = processList(list)
  // },

  // SET_SHARELIST (state, list) {
  //   state.shareObjects = list
  //   state.shareList = processList(list)
  // },

  // SET_TEAMLIST (state, list) {
  //   state.teamObjects = list
  //   state.teamList = processList(list)
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
