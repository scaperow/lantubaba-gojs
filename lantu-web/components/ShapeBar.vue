<template>
  <section class="shape-bar" style="overflow-y:auto" v-if="categories">

    <organization-list
      :category="cat.value"
      v-for="(cat,index) in categories"
      :key="index"
      v-show="cat.value === category"
    ></organization-list>
  </section>
</template>

<script>
import OrganizationList from "./Organization";

export default {
  components: {
    OrganizationList
  },
  props: {
    categories: {
      type: Array,
      default() {
        return [];
      }
    },
    category: {
      required: true,
      type: String
    }
  }
};
</script>

<style lang="scss" >
@import "~/assets/variables.scss";
section.shape-bar {
  // .content {
  //   background: #fff;
  //   border-radius: 16px;
  // }
  // .v-expansion-panel-header {
  //   border-radius: 0 !important;
  // }

  .v-expansion-panel-content__wrap {
    padding: 0 !important;
  }

  // .v-expansion-panels {
  //   border-radius: 14px !important;
  // }

  // .v-expansion-panel--active {
  //   border-radius: 14px !important;
  // }
}
</style>




