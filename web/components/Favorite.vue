<template>
  <section class="mine">
    <file-list root-name="我的收藏" :filter="filter" ref="fileList"></file-list>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import ShareModal from "./Share";
import FileList from "./FileList";
import axios from "axios";

const clinet = axios.create();
export default {
  computed: {
    ...mapGetters({
      user: "user/user",
    }),
    currentFolder() {
      return _.last(this.folderPath);
    },
  },
  components: {
    ShareModal,
    FileList,
  },
  data() {
    return {
      filter: null,
    };
  },
  created() {
    this.filter = clinet.get("/maps/favorite");
  },
};
</script>
<style lang="scss" scoped></style>
