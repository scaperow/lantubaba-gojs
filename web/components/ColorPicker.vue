<template>
  <v-menu v-model="visible" :close-on-content-click="false" offset-y>
    <template v-slot:activator="all">
      <slot name="activator" v-bind="all"></slot>
      <!-- <v-btn v-on="on">{{on}}</v-btn>-->
    </template>
    <v-card flat>
      <v-card-text>
        <v-color-picker flat mode="hexa" v-model="color" v-bind="$props"></v-color-picker>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="d-flex flex-row justify-space-between">
        <div>
          <v-btn text v-if="canReset === true" @click="clear">重置</v-btn>
          <v-btn text @click="cancel">取消</v-btn>
        </div>
        <v-btn color="primary" text @click="sure">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  data() {
    return {
      color: "#fff0",
      visible: false
    };
  },
  watch: {
    model: {
      handler(value) {
        this.color = value;
      },
      immediate: true
    },
    value() {
      this.color = this.value || "#fff";
    }
  },
  props: {
    canReset:Boolean,
    canvasHeight: Number,
    dark: Boolean,
    disabled: Boolean,
    hideCanvas: Boolean,
    hideInputs: Boolean,
    hideModeSwitch: Boolean,
    showSwatches: Boolean,
    swatchesMaxHeight:{

    }
  },
  // props: {
  // value: {
  //   type: String,
  //   default: ""
  // },
  // disabled: Boolean,
  // showSwatches: Boolean,
  // swatchesMaxHeight: Number,
  // width: Number,
  // canvasHeight: Number
  // },
  methods: {
    sure() {
      this.$emit("input", this.color.hexa || this.color);
      this.$emit("change", this.color.hexa || this.color);
      this.visible = false;
    },

    cancel() {
      this.$emit("cancel");
      this.visible = false;
    },

    clear() {
      this.$emit("reset");
      // this.$emit('change', undefined)
      this.visible = false;
    }
  }
};
</script>
