
import Parse from 'parse'
import _ from 'lodash'

const state = () => ({
    list: [],
    count: 0
})

// getters
const getters = {
    list: (state) => state.list,
    count: (state) => state.count
}

const actions = {
    async getList({ state, commit }, { index = 1, size = 20, keywords } = {}) {
        // var { results, count } = await Parse.Cloud.run('square', {
        //     index,
        //     size,
        //     keywords
        // })

        // var list = [...state.list, ...results]
        // commit('SET_LIST', list)
        // commit('SET_COUNT', count)
    },
    async clear({ state, commit }) {
        commit('SET_LIST', [])
        commit('SET_COUNT', 0)
    }
}


// mutations
const mutations = {
    SET_LIST(state, list) {
        state.list = list
    },
    SET_COUNT(state, count) {
        state.count = count
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
