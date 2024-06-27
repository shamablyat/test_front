<script setup lang="ts">
import i18n from "@/app/config/i18n";
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import type { ISelectList } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import ManualService from "@/services/others/manual.service";
import ReportService from "@/services/report/regReport.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { reactive } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronRightIcon, PrinterIcon } from "vue-tabler-icons";

const { t } = useI18n();
const { parseNumber } = useGlobal();

interface IFilter {
  byRegion: boolean;
  byDistrict: boolean;
  regionIds: number[];
  districtIds: number[];
  isCategoryMismatch: boolean | null;
  isDeathElderly: boolean | null;
  isActualElderly: boolean | null;
  isInSxv: boolean | null;
  elderlyCategoryId: number | null;
  date: string | null;
  IsActualAssistants: boolean | null;
}
interface IColumns {
  [key: number]: string;
}

const { setError } = useErrorToast();
const { forceFileDownload } = useGlobal();

const data = ref<any[]>([]);
const allData = ref<any>();
const dataTotal = ref<any[]>([]);
const regionsList = ref<ISelectList[]>([]);
const elderlyCategories = ref<any[]>([]);
const columns = ref<IColumns>({});
const columnTotals = ref<{ [key: number]: string }>({});
const totalCounts = ref<number>(0);
const loading = ref<boolean>(false);
const printLoading = ref<boolean>(false);
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();

const today = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;

const DEFAULT_VALUES: IFilter = reactive({
  byRegion: true,
  byDistrict: false,
  regionIds: [],
  districtIds: [],
  isCategoryMismatch: null,
  isDeathElderly: null,
  isActualElderly: null,
  elderlyCategoryId: null,
  isInSxv: null,
  date: today,
  IsActualAssistants: null
});
const filter: IFilter = reactive({ ...DEFAULT_VALUES });

const categoryMismatchList = [
  {
    // @ts-ignore
    text: i18n.global.t("all"),
    value: null
  },
  {
    text: i18n.global.t("isRight"),
    value: false
  },
  {
    text: i18n.global.t("isNotRight"),
    value: true
  }
];

const isInSxvList = [
  {
    // @ts-ignore
    text: i18n.global.t("all"),
    value: null
  },
  {
    text: i18n.global.t("available"),
    value: true
  },
  {
    text: i18n.global.t("notAvailable"),
    value: false
  }
];

const isDeathList = [
  {
    // @ts-ignore
    text: i18n.global.t("all"),
    value: null
  },
  {
    text: i18n.global.t("theDead"),
    value: true
  },
  {
    text: i18n.global.t("theAlive"),
    value: false
  }
];

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
  data.value = [];
  allData.value = [];

  dataTotal.value = [];
  columns.value = [];
  loading.value = true;
  ReportService.GetRegisteredElderlyWithAssistant(innerFilter)
    .then((res) => {
      data.value = res.data.rows;
      allData.value = res.data;
      dataTotal.value = res.data.columnTotals;
      columns.value = {
        [res.data.elderlyCategoryId]: res.data.column
      };
      columnTotals.value = res.data.columnTotals;
      totalCounts.value = res.data.totalCount;
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      loading.value = false;
    });
};

const ChangeInfo = (value: any) => {
  if (filter.byRegion) {
    filter.byRegion = false;
    filter.byDistrict = true;
    filter.regionIds = [value.regionId];
    refresh();
  } else if (filter.byDistrict) {
    filter.byRegion = true;
    filter.byDistrict = false;
    filter.districtIds = [value.districtId];
  }
};

const getElderlySelectList = () => {
  ManualService.GetElderlyCategorySelectList("", true).then((res) => {
    elderlyCategories.value.push(...res.data);
  });
  ManualService.GetElderlyCategorySelectList("", false).then((res) => {
    elderlyCategories.value.push(...res.data);
  });

  elderlyCategories.value.unshift({ value: null, text: i18n.global.t("all") });
};

const getRegions = () => {
  AdmManualService.RegionSelectlist().then((res) => {
    regionsList.value = res.data;
    regionsList.value.unshift({
      value: 999,
      orderCode: "all",
      text: t("allRegions")
    });
  });
};

const printReportwithAssistent = () => {
  printLoading.value = true;
  ReportService.ExportElderlyRegisterByRegionWithAssistant(filter)
    .then((res) => {
      printLoading.value = false;
      forceFileDownload(res, t("GetRegisteredElderly"), ".xlsx");
    })
    .catch((err) => {
      setError(err);
      printLoading.value = false;
    });
};

getRegions();
getElderlySelectList();
refresh();
function clearFilter() {
  Object.assign(filter, DEFAULT_VALUES);
}
</script>

<template>
  <UiParentCard>
    <form-table-header :canCreate="false" :filter="filter" hasMenu @refresh="refresh" @clear-filter="clearFilter" :can-clear="false">
      <template #search>
        <v-breadcrumbs>
          <v-breadcrumbs-item
            style="cursor: pointer"
            @click="
              () => {
                filter.byDistrict = false;
                filter.byRegion = true;
                filter.regionIds = [];
                filter.districtIds = [];
                refresh();
              }
            "
            class="h6"
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
      <template #menu-items>
        <v-row class="mx-2">
          <v-col class="py-0 mt-2" cols="12">
            <v-label class="mb-2 font-weight-medium">
              {{ $t("remainDate") }}
            </v-label>
          </v-col>
          <v-col class="py-0" cols="12">
            <form-picker clearable class="w-100" v-model:model-value="filter.date" :placeholder="$t('remainDate')" />
          </v-col>
          <v-col cols="12" class="py-0 mt-2">
            <form-select v-model="filter.elderlyCategoryId" :list="elderlyCategories" :label="$t('elderlyCategory')"></form-select>
          </v-col>
          <v-col cols="12" class="py-0 mt-2">
            <form-select v-model="filter.regionIds" multiple :list="regionsList" :label="$t('region')"> </form-select>
          </v-col>
          <v-col cols="12" class="py-0 mt-2">
            <form-select v-model="filter.isCategoryMismatch" :list="categoryMismatchList" :label="$t('categoryMismatch')"></form-select>
          </v-col>
          <v-col cols="12" class="py-0 mt-2">
            <form-select v-model="filter.isInSxv" :list="isInSxvList" :label="$t('isInSxv')"></form-select>
          </v-col>
          <v-col cols="12" class="py-0 mt-2">
            <form-select v-model="filter.isDeathElderly" :list="isDeathList" :label="$t('deathInformation')"></form-select>
          </v-col>
          <v-col cols="12" class="py-0 mt-2" style="display: none">
            <form-checkbox v-model="filter.isActualElderly" :label="$t('isElderly.isActual')"></form-checkbox>
          </v-col>
        </v-row>
      </template>
      <template #create>
        <v-btn @click="printReportwithAssistent" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
      </template>
    </form-table-header>

    <v-card class="border py-0" elevation="0">
      <v-table fixed-header density="compact">
        <thead>
          <tr>
            <th v-if="filter.regionIds.length === 0 || filter.regionIds.includes(999)" class="font-weight-bold text-center h6 border" rowspan="3">
              {{ $t("region") }}
            </th>
            <th
              rowspan="3"
              class="font-weight-bold text-center h6 border"
              v-if="(filter.regionIds.length > 0 && filter.districtIds.length === 0) || filter.districtIds.includes(999)"
            >
              {{ $t("district") }}
            </th>

            <th rowspan="3" class="font-weight-bold text-center h6 border">
              {{ $t("total") }}
            </th>
          </tr>
          <tr>
            <th colspan="4" class="font-weight-bold text-center h6 border">
              {{ $t("acceptedElderlies") }}
            </th>
            <th colspan="2" class="font-weight-bold text-center h6 border">
              {{ $t("noAcceptedElderlies") }}
            </th>
            <th
              :colspan="allData.notAttachedByReasonColumns ? Object.keys(allData?.notAttachedByReasonColumns).length + 2 : 2"
              class="font-weight-bold text-center h6 border"
            >
              {{ $t("noAcceptedByReasonElderlies") }}
            </th>
            <th colspan="3" class="font-weight-bold text-center h6 border">
              {{ $t("acceptedAssistants") }}
            </th>
          </tr>
          <tr>
            <th class="font-weight-bold text-center h6 border">
              {{ $t("count") }}
            </th>
            <th class="font-weight-bold text-center h6 border">
              {{ $t("percentage") }}
            </th>
            <th class="font-weight-bold text-center h6 border">
              {{ $t("hour") }}
            </th>
            <th class="font-weight-bold text-center h6 border">
              {{ $t("averageHour") }}
            </th>

            <!-- noAcceptedElderlies -->
            <th class="font-weight-bold text-center h6 border">
              {{ $t("count") }}
            </th>
            <th class="font-weight-bold text-center h6 border">
              {{ $t("percentage") }}
            </th>
            <template v-if="allData.notAttachedByReasonColumns">
              <th class="font-weight-bold text-center h6 border" v-for="(item, index) in allData.notAttachedByReasonColumns" :key="index">
                {{ item }}
              </th>
            </template>
            <th class="font-weight-bold text-center h6 border">
              {{ $t("count") }}
            </th>
            <th class="font-weight-bold text-center h6 border">
              {{ $t("percentage") }}
            </th>

            <!-- acceptedAssistants -->
            <th class="font-weight-bold text-center h6 border">
              {{ $t("count") }}
            </th>
            <th class="font-weight-bold text-center h6 border">
              {{ $t("averageCount") }}
            </th>
            <th class="font-weight-bold text-center h6 border">
              {{ $t("averageHour") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data">
            <td v-if="filter.regionIds.length === 0 || filter.regionIds.includes(999)" class="border">
              <v-btn style="background: transparent" class="font-weight-bold text-info text-right" @click="ChangeInfo(item)">
                {{ item.region }}
              </v-btn>
            </td>
            <td v-if="(filter.regionIds.length > 0 && filter.districtIds.length === 0) || filter.districtIds.includes(999)" class="border">
              <v-btn style="background: transparent" class="font-weight-bold text-info text-right">
                {{ item.district }}
              </v-btn>
            </td>
            <td class="text-right border">{{ Intl.NumberFormat(undefined, {}).format(item.elderlyCount) }}</td>
            <td class="text-right border" v-for="(ass, index) in item.acceptedElderlies">
              <template
                v-if="
                  //@ts-ignore
                  index == 'count' || index == 'averageCount'
                "
              >
                {{ parseNumber(ass) }}
              </template>
              <template
                v-if="
                  // @ts-ignore
                  index == 'totalHour' || index == 'averageHour'
                "
              >
                {{ parseNumber(ass) }}
              </template>
              <template
                v-if="
                  // @ts-ignore
                  index == 'percentage'
                "
              >
                {{ ass }}%
              </template>
            </td>
            <template v-for="(ass, index) in item.noAcceptedElderlies">
              <td
                class="text-right border"
                v-if="
                  //@ts-ignore
                  index == 'count' || index == 'averageCount'
                "
              >
                {{ parseNumber(ass) }}
              </td>
              <td
                class="text-right border"
                v-if="
                  // @ts-ignore
                  index == 'totalHour' || index == 'averageHour'
                "
              >
                {{ parseNumber(ass) }}
              </td>
              <td
                class="text-right border"
                v-if="
                  // @ts-ignore
                  index == 'percentage'
                "
              >
                {{ ass }}%
              </td>
            </template>
            <template
              v-if="
                item.noAcceptedByReasonElderlies.notAttachedByReasonCounts
                  ? Object.keys(item.noAcceptedByReasonElderlies.notAttachedByReasonCounts).length
                  : false
              "
            >
              <td class="text-right border" v-for="countReason in item.noAcceptedByReasonElderlies.notAttachedByReasonCounts">
                {{ countReason }}
              </td>
            </template>
            <template v-for="(ass, index) in item.noAcceptedByReasonElderlies">
              <td
                class="text-right border"
                v-if="
                  //@ts-ignore
                  index == 'count' || index == 'averageCount'
                "
              >
                {{ parseNumber(ass) }}
              </td>
              <td
                class="text-right border"
                v-if="
                  // @ts-ignore
                  index == 'totalHour' || index == 'averageHour'
                "
              >
                {{ parseNumber(ass) }}
              </td>
              <td
                class="text-right border"
                v-if="
                  // @ts-ignore
                  index == 'percentage'
                "
              >
                {{ ass }}%
              </td>
            </template>

            <td class="text-right border" v-for="(ass, index) in item.acceptedAssistants">
              <template
                v-if="
                  //@ts-ignore
                  index == 'count' || index == 'averageCount'
                "
              >
                {{ parseNumber(ass) }}
              </template>
              <template
                v-if="
                  // @ts-ignore
                  index == 'totalHour' || index == 'averageHour'
                "
              >
                {{ parseNumber(ass) }}
              </template>
              <template
                v-if="
                  // @ts-ignore
                  index == 'percentage'
                "
              >
                {{ ass }}%
              </template>
            </td>
          </tr>
          <tr class="total">
            <td class="font-weight-bold border">
              <v-btn style="background: transparent" class="font-weight-bold">
                {{ $t("total") }}
              </v-btn>
            </td>
            <template v-for="(el, key) in dataTotal">
              <td class="text-right font-weight-bold border">
                {{ parseNumber(el) }}
              </td>
              <template
                v-if="
                  // @ts-ignore
                  key == 'NoAcceptedElderlyPercentage'
                "
              >
                <td class="text-right font-weight-bold border" v-for="item in allData.notAttachedByReasonColumnTotals">
                  {{ parseNumber(item) }}
                </td>
              </template>
            </template>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </UiParentCard>
</template>
