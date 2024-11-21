
<!-- 
功能拦截组件，用户当前购买的版本中，如果不存在指定的功能，以或 slot 的方式显示出来
-->
<template>
  <div>
    <slot name="activator" :rule="interceptRule" :intercepted="isIntercept" :on="scope">{{isDialog}}</slot>
    <slot name="intercept" v-if="isIntercept" :intercepted="isIntercept" :rule="interceptRule"></slot>
    <v-dialog
      v-model="isDialog"
      width="100%"
      max-width="620"
      v-if="userPlane && interceptCondition"
    >
      <v-card class="pa-4">
        <v-card-title>提示</v-card-title>
        <v-card-text class="flex-grow-1">
          <p class="line-height:40px;" v-if="interceptCondition.unit">
            抱歉，您当前使用的版本为
            <v-chip small :color="userPlane.color">{{userPlane.label}}</v-chip>
            ，最多只能创建{{interceptCondition.condition}}个{{interceptCondition.label}}，如果不够，请您升级版本。
          </p>
          <p v-else>
            抱歉，您当前使用的版本为
            <v-chip small :color="userPlane.color">{{userPlane.label}}</v-chip>
            ，不具备 {{interceptCondition.label}} 的功能，如果要开通此功能，请购买更高的版本
          </p>
        </v-card-text>
        <v-card-actions class="d-flex flex-row justify-space-between align-center">
          <div>
            <v-btn nuxt text to="/price" href="_black">查看价格列表</v-btn>
            <v-btn text @click="isDialog = false">取消</v-btn>
          </div>
          <v-btn rounded color="primary" nuxt to="/price" depressed>
            升级版本
            <v-icon class="ml-2 mr-2 animated infinite slideInUp">mdi-arrow-up-bold-hexagon-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  props: {
    // 指定多个拦截规则
    /*
     * [{code:'',value:'',offset:0},{code:'',value:'',offset:0}]
     *
     */
    rules: {
      required: false,
      type: Array
    },
    // 指定功能的编码
    code: {
      required: false,
      type: String
    },
    // 要做判断的值，（如果需要指定）
    value: {
      required: false,
      type: Number
    },
    // 如果快超过预警阈值时给予警告，这个就是从 value 到 阈值的偏移量
    offset: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isDialog: false,
      scope: {
        click: this.click
      }
    };
  },
  computed: {
    ...mapGetters({
      features: "system/features",
      user: "user/user",
      userPlane: "user/plane"
    }),
    interceptRule() {
      if (_.isEmpty(this.rules)) {
        var rule = {
          code: this.code,
          value: this.value,
          offset: this.offset
        };

        if (this.checkIntercept(rule)) {
          return rule;
        } else {
          return null;
        }
      } else {
        return _.find(this.rules, i => this.checkIntercept(i));
      }
    },
    isIntercept() {
      return !_.isEmpty(this.interceptRule);
    },
    interceptCondition() {
      var result = {};

      if (this.interceptRule) {
        var feature = _.find(this.features, { code: this.interceptRule.code });
        var condition = feature[this.userPlane.id];

        return {
          condition,
          label: feature.label,
          unit: feature.unit
        };
      }
    }
  },
  methods: {
    click() {
      if (this.isIntercept) {
        this.isDialog = true;
      }
    },
    checkIntercept(rule) {
      if (this.features && this.features.length > 0 && this.userPlane) {
        var feature = _.find(this.features, { code: rule.code });
        if (feature) {
          var condition = feature[this.userPlane.id];

          if (_.isEmpty(feature.unit) && condition === 0) {
            return true;
          } else if (
            !_.isEmpty(feature.unit) &&
            rule.value >= condition &&
            condition !== -1
          ) {
            return true;
          }
        }
      }

      return false;
    }
  },
  watch: {
    isDialog() {
      console.log(this.isDialog);
    }
  }
};
</script>