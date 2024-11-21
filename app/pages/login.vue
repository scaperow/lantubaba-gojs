<template>
  <v-app class="d-flex flex-column justify-space-between align-stretch bg-blue-grey-lighten-5">
    <hair only-logo="true" :dark="false" />
    <div class="d-flex flex-grow-1 flex-column justify-center align-center">
      <v-card min-width="520" class="pa-12 pt-2" outlined>
        <v-tabs class="mt-6" align-tabs="center" icons-and-text v-model="step">
          <v-tab :disabled="isSigining || isSiguping" value="SIGIN">登录</v-tab>
          <v-tab :disabled="isSigining || isSiguping" value="SIGUP">注册</v-tab>
        </v-tabs>
        <v-window v-model="step">
          <v-window-item key="SIGIN" value="SIGIN">
            <v-form @submit.prevent.stop="sigin">
              <v-card-text class="mt-8">
                <v-alert dark color="error" v-show="siginMessage">{{ siginMessage }}</v-alert>
                <v-text-field filled v-model="siginForm.username" label="用户名/邮箱" :rules="siginRules.username"></v-text-field>
                <v-text-field filled type="password" v-model="siginForm.password" label="密码" :rules="siginRules.password"></v-text-field>
              </v-card-text>
              <v-card-actions class="d-flex flex-column">
                <v-btn text nuxt depressed target="_blank" to="/reset">忘记密码 ?</v-btn>
                <v-btn block type="submit" color="primary" depressed :loading="isSigining">登录</v-btn>
              </v-card-actions>
            </v-form>
          </v-window-item>
          <v-window-item key="SIGUP" value="SIGUP">
            <v-form @submit.prevent.stop="sigup">
              <v-card-text class="mt-8">
                <v-alert dark color="error" v-show="sigupMessage">
                  {{ sigupMessage }}
                  <span v-show="isRedirectSigin">
                    或者使用该用户
                    <v-btn outlined rounded @click="step = 'SIGIN'">登录</v-btn>
                  </span>
                </v-alert>
                <v-form>
                  <v-text-field filled label="用户名" v-model="sigupForm.username" :rules="sigupRules.email"></v-text-field>
                  <v-text-field filled type="email" label="邮箱" v-model="sigupForm.email" :rules="sigupRules.email" class="forms_field-input"></v-text-field>
                  <v-text-field filled type="password" v-model="sigupForm.password" :rules="sigupRules.password" label="密码"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex flex-column">
                <v-btn text nuxt to="/"> <v-icon>mdi-arrow-left</v-icon>回到首页 </v-btn>
                <v-btn block type="submit" color="primary" depressed :loading="isSiguping">注册</v-btn>
              </v-card-actions>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
import axios from "axios";
import Hair from "../components/Hair";
import { useUserStore } from "~~/stores/user";

const { siginForm: siginRules, sigupForm: sigupRules } = useValidator();
const { $axios } = useNuxtApp();
const store = useUserStore();
const { params, query } = useRoute();
const http = $axios.create();
const isSigining = ref(false);
const isSiguping = ref(false);
const text = ref("");
const isRedirectSigin = ref(false);
const siginMessage = ref(null);
const sigupMessage = ref(null);
const { go, push } = useRouter();
// isVisible: false,
const step = ref("SIGIN");
const siginForm = reactive({
  username: "",
  password: "",
});
const sigupForm = reactive({
  username: "",
  email: "",
  password: "",
  retryPassword: "",
});

const created = async () => {
  if (user) {
    return push({ path: "/desktop" });
  }
};
const redirectPath = computed(() => {
  return query.redirectPath || "/desktop";
});
const sigin = async () => {
  siginMessage.value = null;
  isSigining.value = true;

  try {
    const { data: user } = await http.post("/users/sigin", {
      name: siginForm.username,
      password: siginForm.password,
      siginAs: "mail",
    });

    if (!user) {
      throw new Error({ code: 404 });
    }

    store.$patch({
      user: user,
    });
    if (redirectPath === "back") {
      go(-1);
    } else {
      push(redirectPath.value);
    }
  } catch (error) {
    var { code } = error;
    switch (code) {
      case 404:
        siginMessage = "用户名或密码错误";
        break;

      default:
        // this.$catch(error, null, (message) => {
        //   this.siginMessage = message;
        // });
        break;
    }
  } finally {
    isSigining.value = false;
  }

  // if (user) {
  // this.isVisible = false;
  // this.siginForm = {
  //   username: "",
  //   password: ""
  // };
  // var role = await new Parse.Query(Parse.Role)
  //   .equalTo("users", Parse.User.current())
  //   .includeAll("*")
  //   .find();
  // this.$store.dispatch("user/setUser", user);
  // if (this.redirectPath === "back") {
  //   this.$router.go(-1);
  // } else {
  //   this.$router.push(this.redirectPath);
  // }
  // }
};

const validateEmail = async () => {};
const sigup = async () => {
  try {
    // await Parse.User.logOut();
  } catch (e) {
    console.error(e);
  }

  let isSuccess = false;
  let user = new Parse.User();
  user.set("username", sigupForm.username);
  user.set("password", sigupForm.password);
  user.set("email", sigupForm.email);

  siginMessage.value = null;
  siguping.value = true;
  isRedirectSigin.value = false;

  try {
    await user.signUp();
    isSuccess.value = true;
  } catch (error) {
    switch (error.code) {
      case 202:
        sigupMessage = "用户名已存在, 请重试";
        isRedirectSigin = true;
        break;

      case 203:
        sigupMessage = "邮箱已存在";
        isRedirectSigin = true;
        break;

      default:
        sigupMessage = "未知错误, 请重试";
        console.error(error);
    }
  } finally {
    siguping = false;
  }

  if (isSuccess) {
    store.$patch({
      user: user,
    });
    // $overlay.message.success("注册成功");
    if (redirectPath === "back") {
      go(-1);
    } else {
      push(this.redirectPath);
    }
    step.value = "SIGIN";
    sigupForm = {
      username: "",
      email: "",
      password: "",
      retryPassword: "",
    };
  }
};
</script>
