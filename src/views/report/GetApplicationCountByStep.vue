<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import type { ISelectList } from "@/models/basic";
import ReportService from "@/services/report/regReport.service";
import AdmManualService from "@/services/others/admmanual.service";
import { useFormatter } from "@/utils/helpers/formatter";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { reactive } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronRightIcon, PrinterIcon } from "vue-tabler-icons";

const { t } = useI18n();

interface IFilter {
  fromDate: string;
  toDate: string;
  byRegion: boolean;
  byDistrict: boolean;
  districtId: number | null;
  regionId: number | null;
}

const { setError } = useErrorToast();
const { handleDate } = useFormatter();
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

const day = ("0" + new Date().getDate()).substr(-2);
const month = ("0" + (new Date().getMonth() + 1)).substr(-2);
const year = new Date().getFullYear() - 1;
const fromDate = `${day}.${month}.${year}`;

const DEFAULT_VALUES: IFilter = {
  fromDate: fromDate,
  toDate: handleDate(new Date().toDateString()),
  byRegion: true,
  byDistrict: false,
  regionId: null,
  districtId: null
};
const filter: IFilter = reactive({ ...DEFAULT_VALUES });

const refresh = () => {
  const innerFilter = JSON.parse(JSON.stringify(filter));

  if (filter.regionId) {
    innerFilter.byRegion = false;
    innerFilter.byDistrict = true;
  }

  if (!filter.regionId && !filter.districtId) {
    innerFilter.byRegion = true;
    innerFilter.byDistrict = false;
  }

  loading.value = true;
  columns.value = {};
  columnTotals.value = {};
  rows.value = [];
  totalCount.value = 0;

  ReportService.GetApplicationCountByStep(innerFilter)
    .then((res: any) => {
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
    .catch((err: any) => {
      loading.value = false;
      setError(err);
    });
};

const ChangeInfo = (value: any) => {
  if (filter.byRegion) {
    filter.byRegion = false;
    filter.byDistrict = true;
    filter.regionId = value.regionId;
    refresh();
  } else if (filter.byDistrict) {
    filter.byRegion = true;
    filter.byDistrict = false;
    filter.districtId = value.districtId;
  }
};

const getRegions = () => {
  AdmManualService.RegionSelectlist().then((res) => {
    regionsList.value = res.data;
  });
};

const printReport = () => {
  printLoading.value = true;
  ReportService.ExportGetApplicationCountByStep(filter)
    .then((res: any) => {
      printLoading.value = false;
      forceFileDownload(res, t("GetApplicationCountByStep"), ".xlsx");
    })
    .catch((err: any) => {
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
</script>

<template>
  <UiParentCard>
    <form-table-header :filter="filter" hasMenu @refresh="refresh" @clearFilter="clearFilter" :can-clear="false" :can-search="false">
      <template #menu-items>
        <v-row class="mx-2">
          <v-col cols="12" md="12" sm="12" class="py-0 my-2">
            <form-select v-model="filter.regionId" multiple :list="regionsList" :label="$t('region')"> </form-select>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <form-picker clearable v-model="filter.fromDate" :label="$t('startDate')"></form-picker>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <form-picker clearable v-model="filter.toDate" :label="$t('endDate')"></form-picker>
          </v-col>
        </v-row>
      </template>
      <template #create>
        <v-btn @click="printReport" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
      </template>
      <template #header-bottom>
        <v-breadcrumbs>
          <v-breadcrumbs-item
            style="cursor: pointer"
            @click="
              () => {
                filter.byDistrict = false;
                filter.byRegion = true;
                filter.regionId = null;
                filter.districtId = null;
                refresh();
              }
            "
            class="h6 py-0"
            :class="[!filter.byRegion ? 'text-disabled' : '']"
          >
            {{ $t("All") }}
          </v-breadcrumbs-item>
          <ChevronRightIcon size="14" v-if="filter.byDistrict" />
          <v-breadcrumbs-item class="text-disabled h6" v-if="filter.byDistrict">
            {{ $t("district") }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </template>
    </form-table-header>
    <v-card class="border" elevation="0">
      <v-table fixed-header height="450" density="compact">
        <thead>
          <tr>
            <th v-if="!filter.regionId" class="font-weight-bold text-center h6 border">
              {{ $t("region") }}
            </th>
            <th rowspan="2" class="font-weight-bold text-center h6 border" v-if="filter.regionId && !filter.districtId">
              {{ $t("district") }}
            </th>
            <template v-for="item in columns">
              <th colspan="2" class="font-weight-bold text-center h6 border">
                {{ item }}
              </th>
            </template>
            <th colspan="2" class="font-weight-bold text-center h6 border">
              {{ $t("rowSum") }}
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading && rows.length > 0">
          <tr v-for="(item, index) in rows" :key="index + 'row'">
            <td v-if="!filter.regionId" class="border">
              <v-btn style="background: transparent" class="font-weight-bold text-info text-right" @click="ChangeInfo(item)">
                {{ item.region }}
              </v-btn>
            </td>
            <td v-if="filter.regionId && !filter.districtId" class="border">
              <v-btn style="background: transparent" class="font-weight-bold text-info text-right">
                {{ item.district }}
              </v-btn>
            </td>

            <td colspan="2" class="text-right border" v-for="(_, fieldIndex) in columns" :key="fieldIndex">
              {{ Intl.NumberFormat(undefined, {}).format(item.itemCounts[fieldIndex]) }}
            </td>
            <td colspan="2" class="text-right border font-weight-bold">
              {{ item.totalCount }}
            </td>
          </tr>
          <tr class="total">
            <td class="font-weight-bold border">
              <v-btn style="background: transparent" class="font-weight-bold">
                {{ $t("total") }}
              </v-btn>
            </td>
            <td colspan="2" class="text-right border font-weight-bold" v-for="column in columnTotals">
              {{ Intl.NumberFormat(undefined, {}).format(+column) }}
            </td>
            <td colspan="2" class="text-right border font-weight-bold">
              {{ Intl.NumberFormat(undefined, {}).format(totalCount) }}
            </td>
          </tr>
        </tbody>
        <tbody class="text-center" v-if="loading">
          <td colspan="12" class="text-center py-2">
            <v-progress-circular indeterminate></v-progress-circular>
          </td>
        </tbody>
        <tbody v-if="!loading && rows && rows.length == 0">
          <td colspan="12" class="py-2 font-weight-bold h5 text-center">
            {{ $t("NotFound") }}
          </td>
        </tbody>
      </v-table>
    </v-card>
  </UiParentCard>
</template>
