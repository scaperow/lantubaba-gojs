<template>
  <v-app>
    <v-navigation-drawer class="blue-grey lighten-5" v-model="drawer" app>
      <v-sheet class="pa-4 blue-grey lighten-5">
        <div class="logo dark ma-4" @click="$router.push('/')">
          <label>蓝图巴巴</label>
        </div>
        <div class="pa-2 text-center">
          <v-btn
            rounded
            outlined
            depressed
            color="primary"
            x-large
            @click="create()"
          >
            <v-icon>mdi mdi-plus</v-icon>
            新建</v-btn
          >
        </div>
      </v-sheet>

      <v-list>
        <v-list-item-group color="blue darken-4">
          <v-list-item nuxt to="/desktop/mine">
            <v-list-item-icon>
              <v-icon color="gray" class="mr-2">mdi-file</v-icon>
            </v-list-item-icon>
            <v-list-item-content>我的文件</v-list-item-content>
          </v-list-item>
          <v-list-item nuxt to="/desktop/favorite">
            <v-list-item-icon>
              <v-icon color="gray" class="mr-2">mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-content>我的收藏</v-list-item-content>
          </v-list-item>
          <v-list-item nuxt to="/desktop/recycle">
            <v-list-item-icon>
              <v-icon color="gray" class="mr-2">mdi-trash-can</v-icon>
            </v-list-item-icon>
            <v-list-item-content>回收站</v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-4 d-flex flex-column" style="height: 100vh">
        <div class="d-flex flex-row justify-space-between">
          <v-text-field
            class="flex-grow-1"
            style="max-width: 480px"
            label="搜索标题/文件夹名称"
            rounded
            filled
            clearable
            hide-details
            @click:append-outer="search"
            @keydown.enter="search"
            @click:clear="cancelSearch"
            v-model="keyword"
          >
            <slot name="label">
              输入名称搜索文件/文件夹
              <v-icon>mdi-file-find</v-icon>
            </slot>
          </v-text-field>
          <user-avatar style="width: 45px; height: 45px"></user-avatar>
        </div>
        <nuxt-child class="flex-grow-1"></nuxt-child>
      </v-container>
    </v-main>
    <create-modal ref="createModal"></create-modal>
  </v-app>
</template>
<script>
import UserAvatar from "~/components/UserAvatar";
import CreateModal from "~/components/FileCreator";
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  middleware: "user",
  components: {
    UserAvatar,
    CreateModal,
  },
  head() {
    return {
      title: "我的蓝图",
    };
  },
  computed: {
    stateParams() {
      return {};
    },
    ...mapGetters({
      searchList: "works/searchList",
      folderList: "works/folders",
      user: "user/user",
      summary: "system/summary",
      currentFolder: "works/currentFolder",
    }),
  },
  activated() {},
  created() {
    // this.$store.dispatch("works/getFolders");
  },
  data() {
    return {
      keyword: null,
    };
  },
  methods: {
    resend() {
      var success = false;
      try {
        var user = Parse.User.current();
        user.set("email", user.get("email"));
        user.save();

        success = true;
      } catch (error) {
        console.log(error);
        this.$catch(error);
      }

      if (success) {
        this.$overlay.notify.success("邮件已发送");
      }
    },
    cancelSearch() {
      if (this.$route.name === "desktop-search") {
        this.$router.go(-1);
      }
    },
    async create() {
      this.$refs.createModal.open();
    },
    async createFile({ name, label, style, raw }) {
      var newly = null;

      if (_.isEmpty(style)) {
        style = await this.$store.dispatch("style/getPredefine");
      }

      var model = {
        map: name,
        name: `新建${label}`,
        style,
        raw,
        parentId: this.currentFolder.id || 0,
      };

      try {
        newly = await this.$store.dispatch("works/create", model);
      } catch (error) {
        this.$catch(error);
      }

      if (newly) {
        this.$router.push("/map?id=" + newly.id);
      }
    },
    async search() {
      if (this.keyword) {
        if (this.$route.name === "desktop-search") {
          this.$router.replace("/desktop/search?keyword=" + this.keyword);
        } else {
          this.$router.push("/desktop/search?keyword=" + this.keyword);
        }
      }
    },
    async createFolder() {
      var folderName = null;
      try {
        folderName = await this.$overlay.prompt({
          title: "创建文件夹",
          text: "文件夹名称",
          value: "新建文件夹",
          rules: [
            this.$validate("isNotEmpty"),
            this.$validate("isCommonName"),
            this.$validate("isLength", { min: 3, max: 28 }),
          ],
        });

        // folderName = await this.$overly.prompt();
      } catch (error) {
        this.$catch(error);
      }

      if (folderName) {
        this.loading = true;

        let model = {
          name: folderName,
          isFolder: true,
          parentId: this.currentFolder.id || 0,
        };

        try {
          await this.$store.dispatch("works/create", model);
        } catch (error) {
          this.$catch(error);
        } finally {
          this.loading = false;
        }
      }
    },
    async remove(model) {
      var isDelete = false;

      isDelete = await this.$overlay.confirm({
        text: "该操作会将文件夹内的所有内容一并删除, 是否继续?",
        title: "警告",
      });

      if (isDelete) {
        this.loading = true;

        try {
          await this.$store.dispatch("works/removeFolder", model.objectId);
        } catch (error) {
          this.$catch(error);
        } finally {
          this.loading = false;
        }
      }
    },
    async rename({ objectId, name }) {
      var newly = null;

      try {
        newly = await this.$overlay.prompt({
          title: "请输入新名称",
          value: name,
          rules: [
            this.$validate("isNotEmpty"),
            this.$validate("isCommonName"),
            this.$validate("isLength", { min: 3, max: 28 }),
          ],
        });
      } catch (error) {
        //this.$catch(error);
      }

      if (newly) {
        this.loading = true;

        try {
          this.$store.dispatch("works/update", {
            id: objectId,
            name: newly,
          });
        } catch (error) {
          //this.$catch(error);
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-list .v-list-item .v-icon {
  border-radius: 8px;
  background: white;
  padding: 4px;
}

.v-list .v-list-item--active .v-icon {
  border-radius: 16px;
  background: white;
  padding: 12px;
}
</style>
