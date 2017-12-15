<template>
  <div>
    <ba-header activeModule="Content"></ba-header>

    <ba-page-with-sidebar :title="'Content'">
      <div slot="sidebar">
        <div class="c-nav__list">
          <div v-for="section in filteredSections" v-if="section.contents.length > 0">
            <a class="c-nav__link" :href="'#'+ section.name">{{section.name}}</a>
          </div>
        </div>
      </div>
      <div slot="main" v-loading="loading">

        <h3 class="u-pt5 c-heading__page u-pb3">Content Customization</h3>
        <el-form label-position="left">
          <el-row :gutter="50">
            <el-col :xs="24" :sm="16">
              <el-form-item label="Search">
                <el-input v-model="searchFilter">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  <i slot="suffix" class="el-input__icon el-icon-close u-link" @click="searchFilter = ''"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="8">
              <el-form-item label="Language">
                <el-select v-model="selectedLanguage">
                  <el-option
                          v-for="language in languages"
                          :value="language"
                          :key="language">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">

            <el-col  :xs="24" :sm="9">
                <el-checkbox v-model="showOnlyOverridden">
                  Show only customized content
                </el-checkbox>
            </el-col>
          </el-row>
        </el-form>

        <div class="el-card u-mt4 u-pb0" v-for="section in filteredSections" v-if="section.contents.length > 0">
          <a class="u-section-anchor" :id="section.name"></a>
          <h4 class="c-heading--lg u-mb3"><icon class="u-mr2 u-text--light" :name="'link'"></icon>{{ section.name }}</h4>

          <div class="contents-repeater--expanded">
            <el-form v-for="content in section.contents" :key="content.id" label-position="top">
              <ba-single-content :content="content"></ba-single-content>
            </el-form>
          </div>
        </div>

      </div> <!-- Content module end -->
    </ba-page-with-sidebar>

  </div>
</template>

<script>
/* eslint-disable */

import {mapActions, mapState} from 'vuex'
import BaSingleContent from '@/modules/content/single-content.component'
import BaPageWithSidebar from '@/components/page-with-sidebar.component'

export default {
  components: {
    BaPageWithSidebar,
    BaSingleContent},
  data () {
    this.load()
    return {
      searchFilter: '',
      selectedLanguage: null,
      showOnlyOverridden: false,
    }
  },
  methods: {
    ...mapActions('content', ['load']),
    passSearchFilter (content) {

      let searchFilterPass = false
      let overriddenFilterPass = false
      let fullSlug = content.section.slug + '.' + content.slug
      if (fullSlug.indexOf(this.searchFilter) >= 0) {
        searchFilterPass = true
      }

      if (!searchFilterPass && content.default.toLowerCase().indexOf(this.searchFilter.toLowerCase()) >= 0) {
        searchFilterPass = true
      }
      if (!searchFilterPass && content.overridden && content.overridden.value.toLowerCase().indexOf(this.searchFilter.toLowerCase()) >= 0) {
        searchFilterPass = true
      }

      if (!this.showOnlyOverridden) {
        overriddenFilterPass = true
      } else {
        if (content.overridden && content.overridden.value !== content.default) {
          overriddenFilterPass = true
        }
      }

      return searchFilterPass && overriddenFilterPass
    },
  },
  computed: {
    ...mapState('content', ['all']),

    loading () {
      return this.all === undefined || this.all === null
    },
    sections () {
      let arr = []
      if (this.all === null) {
        return arr
      }


      let sections = this.all[this.selectedLanguage]
      for (let section in sections) {
        arr.push(
          {
            name: section,
            contents: sections[section],
          })
      }

      return arr
    },

    filteredSections () {
      let all = this.sections
      let map = new Map()
      for (let sectionName in all) {
        let currentSection = all[sectionName]
        let filteredContentForSection = []
        for (let contentIndex in currentSection.contents) {
          let content = currentSection.contents[contentIndex]
          if (this.passSearchFilter(content)) {
            filteredContentForSection.push(content)
          }
        }
        map.set(currentSection.name, filteredContentForSection)
      }
      let keys = Array.from(map.keys())
      let result = []
      keys.sort()
      keys.forEach((key) => {
        result.push({
          name: key,
          contents: map.get(key)
        })
      } )
      return result
    },
    languages () {
      let arr = []
      for (let key in this.all) {
        arr.push(key)
      }
      arr.sort()
      if (this.selectedLanguage === null && arr.length > 0) {
        this.selectedLanguage = arr[0]
      }
      return arr
    },
  },
}
</script>
<style>
  /* Hide title if no search filter pass for section */
  .section__title:last-child {
    display: none;
  }
</style>