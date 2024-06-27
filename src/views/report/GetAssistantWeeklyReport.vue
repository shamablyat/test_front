<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import type { IFields, IFilter, ISelectList } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import ReportService from "@/services/report/regReport.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { reactive } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { PrinterIcon } from "vue-tabler-icons";

const { t } = useI18n();

interface CustomFilter extends IFilter {
  fromDate: any;
  toDate: any;
  byRegion: boolean;
  byDistrict: boolean;
  regionIds: number[];
  districtIds: number[];
}

const { setError } = useErrorToast();
const { forceFileDownload } = useGlobal();

const rows = ref<any[]>([]);
const regionsList = ref<ISelectList[]>([]);
const columns = ref<{ [key: number]: string }>({});
const columnTotals = ref<{ [key: number]: string }>({});
const totalCount = ref<number>(0);
const outTotalCount = ref<number>(0);
const loading = ref<boolean>(false);
const printLoading = ref<boolean>(false);
const menu = ref<boolean>(false);
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();

const lastWeekNow = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
const lastWeekYear = lastWeekNow.getFullYear();
const lastWeekMonth = lastWeekNow.getMonth() + 1;
const lastWeekDay = lastWeekNow.getDate();

const lastWeek = `${lastWeekDay.toString().padStart(2, "0")}.${lastWeekMonth.toString().padStart(2, "0")}.${lastWeekYear}`;
const today = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;

const DEFAULT_VALUES: CustomFilter = {
  page: 1,
  pageSize: 20,
  orderType: "asc",
  search: "",
  totalRows: 0,
  fromDate: lastWeek,
  toDate: today,
  byRegion: false,
  byDistrict: true,
  regionIds: [],
  districtIds: []
};
const filter: CustomFilter = reactive({ ...DEFAULT_VALUES });

const refresh = () => {
  const innerFilter = JSON.parse(JSON.stringify(filter));
  if (filter.regionIds.includes(999)) {
    innerFilter.byRegion = false;
    innerFilter.byDistrict = true;
    innerFilter.regionIds = [];
    innerFilter.districtIds = [];
  }

  if (filter.regionIds.length > 0 && !filter.regionIds.includes(999)) {
    innerFilter.byRegion = false;
    innerFilter.byDistrict = true;
  }

  if (filter.regionIds.length === 0 && filter.districtIds.length === 0) {
    innerFilter.byRegion = true;
    innerFilter.byDistrict = false;
  }

  loading.value = true;
  columns.value = {};
  columnTotals.value = {};
  rows.value = [];
  totalCount.value = 0;

  ReportService.GetAssistantWeeklyReport(innerFilter)
    .then((res) => {
      outTotalCount.value = 0;
      rows.value = res.data.rows;
      columns.value = res.data.columns;
      columnTotals.value = res.data.columnTotals;
      totalCount.value = res.data.totalCount;
      for (const item of res.data.rows) {
        outTotalCount.value += item.outTotalCount;
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      setError(err);
    });
};

const getRegions = () => {
  AdmManualService.RegionSelectlist().then((res) => {
    regionsList.value = res.data;
    regionsList.value.unshift({
      value: 999,
      orderCode: "all",
      text: t("allDistricts")
    });
  });
};

const printReport = () => {
  printLoading.value = true;
  ReportService.ExportAssistantWeeklyReport(filter)
    .then((res) => {
      printLoading.value = false;
      forceFileDownload(res, t("GetAssistantWeeklyReport"), ".xlsx");
    })
    .catch((err) => {
      setError(err);
      printLoading.value = false;
    });
};

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
  menu.value = false;
};

getRegions();
refresh();

const fields: IFields[] = [
  {
    key: "orderCode",
    label: "orderCode",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "region",
    label: "region",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "district",
    label: "district",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "lastName",
    label: "lastName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "firstName",
    label: "firstName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "middleName",
    label: "middleName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "docSeria",
    label: "passportSeria",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "docNumber",
    label: "passportNum",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "birthOn",
    label: "birthOn",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "pinfl",
    label: "pinfl",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "gender",
    label: "gender",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyCount",
    label: "elderlyCountWeeklyReport",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "attachHours",
    label: "attachHours",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "planHours",
    label: "planHours",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "realHours",
    label: "realHours",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "realTravelHours",
    label: "realTravelHours",
    thClass: "border",
    tdClass: "border"
  }
];
</script>

<template>
  <UiParentCard>
    <form-table
      class="reestr"
      :fields="fields"
      :filter="filter"
      :service="ReportService"
      apiName="GetAssistantWeeklyReport"
      tableHeight="400"
      :isDanger="true"
    >
      <template #header="{ refresh, getData }">
        <form-table-header
          :canCreate="false"
          hasMenu
          :filter="filter"
          @clearFilter="clearFilter"
          :can-clear="false"
          @refresh="refresh"
          @getData="getData"
        >
          <template #menu-items>
            <v-card-text>
              <v-col cols="12" md="12" sm="12" class="py-0 my-2 px-0">
                <form-select v-model="filter.regionIds" multiple :list="regionsList" :label="$t('region')"> </form-select>
              </v-col>
              <v-row class="py-0 mt-5 mb-0">
                <v-col class="py-0" cols="12">
                  <v-label class="mb-2 font-weight-medium">
                    {{ $t("docDate") }}
                  </v-label>
                </v-col>
                <v-col class="py-0" cols="6">
                  <form-picker class="w-100" v-model:model-value="filter.fromDate" :placeholder="$t('startdate')" />
                </v-col>
                <v-col class="py-0" cols="6">
                  <form-picker class="w-100" v-model:model-value="filter.toDate" :placeholder="$t('enddate')" />
                </v-col>
              </v-row>
            </v-card-text>
          </template>
          <template #create>
            <v-btn @click="printReport" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
          </template>
        </form-table-header>
      </template>
      <template #orderCode="{ index }">
        <span class="d-flex align-center justify-center"> {{ index + 1 }}</span>
      </template>
      <template #lastName="{ item }">
        <del v-if="item.isDeath">{{ item.lastName }}</del>
        <div v-else>{{ item.lastName }}</div>
      </template>
      <template #firstName="{ item }">
        <del v-if="item.isDeath">{{ item.firstName }}</del>
        <div v-else>{{ item.firstName }}</div>
      </template>
      <template #middleName="{ item }">
        <del v-if="item.isDeath">{{ item.middleName }}</del>
        <div v-else>{{ item.middleName }}</div>
      </template>
    </form-table>
  </UiParentCard>
</template>
