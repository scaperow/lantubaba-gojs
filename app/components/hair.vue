<template>
  <v-toolbar max-height="80" height="80" tile flat width="100%" :color="color" :dark="dark">
    <v-toolbar-title>
      <div class="logo" @click="$router.push('/')">蓝图巴巴</div>
      <slot name="title"></slot>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <slot></slot>

    <v-btn v-if="!onlyLogo" text large nuxt to="/square">广场</v-btn>
    <v-btn v-if="!onlyLogo && user" text large nuxt to="/desktop">我的蓝图</v-btn>
    <v-btn v-if="!onlyLogo && !user" text large nuxt to="/login">登录</v-btn>
    <v-btn v-if="!onlyLogo && !user" text large nuxt to="/login">注册</v-btn>
    <!-- <v-btn v-if="!onlyLogo" text nuxt large to="/price">价格</v-btn> -->

    <user-avatar class="ml-6" v-if="user"></user-avatar>
  </v-toolbar>
</template>
<script setup>
const { push } = useRouter();
const props = defineProps({
  onlyLogo: false,
  color: {
    default: "transparent",
  },
  dark: {
    default: true,
  },
});

const clickMenu = (command) => {
  this.$options.methods[command].apply(this);
};

const start = () => {
  if (this.user) {
    push({ path: "/desktop" });
  } else {
    push({ path: "/login" });
  }
};

const sigup = () => {};
const sigin = () => {};
const sigout = async () => {
  await this.$store.dispatch("user/logout");
  push({ name: "login" });
};
</script>
