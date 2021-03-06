/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

import loginModule from './login.module'
import settingsModule from './settings.module'
import contentModule from './content.module'
import templatesModule from './templates.module'
import sharedModule from './shared.module'

let storeDescription = {
  modules: {
    login: loginModule,
    settings: settingsModule,
    content: contentModule,
    templates: templatesModule,
    shared: sharedModule,
  },
  actions: {
    init: function (context, payload) {
      return new Promise((resolve) => { //using promise to detect the moment when init completed

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
