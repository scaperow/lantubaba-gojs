<template>
  <v-overlay :value="visible">
    <v-progress-circular indeterminate size="64" />
  </v-overlay>
</template>

<script>
export default {
  props: {
    visible: Boolean
  }
}
</script>
