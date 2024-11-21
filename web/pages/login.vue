<template>
  <div
    class="
      d-flex
      flex-column
      justify-space-between
      align-stretch
      flex-grow-1
      blue-grey
      lighten-5
    "
  >
    <hair only-logo="true" :dark="false" />
    <div class="d-flex flex-grow-1 flex-column justify-center align-center">
      <v-card min-width="520" class="pa-12 pt-2" outlined>
        <v-tabs centered icons-and-text v-model="step">
          <v-tab :disabled="isSigining || isSiguping" key="SIGIN">登录</v-tab>
          <v-tab :disabled="isSigining || isSiguping" key="SIGUP">注册</v-tab>
        </v-tabs>
        <v-tabs-items v-model="step">
          <v-tab-item key="SIGIN">
            <v-form @submit.prevent.stop="sigin">
              <v-card-text class="mt-8">
                <v-alert dark color="error" v-show="siginMessage">{{
                  siginMessage
                }}</v-alert>

                <v-text-field
                  filled
                  v-model="siginForm.username"
                  label="用户名/邮箱"
                  :rules="[$validate('isNotEmpty')]"
                ></v-text-field>
                <v-text-field
                  filled
                  type="password"
                  v-model="siginForm.password"
                  label="密码"
                  :rules="[
                    $validate('isNotEmpty'),
                    $validate('isPassword'),
                    $validate('isLength', { min: 6, max: 24 }),
                  ]"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="d-flex flex-column">
                <v-btn text nuxt depressed target="_blank" to="/reset"
                  >忘记密码 ?</v-btn
                >
                <v-btn
                  block
                  type="submit"
                  color="primary"
                  depressed
                  :loading="isSigining"
                  >登录</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-tab-item>
          <v-tab-item key="SIGUP">
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
                  <v-text-field
                    filled
                    label="用户名"
                    v-model="sigupForm.username"
                    :rules="[
                      $validate('isNotEmpty'),
                      $validate('isAlphanumeric'),
                      $validate('isLength', { min: 3, max: 24 }),
                    ]"
                  ></v-text-field>
                  <v-text-field
                    filled
                    type="email"
                    label="邮箱"
                    :rules="[$validate('isNotEmpty'), $validate('isEmail')]"
                    v-model="sigupForm.email"
                    class="forms_field-input"
                  ></v-text-field>
                  <v-text-field
                    filled
                    type="password"
                    :rules="[
                      $validate('isNotEmpty'),
                      $validate('isPassword'),
                      $validate('isLength', { min: 6, max: 24 }),
                    ]"
                    v-model="sigupForm.password"
                    label="密码"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex flex-column">
                <v-btn text nuxt to="/">
                  <v-icon>mdi-arrow-left</v-icon>回到首页
                </v-btn>
                <v-btn
                  block
                  type="submit"
                  color="primary"
                  depressed
                  :loading="isSiguping"
                  >注册</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import axios from "axios";
import Hair from "../components/Hair";

const http = axios.create();
export default {
  name: "LoginForm",
  template: "#login-form",
  data() {
    return {
      isSigining: false,
      isSiguping: false,
      text: "",
      isRedirectSigin: false,
      siginMessage: null,
      sigupMessage: null,
      // isVisible: false,
      step: "SIGIN",
      siginForm: {
        username: "",
        password: "",
      },
      sigupForm: {
        username: "",
        email: "",
        password: "",
        retryPassword: "",
      },
    };
  },
  components: {
    Hair,
  },
  async created() {
    if (this.user) {
      return this.$router.push({ path: "/desktop" });
    }
  },
  computed: {
    redirectPath() {
      return this.$route.query.redirect || "/desktop";
    },
    ...mapGetters({ user: "user/user" }),
  },
  methods: {
    ...mapMutations({ setUser: "user/SET_USER" }),
    async sigin() {
      this.siginMessage = null;
      this.isSigining = true;

      try {
        const { data: user } = await http.post("/users/sigin", {
          name: this.siginForm.username,
          password: this.siginForm.password,
          siginAs: "mail",
        });

        if (!user) {
          throw new Error({ code: 404 });
        }

        this.setUser(user);
        if (this.redirectPath === "back") {
          this.$router.go(-1);
        } else {
          this.$router.push(this.redirectPath);
        }
      } catch (error) {
        var { code } = error;
        switch (code) {
          case 404:
            this.siginMessage = "用户名或密码错误";
            break;

          default:
            this.$catch(error, null, (message) => {
              this.siginMessage = message;
            });
            break;
        }
      } finally {
        this.isSigining = false;
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
    },
    async logout() {
      // try {
      //   await Parse.User.logOut();
      //   // this.isVisible = true;
      //   this.$store.dispatch("user/setUser", null);
      // } catch (error) {
      //   this.$catch(error);
      // }
    },
    async validateEmail() {},
    async sigup() {
      try {
        // await Parse.User.logOut();
      } catch (e) {
        console.error(e);
      }

      let isSuccess = false;
      let user = new Parse.User();
      user.set("username", this.sigupForm.username);
      user.set("password", this.sigupForm.password);
      user.set("email", this.sigupForm.email);

      this.siginMessage = null;
      this.siguping = true;
      this.isRedirectSigin = false;

      try {
        await user.signUp();
        isSuccess = true;
      } catch (error) {
        switch (error.code) {
          case 202:
            this.sigupMessage = "用户名已存在, 请重试";
            this.isRedirectSigin = true;
            break;

          case 203:
            this.sigupMessage = "邮箱已存在";
            this.isRedirectSigin = true;
            break;

          default:
            this.sigupMessage = "未知错误, 请重试";
            console.error(error);
        }
      } finally {
        this.siguping = false;
      }

      if (isSuccess) {
        this.$store.dispatch("user/setUser", user.toJSON());
        this.$overlay.message.success("注册成功");
        if (this.redirectPath === "back") {
          this.$router.go(-1);
        } else {
          this.$router.push(this.redirectPath);
        }
        this.step = "SIGIN";
        this.sigupForm = {
          username: "",
          email: "",
          password: "",
          retryPassword: "",
        };
      }
    },
  },
};
</script>
