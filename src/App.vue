<template>
  <div>
      <RouterView></RouterView>
      <CustomNotification />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import CustomNotification from "./components/CustomNotification.vue";
import ApiService from "./services/api.service";

import { RouterView } from "vue-router";
import { useManualStore } from "./app/config/store/Manual";

ApiService.setHeader();
const store = useManualStore();

onMounted(() => {
  store.fetchLanguageList();
});
</script>
<style>
tr:nth-child(odd) {
  background: rgb(var(--v-theme-oddTableColor));
}

a {
  text-decoration: none;
  outline: none;
  color: inherit;
}
</style>
