import Parse from 'parse'

import _ from 'lodash'
import systemSetting from "../predefine/setting";
import { FlowChart, SequenceMap, StructMap, MindMap } from '../../map'

const StyleObject = Parse.Object.extend('style')

const saveModel = _.debounce(async (src, object, beforeCallback, afterCallback) => {
  beforeCallback && beforeCallback()
  await src.save(object);
  afterCallback && afterCallback()
}, 1500, {
  maxWait: 2500,
  leading: false,
  trailing: true
})
const WorksClass = Parse.Object.extend("works")
const state = () => ({
  map: null,
  mapObject: null,
  mapData: null,
  style: null,
  setting: null,
  isChanged: false,
  isSaving: false,
  status: null
})

// getters
const getters = {
  map: (state) => state.map,
  mapObject: (state) => state.mapObject,
  mapData: (state) => state.mapData,
  style: (state) => state.style,
  history: (state) => state.history,
  status: (state) => state.status
}

const actions = {
  async createMap({ dispatch }, { map: mapName, raw, style, setting }) {
    var map = null

    if (_.isEmpty(style)) {
      style = await dispatch("style/getPredefine", null, { root: true });
    }

    if (_.isEmpty(setting)) {
      setting = systemSetting;
    }

    switch (mapName) {
      case "MINDMAP":
        map = new MindMap(style, setting, raw)
        break;

      case "SEQUENCEMAP":
        map = new SequenceMap(style, setting, raw)
        break;

      case "STRUCTMAP":
        map = new StructMap(style, setting, raw)
        break;

      default:
        map = new FlowChart(style, setting, raw)
        break;
    }

    return map
  },

  async save({ state, commit }, object) {
    commit('SET_SAVING', true)
    saveModel(state.mapObject, object, null, () => {
      commit('SET_STATUS', 'SUCCESS')
    })

    commit('UPDATE_OBJECT', state.mapObject)
  },

  async  setMap({ commit, dispatch }, { mapId, elementId }) {

    await Parse.Cloud.run('openWorks', { id: mapId })

    var object = await new Parse.Query(WorksClass)
      .include("style")
      .get(mapId)

    if (_.isEmpty(object)) {
      throw new Error('文档不存在或已删除')
    }

    var map = await dispatch('createMap', object.toJSON())
    if (_.isEmpty(map)) {
      throw new Error('画布初始化出错')
    }

    map.mount(elementId || mapId, object.get('raw'))
    map.event.on("model:changed", (model) => {
      commit('SET_STATUS', 'CHANGED')

      dispatch('save', {
        raw: model
      })
    });
    map.event.on("setting:changed", (model) => {
      //commit('SET_CHANGED', true)
      commit('SET_STATUS', 'CHANGED')
      dispatch('save', {
        setting: model
      })
    });
    map.event.on("style:changed", (model) => {
      //commit('SET_CHANGED', true)
      commit('SET_STATUS', 'CHANGED')

      dispatch('save', {
        style: StyleObject.createWithoutData(model.objectId).toPointer()
      })
    });

    commit('SET_MAP', { map, object })
    // commit('SET_STYLE', map.style)
  }
}


// mutations
const mutations = {
  SET_MAP(state, { map, object }) {
    state.map = map
    state.mapObject = object
    state.mapData = object.attributes
  },
  SET_STATUS(state, status) {
    state.status = status
  },
  // SET_STYLE(state, style) {
  //   state.style = style
  //   state.map.setStyle(style)
  // },
  SET_CHANGED(state, isChanged) {
    state.isChanged = isChanged
  },
  SET_SAVING(state, isSaving) {
    state.isSaving = isSaving
  },
  UPDATE_OBJECT(state, object) {
    state.mapObject = object
    state.mapData = object.attributes
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}