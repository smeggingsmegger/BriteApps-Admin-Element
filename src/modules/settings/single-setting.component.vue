<template>
  <div :class="{ 'c-disabled-block' : readonly }">
    <div class="c-disabled-block__message" v-if="readonly">
      <icon class="u-mr2" name="exclamation-triangle"></icon>
      Setting is 'Read Only'. Please contact BriteApps team for assitance.
    </div>
      <div class="single-setting__title u-mb1">
        <div class="single-setting__name">
          {{setting.name}} <em class="u-text--sm u-text--light u-ml3">{{setting.section.slug}}.{{setting.slug}}</em>
        </div>
      </div>
    <div class="u-mt2 c-disabled-block__message" v-if="(carrierAccess === 'N' || carrierAccess === 'R' ) && user.is_superuser">
      <icon class="u-mr2" name="lock"></icon>
      Setting for administrators Only.
    </div>
      <div class="single-setting__value u-mb4">
        <div class="setting--boolean" v-if="setting.stype === 'BLN'">
          <el-switch :disabled="readonly" v-model="settingValue"></el-switch>
        </div>
        <div class="setting--string" v-if="setting.stype === 'STR' || setting.stype === 'URL'">
          <el-input :disabled="readonly" v-bind:value="settingValueClone" @change="updateTextSetting" @blur="updateTextSetting"></el-input>
        </div>
        <div class="setting--string" v-if="setting.stype === 'LTX'">
          <el-input type="textarea" autosize :rows="3" :disabled="readonly" v-bind:value="settingValueClone" @change="updateTextSetting" @blur="updateTextSetting"></el-input>
        </div>
        <div class="setting--markdown" v-if="setting.stype === 'MKD'">
          <el-input :disabled="readonly" type="textarea" v-bind:value="settingValueClone" @change="updateTextSetting" @blur="updateTextSetting"></el-input>
        </div>
        <div class="setting--int" v-if="setting.stype === 'INT'">
          <el-input-number :disabled="readonly" v-model="settingValue" :min="range.min" :max="range.max"></el-input-number>
        </div>
        <div class="setting--decimal" v-if="setting.stype === 'DEC'">
          <el-input :disabled="readonly" v-model="settingValue"></el-input>
        </div>
        <div class="setting--time" v-if="setting.stype === 'TIM'">
          <el-time-select :disabled="readonly" v-model="settingValue"
                          :picker-options="{
                            start: '06:00',
                            step: '00:15',
                            end: '23:30'
                          }"></el-time-select>
      </div>
      <div class="u-mt4">

        <!--{{setting.default}}-->
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

function isDefined (variable) {
  return typeof variable !== 'undefined'
}

export default {
  props: ['setting'],
  name: 'ba-single-setting',
  data () {
    let carrierAccess = this.setting.carrier_access
    return {
      settingValueClone: this.setting.overridden ? this.setting.overridden.value : this.setting.default,
      carrierAccess,
    }
  },
  computed: {
    ...mapState('shared', ['user']),
    readonly () {
      if (!this.user) {
        return true
      }
      return !this.user.is_superuser && (this.carrierAccess === 'R' || this.carrierAccess === 'N')
    },
    range () {
      let result = {
        min: -Infinity,
        max: Infinity,
      }
      while (true) {
        let metadata = this.setting.metadata
        if (!metadata || !metadata.validation) {
          break
        }

        let range = metadata.validation.range

        if (!range) {
          break
        }

        if (isDefined(range.min)) {
          result.min = range.min
        }

        if (isDefined(range.max)) {
          result.max = range.max
        }

        break
      }

      return result
    },
    settingValue: {
      get () {
        let val = this.setting.overridden ? this.setting.overridden.value : this.setting.default

        let stype = this.setting.stype
        if (stype === 'BLN') {
          if (val === 'true') {
            return true
          } else {
            return false
          }
        } else if (stype === 'INT') {
          return parseInt(val)
        }
        return this.setting.default
      },
      set (value) {
        let payload = {
          setting: this.setting,
          newValue: value.toString(),
          companyId: this.$route.params.companyId,
          oldValue: this.settingValue.toString(),
        }
        this.updateSingleSetting(payload)
      },
    },
  },
  methods: {

    ...mapMutations('settings', ['updateSingleSetting']),
    updateTextSetting (e) {
      let value = e.target ? e.target.value : e

      let payload = {
        setting: this.setting,
        companyId: this.$route.params.companyId,
        newValue: value,
        oldValue: this.settingValueClone,
      }
      this.updateSingleSetting(payload)

      this.settingValueClone = value
    },
  },
}
</script>

<style scoped>
  .single-setting__title {
    display: flex;
  }

  .single-setting__name {
    flex: auto;
    line-height: 30px;
  }
</style>
