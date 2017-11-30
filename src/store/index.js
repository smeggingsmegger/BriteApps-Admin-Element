/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

import loginModule from './login.module'

let storeDescription = {
  modules: {
    login: loginModule,
  },
  actions: {
    init: function (context, payload) {
      return new Promise((resolve) => { //using promise to detect the moment when init completed
        context.commit('common/setSettings', settings)
        context.commit('common/setContent', content)
        context.dispatch('common/loadContent')
        context.dispatch('common/loadSettings')
        context.dispatch('login/init').then(
          () => {
            resolve()
          },
        )
      })
    },
  },
  strict: process.env.NODE_ENV !== 'production' // enable it only for dev "to avoid the performance cost on prod."
}

Vue.use(Vuex)

const store = new Vuex.Store(storeDescription)

export default store
