<template>
  <div ref="scroll">
    <slot name="loading" v-if="isLoading">
      <v-icon :dark="dark" size="48" :color="loadingColor">mdi-loading mdi-spin</v-icon>
    </slot>
    <template v-else>
      <template v-if="hasMore === false">
        {{triggerTimes}}
        <slot name="empty" v-if="triggerTimes === 0">没有内容</slot>
        <slot name="finish" v-else>没有更多了</slot>
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
  data() {
    return {
      isLoading: false,
      hasMore: false,
      triggerTimes: 0
    };
  },
  props: {
    immediate: {
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
  mounted() {
    if (this.immediate === true) {
      this.isLoading = true;

      var waiting = new Promise((resolve, reject) => {
        this.$emit("start", {
          resolve,
          reject
        });
      });

      waiting.then(
        () => {
          this.triggerTimes += 1;
          this.hasMore = true;
        },
        () => {
          this.hasMore = false;
        }
      );

      waiting.finally(() => {
        this.isLoading = false;
        this.target.addEventListener("scroll", this.check, false);
      });

      return waiting;
    }
  },
  methods: {
    async start() {
      // if (!this.target || !this.hasMore || this.isLoading) {
      //   return;
      // }
      if (!this.isLoading) {
        var waiting = new Promise((resolve, reject) => {
          this.target.removeEventListener("scroll", this.check);
          this.isLoading = true;
          this.$emit("start", {
            resolve,
            reject
          });
        });

        waiting.then(
          () => {
            this.triggerTimes += 1;
          },
          () => {
            this.hasMore = false;
          }
        );

        waiting.finally(() => {
          this.isLoading = false;
          this.target.addEventListener("scroll", this.check, false);
        });

        return waiting;
      }
    },
    check: _.debounce(function() {
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