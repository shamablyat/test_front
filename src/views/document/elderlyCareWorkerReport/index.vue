<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { reactive } from "vue";
import { useFormatter } from "@/utils/helpers/formatter";
import ElderlyCareWorkerReportService from "@/services/document/elderlyCareWorkerReport.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import Table from "./widgets/Table.vue";
import Graphic from "./widgets/Graphic.vue";
import { IWorkerColumns } from "./types";
import { CalendarStatsIcon, LayoutGridIcon } from "vue-tabler-icons";
import { FormBtn } from "@/models/vuetify/types";

const { handleDate, handleDateIso } = useFormatter();
const { setError } = useErrorToast();

const today = new Date();
const tabs: FormBtn[] = [
  {
    label: "All",
    prependIcon: LayoutGridIcon
  },
  {
    label: "workTimeGraphic",
    prependIcon: CalendarStatsIcon,
    color: "secondary"
  }
];
const rows = ref<any[]>([]);
const columns = ref<IWorkerColumns>({});

const filter = reactive({
  beginDate: handleDate(new Date(today.getFullYear(), today.getMonth(), 1).toString()),
  endDate: handleDate(new Date(today.getFullYear(), today.getMonth() + 1, 0).toString())
});

const activeTab = ref(0);
const loading = ref<boolean>(false);
const month = ref(filter.beginDate);
const controller = new AbortController();

const setData = () => {
  loading.value = true;
  ElderlyCareWorkerReportService.GetAssistantReportDaily(filter, {
    signal: controller.signal
  })
    .then((res) => {
      loading.value = false;

      rows.value = res.data.dayServices;
      columns.value = res.data.columns;
    })
    .catch((err) => {
      setError(err);
      loading.value = false;
    });
};

const setMonth = (value: string) => {
  const year = handleDateIso(value).getFullYear();
  const month = handleDateIso(value).getMonth();

  const firstDay = new Date(year, month, 1).toDateString();
  const lastDayOfMonth = new Date(year, month + 1, 0).toDateString();

  filter.beginDate = handleDate(firstDay).toString();
  filter.endDate = handleDate(lastDayOfMonth).toString();

  setData();
};

setData();

onBeforeUnmount(() => {
  controller.abort();
});
</script>

<template>
  <UiParentCard>
    <v-row class="mb-2" style="justify-content: space-between">
      <v-col class="time">
        <form-picker clearable type="month" v-model="month" @update:modelValue="setMonth" />
      </v-col>
      <v-col class="tabs">
        <form-toggle-buttons border divided :tabs="tabs" v-model="activeTab" />
      </v-col>
    </v-row>

    <Table :rows="rows" :columns="columns" :loading="loading" @refresh="setData" v-if="activeTab === 0" />

    <Graphic v-if="activeTab == 1" />
  </UiParentCard>
</template>
<style lang="scss" scoped>
.time {
  flex: unset;
  width: max-content;
  min-width: 16rem;
  @media screen and (max-width: 600px) {
    flex: 1;
  }
}
.tabs {
  flex: unset;
  width: max-content;

  @media screen and (max-width: 600px) {
    margin-left: auto;
  }
}
</style>
