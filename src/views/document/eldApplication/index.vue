<script setup lang="ts">
import { ref } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { useRoute } from "vue-router";
import DataTable from "./widgets/DataTable.vue";
import { useManualStore } from "@/app/config/store/Manual";

const tabs = [
  {
    title: "EldApplicationTab",
    modelValue: 1
  },
  {
    title: "reassessment",
    modelValue: 3
  }
];

const route = useRoute();
const manualStore = useManualStore()
manualStore.setRegions();
manualStore.setDocumentTypeList();

const activeTab = ref(+String(route.query.eldApplication) || 1);

const updateTabModelValue = () => {};

if (activeTab.value && activeTab.value == 3) {
  updateTabModelValue();
}
</script>

<template>
  <UiParentCard>
    <v-tabs align-tabs="center" color="success" v-model="activeTab">
      <v-tab v-for="item in tabs" :value="item.modelValue">
        {{ $t(item.title) }}
      </v-tab>
    </v-tabs>
    <v-window>
      <v-window-item :value="1">
        <DataTable :model-value="activeTab"/>
      </v-window-item>
      <v-window-item :value="3">
        <DataTable :model-value="activeTab"/>
      </v-window-item>
    </v-window>
  </UiParentCard>
</template>
