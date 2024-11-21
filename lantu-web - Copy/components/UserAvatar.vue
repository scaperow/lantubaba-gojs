<template>
  <section
    style="cursor:pointer;background:transparent"
    :style="`width:${width}px;height:${height}px`"
  >
    <v-menu v-if="user" :close-on-content-click="false" :nudge-width="200" offset-y>
      <template v-slot:activator="{ on }">
        <v-avatar :width="width" :height="height" v-ripple v-on="on" color="blue-grey">
          <v-img v-if=" user.avatar" class="avatar" :src="user.avatar" />
          <v-icon v-else color="white">mdi-account</v-icon>
        </v-avatar>
      </template>
      <v-card min-width="320">
        <div class="d-flex flex-row justify-space-between flex-grow-1 pa-6">
          <label>欢迎使用, {{user.username || user.email}}</label>
          <v-chip small :color="userPlane.color" dark>{{userPlane.label}}</v-chip>
        </div>
        <v-card-text>
          <v-list class="grey lighten-4">
            <v-list-item @click="$router.push('/desktop')">
              <v-list-item-content>我的蓝图</v-list-item-content>
            </v-list-item>
            <v-divider class="ml-6 mr-6" />
            <!-- <v-list-item @click="$router.push('/personal?action=order')">
              <v-list-item-content>我的订单</v-list-item-content>
            </v-list-item> -->
            <v-list-item nuxt to="/personal?action=basic">
              <v-list-item-content>个人信息</v-list-item-content>
            </v-list-item>
            <v-list-item nuxt to="/personal?action=password">
              <v-list-item-content>修改密码</v-list-item-content>
            </v-list-item>
            <v-divider class="ml-6 mr-6" />
            <v-list-item @click="sigout">退出登录</v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-avatar
      :width="width"
      :height="height"
      v-else
      v-ripple
      color="blue-grey"
      @click="$router.push('/login')"
    >
      <v-icon color="white">mdi-account</v-icon>
    </v-avatar>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import Parse from "parse";
export default {
  data() {
    return {
      mineRules: {
        username: {
          type: String,
          min: 3,
          max: 24,
          pattern: "[a-Z0-9]"
        }
      },
      showUserSetting: false,
      mineSource: null,
      mineModel: null,
      isMineModal: false
    };
  },
  props: {
    width: {
      type: Number,
      default: 48
    },
    height: {
      type: Number,
      default: 48
    }
  },
  computed: {
    ...mapGetters({
      user: "user/user",
      userPlane: "user/plane"
    })
  },
  methods: {
    async newAvatar() {
      const avatar = await Parse.Cloud.run("makeAvatar");
      this.$store.dispatch("user/updateAvatar", avatar);
    },
    async sigout() {
      await this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
    verifyEmail() {},
    systemSetting() {},
    saveMine() {},
    async changePassword() {
      var email = this.mineModel.email;
      try {
        await Parse.User.requestPasswordReset(email);

        this.$overlay.message({
          message: `修改链接已发送到您的邮箱(${email})，请从邮件中修改`,
          type: "success"
        });
      } catch (error) {
        this.$catch(error);
      }
    },
    onCommand(command) {
      switch (command) {
        case "USER_SETTING":
          this.showUserSetting = true;
          break;

        case "SYSTEM_SETTING":
          break;
      }
    }
  }
};
</script>

