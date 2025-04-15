
import Parse from "parse";
import _ from 'lodash'
import Http from '~/api/common'
import planes from "../predefine/planes";
const FeatureClass = Parse.Object.extend("feature")

const state = () => ({
    featureList: null,
    featureObjects: null,
    useSummary: null
})

// getters
const getters = {
    features: (state) => state.featureList,
    summary: (state) => state.useSummary
}

const actions = {
    async getFeatures({ commit, state }) {
        if (!state.featureList) {
            var list = await new Parse.Query(FeatureClass).find()
            commit('SET_FEATURES', list)

            return list
        }
    },
    async getSummary({ commit, state }) {
        if (!state.useSummary) {
            var object = await new Parse.Cloud.run('summary')
            commit('SET_SUMMARY', object)
        }
    },
    async getAll({ dispatch }) {
        await dispatch('system/getFeatures', null, { root: true })
        await dispatch('system/getSummary', null, { root: true })
    },
    async putSummary({ commit, state }, { code, value }) {
        var summary = _.find(state.useSummary, { code })
        var index = _.index(state.useSummary, summary)
        if (summary) {
            summary.value += value
        }

        state.useSummary.splice(index, 1, summary)
        commit('SET_SUMMARY', state.useSummary)
    }
}

// mutations
const mutations = {
    SET_FEATURES(state, list) {
        state.featureObjects = list
        state.featureList = _.map(list, item => item.toJSON())
    },
    SET_SUMMARY(state, object) {
        state.useSummary = object
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}