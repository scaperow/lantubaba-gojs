<template>
  <section class="recycle d-flex flex-grow-1 flex-column">
    <!-- <div style="margin-bottom:16px">
      <v-btn color="primary"
             @click="checkAll"
             v-show="list.length > 0"
             text><i class="iconfont icon-plus"></i> 全选</v-btn>

      <v-btn v-show="selection.length > 0"
             @click="removeSelection"
             text><i class="iconfont icon-clear"></i> 彻底删除</v-btn>
      <v-btn v-show="selection.length > 0"
             @click="recoverySelection"
             text><i class="iconfont icon-revert"></i> 还原</v-btn>
    </div>-->
    <div class="mx-4">
      <v-btn outlined rounded color="primary" @click="clearRecycle">
        <v-icon class="colorful">mdi-delete-forever</v-icon>清空回收站
      </v-btn>
    </div>

    <file-list
      :show-breadcrumbs="false"
      :allow-create-folder="false"
      root-name="回收站"
      ref="fileList"
    >
      <template slot="foot">
        <more ref="loader" @start="fetch" :total="count" :index="index" :size="size">
          <div slot="empty" class="text-center grey--text">
            <v-icon class="colorful" size="48">mdi-delete-empty</v-icon>
            <div>回收站非常干净</div>
          </div>
        </more>
      </template>
    </file-list>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import FileList from "~/components/FileList";
import More from "../../components/More";

export default {
  computed: {
    ...mapGetters({
      user: "user/user",
      list: "works/list",
      count: "works/count"
    })
  },
  components: {
    FileList,
    More
  },
  data() {
    return { index: 0, size: 20 };
  },
  watch: {},
  methods: {
    async clearRecycle() {
      try {
        await this.$overlay.confirm({
          text: "永久删除回收站中的文件，且无法恢复，是否继续?"
        });

        this.$store.dispatch("works/clearRecycle");
      } catch (error) {
        console.error(error);
      }
    },
    async fetch({ resolve, reject } = {}) {
      try {
        this.$store.dispatch("works/getRecycleList", {
          index: this.index++,
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
    // removeSelection () {
    //   this.$confirm(`确认要删除选中的 ${this.selection.length} 项吗? 删除后将无法恢复, 是否继续?`, null, {
    //     confirmButtonText: '是',
    //     cancelButtonText: '否'
    //   }).then(async () => {
    //     this.loading = true
    //     try {
    //       await this.$store.dispatch('works/remove', this.selection)
    //     } catch (error) {
    //       this.$catch(error)
    //     } finally {
    //       this.loading = false
    //     }
    //   })
    // },
    // recoverySelection () {
    //   this.$confirm(`是否要还原选中的 ${this.selection.length} 项吗? `, null, {
    //     confirmButtonText: '是',
    //     cancelButtonText: '否'
    //   }).then(async () => {
    //     this.loading = true
    //     try {
    //       await this.$store.dispatch('works/recovery', this.selection)
    //     } catch (error) {
    //       this.$catch(error)
    //     } finally {
    //       this.loading = false
    //     }
    //   })
    // },
    // check (model) {
    //   let index = _.indexOf(this.selection, model.objectId)
    //   if (index > -1) {
    //     this.selection.splice(index, 1)
    //   } else {
    //     this.selection = [...this.selection, model.objectId]
    //   }
    // },
    // checkAll () {
    //   this.selection = _.map(this.list, (workItem) => {
    //     return workItem.objectId
    //   })
    // }
  }
};
</script>
<style lang="scss" scoped>
@import "~/assets/variables.scss";
section.recycle {
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



