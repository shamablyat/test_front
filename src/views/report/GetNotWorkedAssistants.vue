<script setup lang="ts">
import { ref } from "vue";
import type { IFields, IFilter, ISelectList } from "@/models/basic";
import UiParentCard from "@/components/UiParentCard.vue";
import AdmManualService from "@/services/others/admmanual.service";
import { PrinterIcon } from "vue-tabler-icons";
import { reactive } from "vue";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useI18n } from "vue-i18n";
import { useGlobal } from "@/composables/useGlobal";
import { useManualStore } from "@/app/config/store/Manual";
import ReportService from "@/services/report/regReport.service";
import i18n from "@/app/config/i18n";
import { useFormatter } from "@/utils/helpers/formatter";

const { t } = useI18n();
const { setError } = useErrorToast();

interface CustomFilter extends IFilter {
  fromDate: string;
  toDate: string;
  regionId: number | null;
  districtId: number | null;
  genderId: number | null;
  isActualElderly: boolean | null;
}

const fields: IFields[] = [
  {
    key: "orderCode",
    label: "orderCode",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "assistantId",
    label: "id",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "assistantFullName",
    label: "fullName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "region",
    label: "organizationRegion",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "district",
    label: "organizationDistrict",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "organization",
    label: "organization",
    thClass: "border",
    tdClass: "border"
  }
];

const { handleDate } = useFormatter();

const day = ("0" + new Date().getDate()).substr(-2);
const month = ("0" + (new Date().getMonth() + 1)).substr(-2);
const year = new Date().getFullYear() - 1;
const fromDate = `${day}.${month}.${year}`;

const DEFAULT_VALUES: CustomFilter = {
  fromDate: fromDate,
  toDate: handleDate(new Date().toDateString()),
  page: 1,
  pageSize: 20,
  search: "",
  regionId: null,
  districtId: null,
  sortBy: "",
  orderType: "asc",
  genderId: null,
  isActualElderly: null
};

const actualElderlyList = [
  {
    // @ts-ignore
    text: i18n.global.t("all"),
    value: null
  },
  {
    text: i18n.global.t("yes"),
    value: true
  },
  {
    text: i18n.global.t("no"),
    value: false
  }
];

const genderList = ref<any[]>([]);
const filter: CustomFilter = reactive({ ...DEFAULT_VALUES });
const menu = ref(false);
const printLoading = ref<boolean>(false);
const districtList = ref<ISelectList[]>([]);
const { forceFileDownload } = useGlobal();
const manual = useManualStore();

const getDistrictList = (id: number) => {
  districtList.value = [];
  filter.districtId = null;
  AdmManualService.DistrictSelectList(id).then((res) => {
    districtList.value = res.data;
  });
};

const getGenderList = () => {
  AdmManualService.GenderSelectList().then((res) => {
    genderList.value = res.data;
    genderList.value.unshift({
      orderCode: null,
      //   @ts-ignore
      text: i18n.global.t("all"),
      value: null
    });
  });
};

getGenderList();

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
  menu.value = false;
};

const printReport = () => {
  printLoading.value = true;
  ReportService.ExportNotWorkedAssitants(filter)
    .then((res) => {
      forceFileDownload(res, t("GetNotWorkedAssistants"), ".xlsx");
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
    <form-table
      class="reestr"
      :fields="fields"
      :filter="filter"
      :service="ReportService"
      apiName="GetNotWorkedAssistants"
      tableHeight="600"
      :isDanger="true"
    >
      <template #header="{ refresh, getData }">
        <form-table-header :canCreate="false" hasMenu :filter="filter" @clearFilter="clearFilter" @refresh="refresh" @getData="getData">
          <template #menu-items>
            <v-card-text>
              <v-col cols="12" lg="6" class="px-0 py-1">
                <form-picker clearable v-model="filter.fromDate" :label="$t('startDate')"></form-picker>
              </v-col>
              <v-col cols="12" lg="6" class="px-0 py-1">
                <form-picker clearable v-model="filter.toDate" :label="$t('endDate')"></form-picker>
              </v-col>
              <v-col class="px-0 py-1">
                <form-select
                  :list="manual.regions"
                  v-model="filter.regionId"
                  :label="$t('region')"
                  :placeholder="$t('region')"
                  @update:modelValue="getDistrictList"
                >
                </form-select>
              </v-col>
              <v-col class="px-0 py-1">
                <form-select :list="districtList" v-model="filter.districtId" :label="$t('district')" :placeholder="$t('district')"></form-select>
              </v-col>
              <v-col class="py-1 px-0">
                <form-select v-model="filter.genderId" :list="genderList" :label="$t('gender')"></form-select>
              </v-col>
              <v-col class="py-1 px-0">
                <form-select v-model="filter.isActualElderly" :list="actualElderlyList" :label="$t('isActual')"></form-select>
              </v-col>
            </v-card-text>
          </template>
          <template #create>
            <v-btn @click="printReport" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
          </template>
        </form-table-header>
      </template>
      <template #orderCode="{ index }">
        <span class="d-flex align-center justify-center"> {{ index + 1 }}</span></template
      >
      <template #organization="{ item }">
        <div style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden">
          {{ item.organization }}
        </div>

        <v-tooltip activator="parent" location="top">
          {{ item.organization }}
        </v-tooltip>
      </template>
    </form-table>
  </UiParentCard>
</template>
