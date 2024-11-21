<template>
  <div ref="scroll">
    <template v-if="loading">
      <slot name="loading">
        <v-icon :dark="dark" size="48" :color="loadingColor">mdi-loading mdi-spin</v-icon>
      </slot>
    </template>
    <template v-else-if="hasMore">
      <v-btn :dark="dark" variant="tonal" size="small" @click="start">加载更多</v-btn>
    </template>
    <template v-else-if="!hasMore">
      <slot name="empty"></slot>
    </template>
  </div>
</template>
<script setup>
import _ from "lodash";
const scroll = ref("scroll");
const props = defineProps({
  loading: {
    default: false,
  },
  hasMore: {
    default: true,
  },
  showPlaceholder: {
    default: false,
  },
  target: {
    default() {
      return window;
    },
  },
  dark: { default: false },
  loadingColor: { default: "primary" },
});
watchEffect((value, oldValue) => {
  if (props.target.value) {
    value.addEventListener("scroll", check, false);
  }

  if (oldValue) {
    oldValue.removeEventListener("scroll", check, false);
  }
});
const isScrolledIntoView = (el) => {
  if (el) {
    var top = el.getBoundingClientRect().top;
    var bottom = el.parentElement === window ? window.innerHeight : el.parentElement.getBoundingClientRect().bottom;
    return top - bottom <= 0;
  }
};
const check = _.debounce(function () {
  if (props.hasMore.value && isScrolledIntoView(scroll.value)) {
    start();
  }
}, 500);

onBeforeUnmount(() => {
  if (props.target) {
    props.target.removeEventListener("scroll", check, false);
  }
});
</script>
