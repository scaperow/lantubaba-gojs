<template>
  <el-container>
    <el-aside v-if="list"
              width="200px">
      <h4>所有主题 [{{list.length}}]
        <v-btn text
               color="primary"
               @click="create">创建</v-btn>
      </h4>
      <el-card style="margin-bottom:16px;"
               :shadow="currentStyle && style.id === currentStyle.id?'always':'hover'"
               v-for="(style,index) in list"
               :key="index">
        <el-link @click="setCurrentStyle(style)">{{style.attributes.name}}</el-link>

      </el-card>
    </el-aside>

    <el-main style="padding:16px"
             v-if="currentStyle">
      <v-form :inline="true">
        <div label="主题名称">
          <v-text-field v-model="name">名称</v-text-field>
          <v-checkbox v-model="isDefault"
                      :disabled="false"
                      v-show="isDefault">是否默认</v-checkbox>
        </div>
        <v-divider>页面主题</v-divider>
        <div label="背景颜色">
          <el-color-picker :show-alpha="true"
                           :predefine="systemColors"
                           v-model="model.root.background"></el-color-picker>
        </div>
        <div label="参考线颜色">
          <el-color-picker :show-alpha="true"
                           :predefine="systemColors"
                           v-model="model.root.ruleColor"></el-color-picker>
        </div>
        <div label="网格颜色">
          <el-color-picker v-model="model.root.meshColor"></el-color-picker>
        </div>
        <div label="连线">
          <el-color-picker :show-alpha="true"
                           :predefine="systemColors"
                           v-model="model.line.stroke"></el-color-picker>
        </div>
      </v-form>
      <div v-for="(category,key) in categoryStyle"
           :key="key"
           style="margin-bottom:18px; background:#f3f3f3;padding:12px;border-radius:12px;">
        <v-form :inline="true">
          <v-divider>{{key | uppercase}}</v-divider>
          <div label="背景颜色">
            <el-color-picker :show-alpha="true"
                             :predefine="systemColors"
                             v-model="category.fill"></el-color-picker>
          </div>
          <div label="边框大小">
            <v-text-field type="number"
                          v-model="category.strokeWidth"></v-text-field>
          </div>
          <div label="边框颜色">
            <el-color-picker :show-alpha="true"
                             :predefine="systemColors"
                             v-model="category.stroke"></el-color-picker>
          </div>
          <div label="字体">
            <el-select v-model="category.fontFamily">
              <el-option v-for="font in systemFonts"
                         :key="font.name"
                         :label="font.label"
                         :value="font.name"
                         :style="{fontFamily:font.name}">
              </el-option>
            </el-select>
          </div>
          <div label="字体大小">
            <v-text-field type="number"
                          v-model="category.fontSize"></v-text-field>
          </div>

          <div label="字体颜色">
            <el-color-picker :show-alpha="true"
                             :predefine="systemColors"
                             v-model="category.fontColor"></el-color-picker>
          </div>
          <div label="粗体">
            <v-checkbox type="number"
                        v-model="category.fontBold"></v-checkbox>
          </div>
          <div label="斜体">
            <v-checkbox type="number"
                        v-model="category.fontItalic"></v-checkbox>
          </div>
          <div label="透明度">
            <el-slider :min="0"
                       :max="1"
                       :step="0.1"
                       style="width:120px"
                       v-model="category.opacity"></el-slider>
          </div>
          <div label="圆角">
            <el-slider :min="0"
                       :max="60"
                       :step="1"
                       :show-input="true"
                       style="width:420px"
                       v-model="category.radius"></el-slider>
          </div>
          <div label="长度">
            <v-text-field type="number"
                          style="width:80px"
                          v-model="category.height"></v-text-field>
          </div>
          <div label="宽度">
            <v-text-field type="number"
                          style="width:80px"
                          v-model="category.width"></v-text-field>
          </div>

        </v-form>
      </div>
      <p>
        <v-btn color="primary"
               @click="save">保存</v-btn>
        <v-btn class="fr"
               type="danger"
               v-if="!isDefault"
               @click="remove(currentStyle)">删除</v-btn>
      </p>
    </el-main>
  </el-container>
</template>
<script>
import _ from 'lodash'
import { TemplateMaker } from '~/map'
import { mapGetters } from 'vuex';
import systemColors from '~/store/predefine/colors'
import systemFonts from '~/store/predefine/fonts'

const shapesStyle = _.chain(TemplateMaker.categoryStyle)
  .keys()
  .reduce((result, current) => {
    result[current] = {
      fill: '#fff',
      opacity: 1,
      radius: 10,
      stroke: '#999',
      strokeWidth: 1,
      fontColor: '#333',
      fontSize: 14,
      fontBold: false,
      fontItalic: false,
      width: 80,
      height: 80
    }

    return result
  }, {})
  .value()
const commonStyle = {
  name: '主题',
  root: {
    color: null,
    background: null,
    meshColor: null,
    ruleColor: null,
  },
  line: {
    stroke: null,
    strokeWidth: 1
  },
  group: {
    radius: 8,
    fill: 'transparent',
    opacity: 0.5,
    padding: 5,
    stroke: '#666',
    strokeWidth: 1,
    fontColor: '#333'
  },
  ...shapesStyle
}

export default {
  data () {
    return {
      name: null,
      model: null,
      isDefault: false,
      currentStyle: null,
      systemFonts, systemColors
    }
  },
  methods: {
    setCurrentStyle (style) {
      //console.log(_.defaults(commonStyle, style.get('model')))
      if (style) {
        this.name = style.get('name')
        this.model = _.create(commonStyle, style.get('model'))
        this.isDefault = style.get('isDefault')
      }

      this.currentStyle = style
    },
    async getData () {
      this.$store.dispatch('style/getList')
    },
    async save () {
      this.currentStyle.set('name', this.name)
      this.currentStyle.set('model', this.model)
      this.currentStyle.set('isDefault', this.isDefault)

      try {
        await this.currentStyle.save()

        this.$overlay.message.success('已保存')
      } catch ({ code, message }) {
        this.$overlay.message.error(message)
      }
    },
    async remove (style) {
      await this.$store.dispatch('style/remove', style.id)
      this.setCurrentStyle(null)
      this.$overlay.message.success('已删除')
    },
    async create () {
      var style = await this.$store.dispatch('style/create', {
        name: '新主题',
        model: {}
      })

      this.setCurrentStyle(style)
    }
  },
  computed: {
    ...mapGetters({
      list: 'style/list'
    }),
    categoryStyle () {
      return _.chain(TemplateMaker.categoryStyle)
        .keys()
        .reduce((result, category) => {
          result[category] = _.get(this.model, category)

          return result
        }, {})
        .value()
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
</style>


