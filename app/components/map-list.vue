<template>
  <div class="file-list d-flex flex-column flex-grow-1">
    <div class="d-flex flex-row flex-grow-1 flex-wrap justify-center justify-md-start align-content-start">
      <v-fade-transition group mode="out-in">
        <div v-for="(map, index) in folder.maps" :key="map.id">
          <document-item
            :key="map.id"
            :model="map"
            @check="check(map)"
            @open="open(map.id, index)"
            @rename="rename(map, index)"
            @remove="remove(map, index)"
            @share="share(map.objectId)"
            @remove_forever="removeForever(map, index)"
            @recovery="recovery(map)"
            @move_to="moveTo(map)"
            @copy_to="copyTo(map)"
            @copy="copyTo(map, true)"
            @change_accessibility="changeAccessibility(map)"
          ></document-item>
        </div>
      </v-fade-transition>
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
    <!-- <ShareModal ref="shareModal"></ShareModal> -->
    <!-- <FolderSelect ref="folderSelect" :multiple="false"></FolderSelect>
    <FolderSelect ref="folderManySelect" :multiple="true"></FolderSelect> -->
  </div>
</template>
<script setup>
// import ShareModal from "./Share";
// import CreateModal from "./FileCreator";
// import FolderSelect from "./FolderSelect";
import { storeToRefs } from "pinia";
import DocumentItem from "./document-item";
import { last, isEmpty, map, first } from "lodash";
import { useUserStore } from "~~/stores/user";
import { useWorksStore } from "~~/stores/works";

const { folder } = storeToRefs(useWorksStore());

const isSavingPassword = false;
const pageIndex = ref(0);
const pageSize = ref(10);
const worksTotal = ref(0);
const loading = ref(false);
const isCreating = ref(false);
const isSharing = ref(false);
const checkIds = ref([]);
const { push } = useRouter();

defineProps({
  props: {
    rootName: String,
  },
});
const open = (id) => {
  push("/map/" + id);
};
const check = (workItem) => {
  workItem.checked = !workItem.checked;
  // if (this.checkIds.includes(id)) {
  //   this.checkIds = pull(this.checkIds, id);
  // } else {
  //   this.checkIds.push(id);
  // }
};
const changeAccessibility = async (file) => {
  try {
    // await this.$store.dispatch("works/update", {
    //   id: file.objectId,
    //   isPrivate: file.isPrivate ? false : true,
    // });
  } catch (error) {
    // this.$catch(error);
  }
};
const copyTo = async (file) => {
  // var folders = [];
  // try {
  //   folders = await this.$refs.folderManySelect.open();
  // } catch (error) {
  //   folders = null;
  // }
  // if (!isEmpty(folders)) {
  //   try {
  //     this.$store.dispatch("works/copy", {
  //       fileId: file.objectId,
  //       folderIds: map(folders, (folder) => folder && folder.objectId),
  //     });
  //   } catch (error) {
  //     this.$catch(error);
  //   }
  // }
};
const moveTo = async (workItem) => {
  // var folders = [];
  // var folder = null;
  // try {
  //   folders = await this.$refs.folderSelect.open();
  //   folder = first(folders);
  // } catch (error) {
  //   folders = null;
  // }
  // if (!isEmpty(folder)) {
  //   try {
  //     this.$store.dispatch("works/move", {
  //       fileId: workItem.objectId,
  //       folderId: folder.objectId,
  //     });
  //   } catch (error) {
  //     this.$catch(error);
  //   }
  // }
};
const onCreate = ({ id }) => {
  // this.$router.push({
  //   name: "map",
  //   params: {
  //     id,
  //   },
  // });
};
const share = async (id) => {
  // this.$refs.shareModal.open(id);
};
const rename = async ({ objectId, name }) => {
  // var newly = null;
  // try {
  //   newly = await this.$overlay.prompt({
  //     title: "重命名",
  //     text: "新名称",
  //     value: name,
  //     rules: [this.$validate("isNotEmpty"), this.$validate("isCommonName"), this.$validate("isLength", { min: 3, max: 28 })],
  //   });
  // } catch (error) {
  //   this.$catch(error);
  // }
  // if (newly) {
  //   this.loading = true;
  //   try {
  //     this.$store.dispatch("works/update", {
  //       id: objectId,
  //       name: newly,
  //     });
  //   } catch (error) {
  //     this.$catch(error);
  //   } finally {
  //     this.loading = false;
  //   }
  // }
};
const remove = async (model) => {
  // var isDelete = false;
  // if (model.isFolder === true) {
  //   isDelete = await this.$overlay.confirm({
  //     text: "该操作会将文件夹内的所有内容一并删除, 是否继续?",
  //     confirmButtonText: "是",
  //     cancelButtonText: "否",
  //   });
  // } else {
  //   isDelete = await this.$overlay.confirm({
  //     text: "是否确认删除?",
  //     confirmButtonText: "是",
  //     cancelButtonText: "否",
  //   });
  // }
  // if (isDelete) {
  //   this.loading = true;
  //   try {
  //     await this.$store.dispatch("works/remove", [model.id]);
  //   } catch (error) {
  //     this.$catch(error);
  //   } finally {
  //     this.loading = false;
  //   }
  // }
};
const removeForever = async (model) => {
  // this.$overlay
  //   .confirm("删除后将无法恢复, 是否继续?", null, {
  //     confirmButtonText: "是",
  //     cancelButtonText: "否",
  //   })
  //   .then(async () => {
  //     this.loading = true;
  //     try {
  //       await this.$store.dispatch("works/remove", model.objectId);
  //     } catch (error) {
  //       this.$catch(error);
  //     } finally {
  //       this.loading = false;
  //     }
  //   });
};
const recovery = async (model) => {
  // this.loading = true;
  // try {
  //   await this.$store.dispatch("works/recovery", model.objectId);
  // } catch (error) {
  //   this.$catch(error);
  // } finally {
  //   this.loading = false;
  // }
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
