<template>
  <div>
    <DialogCard :title="title" :actions="actions" :handle="handleClick" ref="card">
      <v-form ref="form">
        <v-text-field
          color="primary lighten-2"
          filled
          autofocus
          ref="input"
          required
          v-model="editedValue"
          :label="text"
          :rules="rules"
          @keypress.enter="$emit('submit', editedValue)"
        />
      </v-form>
    </DialogCard>
  </div>
</template>

<script>
import Confirmable from "vuedl/src/mixins/confirmable";
import DialogCard from "./DialogCard.vue";
import { VTextField } from "vuetify/lib";

export default {
  components: {
    DialogCard,
    VTextField
  },
  layout: "default",
  mixins: [Confirmable],
  props: {
    rules: Array,
    value: String
  },
  data() {
    return {
      editedValue: this.value
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
  },
  methods: {
    handleClick(res, action) {
      if (this.$refs.form.validate() && action.key) {
        this.$emit("submit", action.key ? this.editedValue : action.key);
        return false;
      }
    }
  }
};
</script>
