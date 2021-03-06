import Profile from '../../models/profile'
import Column from '../../models/column'
import * as types from '../mutation-types'

const state = {
  activeProfile: 0,
  all: []
}

const getters = {
  allProfiles: state => state.all
}

const actions = {
  addProfile ({ commit, state }, profile) {
    commit(types.ADD_PROFILE, { profile })
  },
  setActiveProfile ({ commit, state }, id) {
    commit(types.SET_ACTIVE_PROFILE, { id })
  },
  addColumn ({ commit, state }, column) {
    commit(types.ADD_COLUMN, { column })
  },
  startStreaming ({ commit, state, rootState }, payload) {
    rootState.accounts.all[payload.owner].client.startStreaming('user', (tweet) => {
      payload.tweet = tweet
      commit(types.ADD_TWEET_TO_COLUMN, { payload })
    })
  }
}

const mutations = {
  [types.ADD_PROFILE] (state, { profile }) {
    state.all.push(new Profile(profile))
  },
  [types.SET_ACTIVE_PROFILE] (state, { id }) {
    state.activeProfile = id
  },
  [types.ADD_COLUMN] (state, { column }) {
    state.all[state.activeProfile].columns.push(new Column(column.name, column.type, column.owner))
  },
  [types.ADD_TWEET_TO_COLUMN] (state, { payload }) {
    state.all[payload.profile].columns[payload.index].tweetStorage.ids.unshift(payload.tweet.id_str)
    state.all[payload.profile].columns[payload.index].tweetStorage.tweets[payload.tweet.id_str] = payload.tweet
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
