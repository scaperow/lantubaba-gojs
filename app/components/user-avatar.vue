<template>
  <section style="cursor: pointer; background: transparent" :style="`width:${width}px;height:${height}px`">
    <v-menu v-if="user" :close-on-content-click="false" :nudge-width="200" offset-y>
      <template v-slot:activator="{ on }">
        <v-badge :value="user && !user.emailVerified ? 1 : 0" bordered color="warning" icon="mdi-lock" overlap>
          <v-avatar :width="width" :height="height" v-ripple v-on="on" color="blue-grey">
            <v-img v-if="user.avatar" class="avatar" :src="user.avatar" />
            <v-icon v-else color="white">mdi-account</v-icon>
          </v-avatar>
        </v-badge>
      </template>
      <v-card min-width="320" max-width="560">
        <div class="d-flex flex-row justify-space-between flex-grow-1 pa-6">
          <label>欢迎使用, {{ user.name || user.mail }}</label>
          <v-chip small :color="userPlane.color" dark>{{ userPlane.label }}</v-chip>
        </div>
        <v-card-text>
          <v-alert text outlined type="warning" v-if="user && !user.emailVerified"
            ><div>您的邮箱还没有验证成功，为了您账户的安全，请到收件箱中查收邮件并进行相关操作</div>
            <v-btn class="mt-2" outlined color="primary" @click="resend">重发验证邮件</v-btn>
          </v-alert>
          <v-list class="grey lighten-4">
            <v-list-item @click="$router.push('/desktop')" title="我的蓝图"> </v-list-item>
            <v-divider class="ml-6 mr-6" />
            <!-- <v-list-item @click="$router.push('/personal?action=order')">
              <v-list-item-content>我的订单</v-list-item-content>
            </v-list-item> -->
            <v-list-item nuxt to="/personal?action=basic" title="个人信息"> </v-list-item>
            <v-list-item nuxt to="/personal?action=password" title="修改密码"> </v-list-item>
            <v-divider class="ml-6 mr-6" />
            <v-list-item @click="sigout" title="退出登录"></v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-avatar :width="width" :height="height" v-else v-ripple color="blue-grey" @click="$router.push('/login')">
      <v-icon color="white">mdi-account</v-icon>
    </v-avatar>
  </section>
</template>
<script setup>
import { useUserStore } from "~~/stores/user";
defineProps({
  width: {
    type: Number,
    default: 48,
  },
  height: {
    type: Number,
    default: 48,
  },
});

const mineRules = ref({
  username: {
    type: String,
    min: 3,
    max: 24,
    pattern: "[a-Z0-9]",
  },
});
const store = useUserStore();
const { user } = store;
const showUserSetting = ref(false);
const mineSource = ref(null);
const mineModel = ref(null);
const isMineModal = ref(false);
const newAvatar = async () => {
  // const avatar = await Parse.Cloud.run("makeAvatar");
  // this.$store.dispatch("user/updateAvatar", avatar);
};
const sigout = async () => {
  await store.$patch({ user: null });
  this.$router.push("/login");
};
const verifyEmail = () => {};
const systemSetting = () => {};
const saveMine = () => {};
const changePassword = async () => {
  var email = this.mineModel.email;
  try {
    await Parse.User.requestPasswordReset(email);

    this.$overlay.message({
      message: `修改链接已发送到您的邮箱(${email})，请从邮件中修改`,
      type: "success",
    });
  } catch (error) {
    this.$catch(error);
  }
};
const onCommand = (command) => {
  switch (command) {
    case "USER_SETTING":
      this.showUserSetting = true;
      break;

    case "SYSTEM_SETTING":
      break;
  }
};
</script>
