<template>
  <div class="d-flex flex-grow-1 flex-column ">
    <v-chip class="ml-4 pa-2 align-self-start" dark color="dark">
      搜索
      <i>{{keyword}}</i>
      <v-btn
        color="primary"
        class="ml-2"
        dark
        rounded
        x-small
        @click="$router.replace('/desktop')"
      >关闭</v-btn>
    </v-chip>
    <file-list :root-name="`搜索 '${keyword}'`">
      <template slot="empty">
        <v-icon size="48" color="primary">mdi-file-find</v-icon>
        <div>没有搜索到任何内容 ~</div>
      </template>
    </file-list>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import FileList from "~/components/FileList";
import _ from "lodash";

export default {
  middleware: "user",
  computed: {
    ...mapGetters({
      user: "user/user"
    }),
    keyword() {
      return this.$route.query.keyword;
    }
  },
  watch: {
    keyword() {
      if (!_.isEmpty(this.keyword)) {
        this.$store.dispatch("works/search", {
          keyword: this.keyword
        });
      }
    }
  },
  components: {
    FileList
  },
  activated() {}
};
</script>
<style lang="scss" scoped>
</style>



