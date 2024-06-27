<script setup lang="ts">
import ElderlyCareWorkerReportService from "@/services/document/elderlyCareWorkerReport.service";
import { WEEK_DAYS } from "@/utils/constants";
import { onBeforeUnmount, ref } from "vue";

const data = ref<any>();
const loading = ref(false);
const controller = new AbortController();

const fields: any = [{ value: "elderlyManageFullName", text: "elderlyManageFullName" }, ...WEEK_DAYS];

const get = () => {
  loading.value = true;
  ElderlyCareWorkerReportService.GetAssistantReportWeekly()
    .then((res) => {
      data.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

get();

onBeforeUnmount(() => {
  controller.abort();
});
</script>

<template>
  <div>
    <v-card elevation="0" class="border">
      <v-table fixed-header>
        <thead>
          <tr>
            <th class="border" v-for="field in fields" :key="field.value">
              {{ $t(field.text) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data">
            <td>{{ item.elderlyManageFullName }}</td>
            <template v-for="day in item.weekDayInfo">
              <template v-for="field in fields">
                <td v-if="day.orderCodeOfWeek === +field.value" style="word-break: break-all" class="border border">
                  <div v-for="service in day.weekDaysServices" class="border my-2 px-2 py-2" style="min-width: 196px">
                    <span v-if="service.beginAt || service.endAt">
                      {{ service.beginAt }} -
                      {{ service.endAt }}
                    </span>
                    <h4 v-if="service.details">
                      {{ service.details }}
                    </h4>
                    <h4>
                      {{ service.elderlyCareService }}
                    </h4>
                  </div>
                </td>
              </template>
            </template>
          </tr>
        </tbody>
        <tbody class="text-center" v-if="loading">
          <td colspan="12" class="text-center py-2">
            <v-progress-circular indeterminate></v-progress-circular>
          </td>
        </tbody>
        <tbody v-if="data && data.length === 0 && !loading">
          <td colspan="12" class="font-weight-bold h5 text-center">
            {{ $t("NotFound") }}
          </td>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>
