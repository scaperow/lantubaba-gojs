<template>
  <div>
    <v-breadcrumbs :items="routes" divider=">">
      <template v-slot:item="{ item }">
        <v-btn text small @click="linkFolder(item)" :disabled="item.disabled">
          {{ item.text }}
        </v-btn>
      </template>
    </v-breadcrumbs>
    <div v-show="currentOn === 'mine' && folders && folders.length > 0">
      <h6 class="blue-grey--text text--lighten-2">文件夹</h6>
      <folder-item @open="openFolder(folder)" v-for="folder in folders" :key="folder.id" :folder="folder"></folder-item>
    </div>
    <div>
      <h6 class="mt-6 blue-grey--text text--lighten-2">文件</h6>
      <map-list>
        <template slot="foot">
          <more :index="index" :count="maps.length" ref="loader" @start="fetch" :has-more="hasMore" :loading="loading">
            <template slot="empty">
              <div class="text-center" v-if="!loading && index <= 0 && (maps && (maps.length === 0))">
                <div class="icon-backdrop">
                  <v-icon color="primary" class="backdrop">mdi-file</v-icon>
                  <label class="font-weight-black grey--text">没有内容</label>
                </div>
                <v-btn rounded outlined class="mt-6" depressed color="primary" x-large @click="createFile()">
                  <v-icon>mdi mdi-plus</v-icon>
                  新建</v-btn>
                <file-creator ref="fileCreator"></file-creator>
              </div>
            </template>
          </more>
        </template>
      </map-list>
    </div>
  </div>
</template>
<script>
import MapList from "~/components/MapList";
import More from "../../components/More";
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import FileCreator from "../../components/FileCreator.vue";
import FolderItem from "../../components/FolderItem.vue";
import { findIndex } from "lodash";

export default {
  middleware: "user",
  computed: {
    routes() {
      return [{ text: '我的文件', href: '/desktop/' + this.currentOn, id: 0 }, ...(this.folder || []).map((folder) => ({
        text: folder.name,
        id: folder.id,
        href: this.currentOn + "/" + folder.id
      }))];
    },
    currentOnRouter() {
      return this.$route.params.id;
    },
    hasMore() {
      return ((this.index + 1) * this.size) < this.total;
    },
    ...mapState({
      folder: (state) => state.works[state.works.currentOn].folder,
      currentOn: (state) => state.works.currentOn
    }),
    ...mapGetters({
      maps: "works/maps",
      folders: "works/folders",
      size: "works/size",
      index: "works/index",
      total: "works/total"
    }),
  },
  components: {
    MapList,
    More,
    FileCreator,
    FolderItem
  },
  data() {
    return {
      loading: false
    };
  },
  watch: {
    currentOnRouter: {
      immediate: true,
      handler() {
        this.setCurrentOn(this.currentOnRouter);
        if (this.index === -1) {
          this.fetch();
        }
      }
    },
  },
  methods: {
    ...mapMutations({
      setFolder: 'works/SET_FOLDER',
      setCurrentOn: 'works/SET_CURRENTON'
    }),
    ...mapActions({ fetchMaps: 'works/fetchMaps', fetchFolders: 'works/fetchFolders' }),

    async openFolder(folder) {
      this.setFolder([...(this.folder || []), folder]);
      this.fetch();
    },
    async fetch() {
      try {
        this.loading = true;
        await this.fetchMaps({ reset: true });
        await this.fetchFolders({ reset: true });
        // await this.$store.dispatch("works/fetch");

        // resolve();
        // if (this.list.length >= this.count) {
        //   reject && reject();
        // } else {
        //   resolve && resolve();
        // }
      } catch (error) {
        this.$catch(error);
      } finally {
        this.loading = false;
      }
    },
    linkFolder(folder) {
      if (folder.id === 0) {
        this.setFolder([]);
      } else {
        const index = findIndex(this.folder, (f) => f.id === folder.id);
        this.setFolder(this.folder.slice(0, index + 1));
      }
      this.fetch();
    },
    createFile() {
      this.$refs.fileCreator.open();
    },

  },
};
</script>
<style lang="scss" scoped>
ul.v-breadcrumbs {
  padding: 6px;
  margin-bottom: 16px;
  border-left: solid 5px #E3F2FD;
  border-radius: 6px;
  margin-top: 16px;
  margin-bottom: 22px;
}
</style>



