<template>
  <section class="file-list d-flex flex-column flex-grow-1">
    <div
      class="d-flex flex-row flex-grow-1 flex-wrap justify-center justify-md-start align-content-start"
      v-if="list && list.length > 0"
    >
      <div v-for="(workItem,index) in list" :key="index" class="animated fadeIn">
        <slot name="card" v-bind="{model:workItem, index:index}">
          <component
            :is="workItem.isFolder ? 'folder-item':'document-item'"
            :model="workItem"
            @open="open(workItem.objectId,index)"
            @rename="rename(workItem,index)"
            @remove="remove(workItem,index)"
            @share="share(workItem.objectId)"
            @remove_forever="removeForever(workItem,index)"
            @recovery="recovery(workItem)"
            @move_to="moveTo(workItem)"
            @copy_to="copyTo(workItem)"
            @copy="copyTo(workItem,true)"
            @change_accessibility="changeAccessibility(workItem)"
          />
        </slot>
      </div>
    </div>

    <!-- <div class="d-flex flex-grow-1 align-center" v-if="!list || list.length === 0 && !loading">
      <v-card-text class="info--text animated shake fast text-center">
        <slot name="empty">
          <v-icon color="primary" size="48" class="colorful">mdi-file</v-icon>
          <div>此处毫无进展</div>
        </slot>
      </v-card-text>
    </div>-->
    <div class="d-flex flex-grow-1 align-center justify-center">
      <slot name="foot"></slot>
    </div>
    <share-modal ref="shareModal"></share-modal>
    <folder-select ref="folderSelect" :multiple="false"></folder-select>
    <folder-select ref="folderManySelect" :multiple="true"></folder-select>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import ShareModal from "./Share";
import CreateModal from "./FileCreator";
import DocumentItem from "./Document";
import FolderItem from "./FoldCard";
import FolderSelect from "./FolderSelect";
import _ from "lodash";

export default {
  props: {
    showBreadcrumbs: {
      type: Boolean,
      default: true
    },
    allowCreateFolder: {
      type: Boolean,
      default: true
    },
    rootName: String
  },
  computed: {
    ...mapGetters({
      user: "user/user",
      list: "works/list",
      summary: "system/summary"
    })
  },
  components: {
    ShareModal,
    CreateModal,
    DocumentItem,
    FolderItem,
    FolderSelect
  },
  data() {
    return {
      folderName: "新建文件夹",
      isSavingPassword: false,
      pageIndex: 0,
      pageSize: 10,
      worksTotal: 0,
      loading: false,
      isCreating: false,
      isSharing: false
    };
  },
  watch: {},
  methods: {
    getCurrentFolder() {
      return _.last(this.folderPath);
    },
    open(id) {
      this.$router.push("/map?id=" + id);
    },
    async changeAccessibility(file) {
      try {
        await this.$store.dispatch("works/update", {
          id: file.objectId,
          isPrivate: file.isPrivate ? false : true
        });
      } catch (error) {
        this.$catch(error);
      }
    },
    async copyTo(file) {
      var folders = [];

      try {
        folders = await this.$refs.folderManySelect.open();
      } catch (error) {
        folders = null;
      }

      if (!_.isEmpty(folders)) {
        try {
          this.$store.dispatch("works/copy", {
            fileId: file.objectId,
            folderIds: _.map(folders, folder => folder && folder.objectId)
          });
        } catch (error) {
          this.$catch(error);
        }
      }
    },
    async moveTo(workItem) {
      var folders = [];
      var folder = null;

      try {
        folders = await this.$refs.folderSelect.open();
        folder = _.first(folders);
      } catch (error) {
        folders = null;
      }

      if (!_.isEmpty(folder)) {
        try {
          this.$store.dispatch("works/move", {
            fileId: workItem.objectId,
            folderId: folder.objectId
          });
        } catch (error) {
          this.$catch(error);
        }
      }
    },
    onCreate({ id }) {
      this.$router.push({
        name: "map",
        params: {
          id
        }
      });
    },
    FileCreator() {
      this.$refs.createModal.open();
    },
    async share(id) {
      this.$refs.shareModal.open(id);
    },
    async rename({ objectId, name }) {
      var newly = null;

      try {
        newly = await this.$overlay.prompt({
          title: "重命名",
          text: "新名称",
          value: name,
          rules: [
            this.$validate("isNotEmpty"),
            this.$validate("isCommonName"),
            this.$validate("isLength", { min: 3, max: 28 })
          ]
        });
      } catch (error) {
        this.$catch(error);
      }

      if (newly) {
        this.loading = true;

        try {
          this.$store.dispatch("works/update", {
            id: objectId,
            name: newly
          });
        } catch (error) {
          this.$catch(error);
        } finally {
          this.loading = false;
        }
      }
    },
    async remove(model) {
      var isDelete = false;

      if (model.isFolder === true) {
        isDelete = await this.$overlay.confirm({
          text: "该操作会将文件夹内的所有内容一并删除, 是否继续?",
          confirmButtonText: "是",
          cancelButtonText: "否"
        });
      } else {
        isDelete = await this.$overlay.confirm({
          text: "是否确认删除?",
          confirmButtonText: "是",
          cancelButtonText: "否"
        });
      }

      if (isDelete) {
        this.loading = true;

        try {
          await this.$store.dispatch("works/remove", model.objectId);
        } catch (error) {
          this.$catch(error);
        } finally {
          this.loading = false;
        }
      }
    },
    async removeForever(model) {
      this.$overlay
        .confirm("删除后将无法恢复, 是否继续?", null, {
          confirmButtonText: "是",
          cancelButtonText: "否"
        })
        .then(async () => {
          this.loading = true;

          try {
            await this.$store.dispatch("works/remove", model.objectId);
          } catch (error) {
            this.$catch(error);
          } finally {
            this.loading = false;
          }
        });
    },
    async recovery(model) {
      this.loading = true;

      try {
        await this.$store.dispatch("works/recovery", model.objectId);
      } catch (error) {
        this.$catch(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~/assets/variables.scss";

section.file-list {
  .v-card {
    margin-right: 12px;
    .v-image {
      transition: all 0.3s;
      cursor: pointer;

      &.document {
        background: #42a5f5;
        &:hover {
          transform: scale(1.2, 1.2);
        }
      }

      &.folder {
        &:hover {
          filter: drop-shadow(5px 5px 10px #ccc);
        }
      }
    }
  }

  .badge__badge {
    .v-icon {
      display: block !important;
    }
  }

  .share {
    padding: 0 16px;
  }
}
</style>



