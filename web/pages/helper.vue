<template>
  <div
    class="clause d-flex flex-column align-center justify-space-between grey lighten-4 flex-grow-1"
  >
    <hair :dark="false" />
    <v-card class="pa-4 flex-grow-1 d-flex flex-column justify-center" width="100%" flat tile>
      <v-card-text class="d-flex flex-column justify-center align-center">
        <v-icon>mdi mdi-36px mdi-spin mdi-loading</v-icon>正在建设中
      </v-card-text>
    </v-card>
    <foot :dark="false" />
  </div>
</template>
<script>
import raw from "../assets/clause.md";
import Hair from "../components/Hair";
import Foot from "../components/Foot";
export default {
  components: {
    Hair,
    Foot
  },
  data() {
    return {
      clause: raw
    };
  }
};
</script>
<style lang="scss">
.clause {
  * {
    letter-spacing: 2px;
    font-weight: 200;
  }

  h2 {
    line-height: 42px;
    font-size: 28px;
  }

  h3 {
    line-height: 42px;
    font-size: 24px;
  }

  p {
    line-height: 28px;
  }

  code {
    background: transparent !important;
    background-color: transparent !important;
    color: #333 !important;
    box-shadow: none !important;
  }
}
</style>