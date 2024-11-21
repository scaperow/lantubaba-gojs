<template>
  <div ref="scroll">
    <slot name="loading" v-if="loading">
      <v-icon :dark="dark" size="48" :color="loadingColor">mdi-loading mdi-spin</v-icon>
    </slot>
    <template v-else>
      <template v-if="hasMore === false">
        <slot name="finish" v-if="index > 0 || count > 0">
          <v-divider></v-divider>
          <h6 class="blue-grey--text text--lighten-2">没有更多了</h6>
        </slot>
        <slot name="empty" class="blue-grey--text text--lighten-2"  v-else>没有内容</slot>
      </template>
      <slot name="trigger" v-else>
        <v-btn :dark="dark" outlined rounded @click="start">加载更多</v-btn>
      </slot>
    </template>
  </div>
</template>
<script>
import _ from "lodash";
function isScrolledIntoView(el) {
  if (el) {
    var top = el.getBoundingClientRect().top;
    var bottom =
      el.parentElement === window
        ? window.innerHeight
        : el.parentElement.getBoundingClientRect().bottom;
    return top - bottom <= 0;
  }
}
export default {
  props: {
    index: {
      default: -1
    },
    count: {
      default: 0
    },
    loading: {
      default: false
    },
    hasMore: {
      default: true
    },
    target: {
      default() {
        return window;
      }
    },
    dark: { default: false },
    loadingColor: { default: "primary" }
  },
  watch: {
    target: {
      handler(value, old) {
        if (value) {
          value.addEventListener("scroll", this.check, false);
        }

        if (old) {
          old.removeEventListener("scroll", this.check, false);
        }
      }
    }
  },
  methods: {
    check: _.debounce(function () {
      if (this.hasMore && isScrolledIntoView(this.$refs.scroll)) {
        this.start();
      }
    }, 500)
  },
  beforeDestroy() {
    if (this.target) {
      this.target.removeEventListener("scroll", this.check, false);
    }
  }
};
</script>
