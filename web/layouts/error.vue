<template>
  <div
    class="
      white
      d-flex
      flex-column flex-grow-1
      justify-space-between
      align-center
    "
  >
    <hair :dark="false" />

    <v-card class="error" outlined dark flat width="100%" max-width="650px">
      <!-- <v-icon :size="128" color="error" class="title-badge white animated flash">mdi-alert-circle</v-icon> -->
      <!-- <v-img class="title-badge primary" >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="90"
            height="90"
            fill="#DBE1EC"
            viewBox="0 0 48 48"
          >
            <path
              d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
            />
          </svg>
        </v-img>-->
      <v-card-text class="d-flex flex-column pl-6 pr-6" v-if="error">
        <div
          class="
            flex-grow-1
            d-flex
            flex-column
            justify-center
            align-center
            error-404
          "
          v-if="error.statusCode === 404"
        >
          <h2 class="white--text">404</h2>
          <v-divider />
          <h4 class="white--text">抱歉,找不到该页面</h4>
        </div>
        <div v-else>发生未知错误</div>
        <div v-if="isDevelopment" class="pt-6 pb-6">
          <i>(仅开发模式可见):</i>
          {{ error }}
        </div>
      </v-card-text>
      <v-card-actions class="d-flex flex-column jusitfy-center">
        <v-btn @click="$router.go(-1)" outlined>返回</v-btn>
      </v-card-actions>
    </v-card>

    <foot :dark="false" />
  </div>
</template>

<script>
const { NODE_ENV } = process.env;
import Hair from "../components/Hair";
import Foot from "../components/Foot";
export default {
  name: "NuxtError",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    console.error(this.error);
  },
  computed: {
    isDevelopment() {
      return process.env.NODE_ENV === "development";
    },
    message() {
      return this.error.message || "发生错误了";
    },
  },
  components: {
    Hair,
    Foot,
  },
  head() {
    return {
      title: this.message,
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.error-404 {
  h2 {
    line-height: 48px;
    font-size: 48px;
    letter-spacing: 12px;
    font-weight: 200;
  }

  h4 {
    line-height: 24px;
    font-size: 24px;
    font-weight: 200;
  }
}

.title-badge {
  font-size: 48px;
  overflow: hidden;
  position: absolute;
  top: -35%;
  left: -85px;
  transform: rotate(-45deg);
}
</style>
