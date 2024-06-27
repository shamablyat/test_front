<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import ElderlyCareSchedule from "@/services/document/elderySchedule.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { reactive } from "vue";
import { ref } from "vue";
import { PrinterIcon } from "vue-tabler-icons";
import { useRouter } from "vue-router";
import { useGlobal } from "@/composables/useGlobal";
import { useI18n } from "vue-i18n";
import { IFields, IFilter } from "@/models/basic";
import { useAuth } from "@/app/config/store/auth";
import i18n from "@/app/config/i18n";
// import { useFormatter } from "@/utils/helpers/formatter";

interface ICustomFilter extends IFilter {
  assistantPersonFullName: string;
  assistantPersonPinfl: string;
  elderlyManageFullName: string;
  elderlyManagePinfl: string;
  isActualElderly: boolean;
  IsActualAssistants: boolean | null;
}

const fields: IFields[] = [
  { key: "assistantPersonId", label: "id" },
  { key: "region", label: "region" },
  { key: "district", label: "district" },
  { key: "assistantPersonFullName", label: "assistantPersonFullName" },
  { key: "assistantPersonPinfl", label: "asistentPINFL" },
  { key: "elderlyCount", label: "elderlyCount", isAmount: true },
  { key: "totalTime", label: "totalTime" },
  { key: "travelTimeInMinutes", label: "travelTimeInMinutes" }
];

const DEFAULT_VALUES: ICustomFilter = {
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  totalRows: 0,
  assistantPersonFullName: "",
  assistantPersonPinfl: "",
  elderlyManageFullName: "",
  elderlyManagePinfl: "",
  isActualElderly: true,
  IsActualAssistants: true
};

const router = useRouter();
const { setError } = useErrorToast();
const { forceFileDownload } = useGlobal();
const { t } = useI18n();
const { can } = useAuth();
// const { handleDateIso, handleDate } = useFormatter();

const printLoading = ref<boolean>(false);
const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
};

const actualAssistantList = [
  {
    // @ts-ignore
    text: i18n.global.t("all"),
    value: null
  },
  {
    text: i18n.global.t("isActive"),
    value: true
  },
  {
    text: i18n.global.t("isNotActive"),
    value: false
  }
];

// const getStartDayOfWeekAndEndDayOfWeek = (value: any) => {
//   let curr = handleDateIso(value);
//   let first = curr.getDate() - curr.getDay() + 1;
//   let last = first + 6;

//   beginDate.value = handleDate(new Date(curr.setDate(first)).toUTCString());
//   endDate.value = handleDate(new Date(curr.setDate(last)).toUTCString());
// };

const printReport = () => {
  printLoading.value = true;
  ElderlyCareSchedule.ExportAssistantInfoList(filter)
    .then((res) => {
      forceFileDownload(res, t("cardAssistant"), ".xlsx");
      printLoading.value = false;
    })
    .catch((err) => {
      setError(err);
      printLoading.value = false;
    });
};
const printReport2 = () => {
  printLoading.value = true;
  ElderlyCareSchedule.ExportElderlyCareScheduleInfoReports(filter)
    .then((res) => {
      forceFileDownload(res, t("ExportElderlyCareScheduleInfoReports"), ".xlsx");
      printLoading.value = false;
    })
    .catch((err) => {
      setError(err);
      printLoading.value = false;
    });
};
</script>

<template>
  <UiParentCard>
    <form-table :fields="fields" :filter="filter" :service="ElderlyCareSchedule" apiName="GetAsistentList">
      <template #header="{ refresh, getData }">
        <form-table-header :filter="filter" hasMenu @refresh="refresh" @clearFilter="clearFilter" @getData="getData">
          <template #create>
            <v-menu location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" v-bind="props" />
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title style="cursor: pointer">
                    <v-btn :loading="printLoading" @click="printReport" color="info" :prepend-icon="PrinterIcon"> {{ $t("cardAssistant") }}</v-btn>
                  </v-list-item-title>
                  <v-list-item-title style="cursor: pointer" class="mt-2">
                    <v-btn :loading="printLoading" @click="printReport2" color="info" :prepend-icon="PrinterIcon">
                      {{ $t("ExportElderlyCareScheduleInfoReports") }}</v-btn
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template #menu-items>
            <v-row class="mt-4 mx-2">
              <v-col class="py-1">
                <form-input :label="$t('asistentFIO')" v-model="filter.assistantPersonFullName" :placeholder="$t('enterText')"></form-input>
              </v-col>
            </v-row>
            <v-row class="mt-4 mx-2">
              <v-col class="py-1">
                <form-input
                  :label="$t('asistentPINFL')"
                  v-model="filter.assistantPersonPinfl"
                  v-mask="'##############'"
                  :placeholder="$t('enterText')"
                ></form-input>
              </v-col>
            </v-row>
            <v-row class="mt-4 mx-2">
              <v-col class="py-1">
                <form-input :label="$t('ElderlyFIO')" v-model="filter.elderlyManageFullName" :placeholder="$t('enterText')"></form-input>
              </v-col>
            </v-row>
            <v-row class="mt-4 mx-2">
              <v-col class="py-1">
                <form-input
                  :label="$t('ElderlyPINFL')"
                  v-model="filter.elderlyManagePinfl"
                  v-mask="'##############'"
                  :placeholder="$t('enterText')"
                ></form-input>
              </v-col>
            </v-row>
            <v-row class="mt-4 mx-2">
              <v-col class="py-1">
                <form-select v-model="filter.IsActualAssistants" :list="actualAssistantList" :label="$t('IsActualAssistants')"></form-select>
              </v-col>
            </v-row>
            <v-row class="mt-4 mx-2">
              <v-col class="py-1">
                <form-checkbox v-model="filter.isActualElderly" :label="$t('isActual')"></form-checkbox>
              </v-col>
            </v-row>
          </template>
        </form-table-header>
      </template>
      <template #assistantPersonFullName="{ item }">
        <v-btn
          v-if="can('ElderlyCareWorkerReportView')"
          style="background: transparent"
          class="font-weight-bold text-info text-right"
          @click="
            router.push({
              name: 'cardAssistant',
              params: { id: item.assistantPersonId }
            })
          "
          >{{ item.assistantPersonFullName }}</v-btn
        >
        <template v-else>
          {{ item.assistantPersonFullName }}
        </template>
      </template>
    </form-table>
  </UiParentCard>
</template>
