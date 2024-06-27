<script setup lang="ts">
import i18n from "@/app/config/i18n";
import { useAuth } from "@/app/config/store/auth";
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import type { ISelectList } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import ReportService from "@/services/report/regReport.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { reactive } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronRightIcon, PrinterIcon } from "vue-tabler-icons";

const { t } = useI18n();

interface IFilter {
  startOn: string;
  endOn: string;
  byRegion: boolean;
  byDistrict: boolean;
  // districtId: number | null;
  regionId: number | null;
}

const { setError } = useErrorToast();
const { parseNumber, forceFileDownload } = useGlobal();
const auth = useAuth();

const isByRegionAllowed = ref(auth.permissions.includes("GetServicesReportViewByRegion"));
const isByDistrictAllowed = ref(auth.permissions.includes("GetServicesReportViewByDistrict"));

const rows = ref<any[]>([]);
const regionsList = ref<ISelectList[]>([]);
const columns = ref<any>({});
const columnTotals = ref<any>({});
const totalCount = ref<number>(0);
const loading = ref<boolean>(false);
const printLoading = ref<boolean>(false);
const menu = ref<boolean>(false);

const DEFAULT_VALUES: IFilter = {
  startOn: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString("ru-RU"),
  endOn: new Date().toLocaleDateString("ru-RU"),
  byRegion: true,
  byDistrict: false,
  regionId: null
  // districtId: null,
};
const filter: IFilter = reactive({ ...DEFAULT_VALUES });

const checkPersonalInfo = (filter: any) => {
  if (isByRegionAllowed.value) {
    filter.byRegion = true;
    filter.byDistrict = false;
    return;
  } else if (isByDistrictAllowed.value) {
    filter.byRegion = false;
    filter.byDistrict = true;
    filter.regionId = null;
    filter.regionId = auth.user_info?.region?.regionId;
    return;
  }
};

checkPersonalInfo(filter);

const genderList = ref<any[]>([]);

const getGenderList = () => {
  AdmManualService.GenderSelectList().then((res) => {
    genderList.value = res.data;
    genderList.value.unshift({
      orderCode: null,
      text: i18n.global.t("all"),
      value: null
    });
  });
};

getGenderList();

const refresh = () => {
  // if (filter.regionId) {
  //   filter.byRegion = false;
  //   filter.byDistrict = true;
  // }

  // if (!filter.regionId && !filter.districtId) {
  //   filter.byRegion = true;
  //   filter.byDistrict = false;
  // }

  loading.value = true;
  columns.value = {};
  columnTotals.value = {};
  rows.value = [];
  totalCount.value = 0;

  ReportService.GetServicesReport(filter)
    .then((res: any) => {
      rows.value = res.data.body;
      columns.value = res.data.columns;

      loading.value = false;
    })
    .catch((err: any) => {
      loading.value = false;
      setError(err);
    });
};

const ChangeInfo = () => {
  if (filter.byRegion) {
    filter.byRegion = false;
    filter.byDistrict = true;
    // filter.regionId = value.regionId;
    refresh();
  } else if (filter.byDistrict) {
    filter.byRegion = true;
    filter.byDistrict = false;
    // filter.districtId = value.districtId;
  }
};

const getRegions = () => {
  AdmManualService.RegionSelectlist().then((res) => {
    regionsList.value = res.data;
  });
};

const printReport = () => {
  printLoading.value = true;
  ReportService.ExportGetServices(filter)
    .then((res: any) => {
      printLoading.value = false;
      forceFileDownload(res, t("GetVerificationMonitoringCount"), ".xlsx");
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
    <form-table-header :filter="filter" hasMenu @refresh="refresh" @clearFilter="clearFilter" :can-search="false" :can-clear="false">
      <template #menu-items>
        <v-row class="mx-2">
          <v-col cols="12" md="12" sm="12" class="py-0 my-2" v-if="isByRegionAllowed">
            <form-select v-model="filter.regionId" multiple :list="regionsList" :label="$t('region')"> </form-select>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <form-picker clearable v-model="filter.startOn" :label="$t('startDate')"></form-picker>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <form-picker clearable v-model="filter.endOn" :label="$t('endDate')"></form-picker>
          </v-col>
        </v-row>
      </template>
      <template #create>
        <v-btn @click="printReport" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
      </template>
      <template #header-bottom>
        <v-breadcrumbs>
          <v-breadcrumbs-item
            :disabled="!isByRegionAllowed"
            style="cursor: pointer"
            @click="
              () => {
                filter.byDistrict = false;
                filter.byRegion = true;
                filter.regionId = null;
                // filter.districtId = null;
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
      <v-table density="compact">
        <thead>
          <tr>
            <th rowspan="2" v-if="filter.byRegion" class="font-weight-bold text-center h6 border w300">{{ $t("region") }}</th>
            <th rowspan="2" class="font-weight-bold text-center h6 border w300" v-if="filter.byDistrict">
              {{ $t("district") }}
            </th>
            <template v-for="column in columns">
              <th :colspan="Object.keys(column.subColumns).length + 1" class="font-weight-bold text-center h6 border w300">
                {{ column.title }}
              </th>
            </template>
          </tr>
          <tr>
            <template v-for="column in columns">
              <th class="font-weight-bold text-center h6 border w300">
                {{ $t("personCount") }}
              </th>
              <th class="font-weight-bold text-center h6 border w300" v-for="col in column.subColumns">{{ col }}</th>
            </template>
          </tr>
        </thead>
        <tbody v-if="!loading && rows.length > 0">
          <tr v-for="(item, index) in rows" :key="index + 'row'">
            <td v-if="filter.byRegion" class="border">
              <v-btn style="background: transparent" class="font-weight-bold text-info text-right" @click="ChangeInfo">
                {{ item.region }}
              </v-btn>
            </td>
            <td v-if="filter.byDistrict" class="border">
              <v-btn style="background: transparent" class="font-weight-bold text-info text-right">
                {{ item.district }}
              </v-btn>
            </td>
            <template v-for="count in item.counts">
              <td class="text-right border w300">
                {{ parseNumber(count.personCount) }}
              </td>
              <td class="text-right border w300" v-for="c in count.subCounts">{{ parseNumber(c ?? 0) }}</td>
            </template>
          </tr>
          <!-- <tr class="total">
            <td class="font-weight-bold border">
              <v-btn style="background: transparent" class="font-weight-bold">
                {{ $t("total") }}
              </v-btn>
            </td>
            <td colspan="2" class="text-right border">
              {{ Intl.NumberFormat(undefined, {}).format(columnTotals.ResearchCount) }}
            </td>
            <td colspan="2" class="text-right border">
              {{ Intl.NumberFormat(undefined, {}).format(columnTotals.ConclusionCount) }}
            </td>
            <td colspan="2" class="text-right border">
              {{ Intl.NumberFormat(undefined, {}).format(columnTotals.TotalElderlyCount) }}
            </td>
          </tr> -->
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
<style scoped>
.w300 {
  min-width: 250px !important;
}
</style>
