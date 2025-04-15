<template>
  <file-list
    root-name="我的作品"
    ref="fileList"
    :filter="(args)=>$store.dispatch('works/getMineList', args)"
  ></file-list>
</template>
<script>
import { mapGetters } from "vuex";
import FileList from "~/components/FileList";
export default {
  middleware: "user",
  computed: {
    ...mapGetters({
      user: "user/user"
    })
  },
  components: {
    FileList
  },
  data() {
    return {
      filter: null
    };
  },
  created() {},
  activated() {
    this.$refs.fileList.getData();
  }
};
</script>
<style lang="scss" scoped>
</style>



