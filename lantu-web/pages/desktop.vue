<template>
  <section class="d-flex flex-column flex-grow-1">
    <div class="d-flex flex-row flex-grow-1" style="height:0">
      <div
        style="width:300px;max-width:300px;min-width:300px; box-shadow: 3px 0 12px 3px #9993;"
        class="grey lighten-4 d-flex flex-column align-center flex-grow-1 pa-0"
      >
        <div class="logo dark ma-4" @click="$router.push('/')">
          <label>蓝图巴巴</label>
        </div>
        <!-- <v-divider /> -->
        <div class="ma-4">
          <limiter
            v-if="summary"
            :rules="[{code:'PUBLIC_FILE',value:summary.publicFile},{code:'PRIVATE_FILE',value:summary.privateFile}]"
          >
            <template v-slot:activator="{on:limiter,intercepted}">
              <v-menu bottom offset-y>
                <template v-slot:activator="{on}">
                  <v-btn
                    v-on="on"
                    @click="!intercepted && create()"
                    large
                    depressed
                    block
                    rounded
                    color="primary"
                    class="colorful"
                  >
                    <v-icon class="mr-2">mdi-plus</v-icon>创建蓝图
                  </v-btn>
                </template>

                <!-- <v-list>
                  <v-list-item
                    v-for="map in maps"
                    :key="map.objectId"
                    v-on="limiter"
                    @click="!intercepted && createFile(map)"
                  >
                    <v-list-item-avatar>
                      <v-icon>{{map.icon}}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>{{map.label}}</v-list-item-content>
                  </v-list-item>
                </v-list>-->
              </v-menu>
            </template>
          </limiter>
        </div>
        <div style="overflow-y:auto">
          <v-list color="grey lighten-4" width="300">
            <v-subheader>
              <div class="flex-grow-1 d-flex flex-row align-center">
                <label>文件夹</label>
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn color="secondary" text icon v-on="on" @click="createFolder">
                      <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>创建文件夹</span>
                </v-tooltip>
              </div>
            </v-subheader>
            <v-list-item-group color="primary">
              <v-list-item
                nuxt
                :to="`/desktop/${folder.objectId}`"
                v-for="(folder,index) in folderList"
                :key="index"
              >
                <v-list-item-icon>
                  <v-icon color="amber" class="mr-2">mdi-folder</v-icon>
                </v-list-item-icon>
                <v-list-item-content>{{folder.name}}</v-list-item-content>
                <v-list-item-action>
                  <v-menu offset-y>
                    <template v-slot:activator="{on:{click}}">
                      <v-btn @click.prevent="click" icon max-width="32" max-height="32">
                        <v-icon color="grey">mdi-menu</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="rename(folder)">
                        <v-list-item-icon>
                          <v-icon class="colorful">mdi-folder-edit-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>重命名</v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="remove(folder)">
                        <v-list-item-icon>
                          <v-icon  class="colorful"> mdi-folder-remove-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>删除</v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
               <v-list-item nuxt to="/desktop/favorite">
                <v-list-item-icon>
                  <v-icon color="red" class="mr-2">mdi-star</v-icon>
                </v-list-item-icon>
                <v-list-item-content>我的收藏</v-list-item-content>
              </v-list-item>
              <v-list-item nuxt to="/desktop/recycle">
                <v-list-item-icon>
                  <v-icon color="indigo" class="mr-2">mdi-trash-can</v-icon>
                </v-list-item-icon>
                <v-list-item-content>回收站</v-list-item-content>
              </v-list-item>
              <!-- <v-list-item nuxt to="/welcome/mine">
                  <v-icon class="mr-2">mdi-file-document</v-icon>全部作品
                </v-list-item>
                <v-list-item nuxt to="/welcome/share">
                  <v-icon class="mr-2">mdi-share</v-icon>公开的作品
                </v-list-item>
                <v-list-item nuxt to="/welcome/private">
                  <v-icon class="mr-2">mdi-shield-account</v-icon>私有的作品
                </v-list-item>
                <v-list-item nuxt to="/welcome/team">
                  <v-icon color class="mr-2">mdi-star</v-icon>收藏的作品
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item nuxt to="/welcome/recycle">
                  <v-icon color class="mr-2">mdi-trash-can</v-icon>回收站
              </v-list-item>-->
            </v-list-item-group>
          </v-list>
        </div>
      </div>
      <div class="list d-flex flex-column flex-grow-1 justify-stretch pa-4" style="overflow-y:auto">
        <div class="d-flex flex-row justify-space-between mx-4 mb-4">
          <v-text-field
            class="flex-grow-1"
            style="max-width:480px;"
            label="搜索标题/文件夹名称"
            filled
            clearable
            hide-details
            @click:append-outer="search"
            @keydown.enter="search"
            @click:clear="cancelSearch"
            rounded
            v-model="keyword"
          >
            <template slot="label">
              输入名称搜索文件/文件夹
              <v-icon>mdi-file-find</v-icon>
            </template>
          </v-text-field>
          <user-avatar style="width:45px;height:45px"></user-avatar>
        </div>

        <v-alert color="grey lighten-4" class="mx-4 my-0" v-if="user && !user.emailVerified ">
          <div class="d-flex flex-row justify-space-between align-center">
            <div>
              <v-icon class="mx-2 colorful">mdi-alert-circle</v-icon>您的邮箱还没有验证成功，为了您账户的安全，请到收件箱中查收邮件并进行相关操作
            </div>
            <div>
              <v-btn class="ml-6" rounded color="white" depressed @click="resend">重发验证邮件</v-btn>
            </div>
          </div>
        </v-alert>
        <nuxt-child class="flex-grow-1"></nuxt-child>
        <v-divider />
        <!-- <foot :dark="false"/> -->
      </div>
      <create-modal ref="createModal" :parent="folderId" v-if="folderId"></create-modal>
    </div>
  </section>
</template>
<script>
import Parse from "parse";
import UserAvatar from "~/components/UserAvatar";
import CreateModal from "~/components/file-creator";
import { mapGetters } from "vuex";
import Limiter from "../components/Limiter";
import _ from "lodash";

export default {
  middleware: "user",
  components: {
    UserAvatar,
    CreateModal,
    Limiter
  },
  head() {
    return {
      title: "我的蓝图"
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
      folderId: "works/folderId",
      summary: "system/summary"
    })
  },
  activated() {},
  created() {
    this.$store.dispatch("works/getFolders");
  },
  data() {
    return {
      keyword: null
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
        parentId: this.folderId
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
            this.$validate("isLength", { min: 3, max: 28 })
          ]
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
          parentId: this.folderId
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
        title: "警告"
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
            this.$validate("isLength", { min: 3, max: 28 })
          ]
        });
      } catch (error) {
        //this.$catch(error);
      }

      if (newly) {
        this.loading = true;

        try {
          this.$store.dispatch("works/update", {
            id: objectId,
            name: newly
          });
        } catch (error) {
          //this.$catch(error);
        } finally {
          this.loading = false;
        }
      }
    }
  }
};
</script>

