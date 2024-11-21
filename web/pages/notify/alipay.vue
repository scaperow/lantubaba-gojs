<template>
  <div>支付成功,正在跳转 ...</div>
</template>
<script>
export default {
  created() {
    var event = new Event("paySuccess");
    window.dispatchEvent(event);
    window.close();
  }
};
</script>
<style lang="scss" scoped>
</style>