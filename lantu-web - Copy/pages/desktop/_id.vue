<template>
  <file-list root-name="我的作品" ref="fileList">
    <template slot="foot">
      <more ref="loader" @start="fetch">
        <div slot="empty" class="text-center grey--text">
          <v-icon color="primary" size="48" class="colorful">mdi-file</v-icon>
          <div>此处毫无进展</div>
        </div>
      </more>
    </template>
  </file-list>
</template>
<script>
import FileList from "~/components/FileList";
import More from "../../components/More";
import { mapGetters } from "vuex";

export default {
  middleware: "user",
  computed: {
    folderId() {
      return this.$route.params.id;
    },
    ...mapGetters({
      list: "works/list",
      count: "works/count"
    })
  },
  components: {
    FileList,
    More
  },
  data() {
    return {
      index: 0,
      size: 20
    };
  },
  watch: {
    folderId() {
      if (this.folderId) {
        this.$refs.loader.start();
      }
    }
  },
  methods: {
    async fetch({ resolve, reject } = {}) {
      try {
        await this.$store.dispatch("works/getMineList", {
          folderId: this.folderId,
          index: this.index,
          size: this.size
        });

        if (this.list.length >= this.count) {
          reject && reject();
        } else {
          resolve && resolve();
        }
      } catch (error) {
        this.$catch(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>



