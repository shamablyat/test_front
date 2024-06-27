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
import { ArrowBarToDownIcon, ArrowBarToUpIcon, ChevronRightIcon, LayoutGridIcon, PrinterIcon } from "vue-tabler-icons";
import { FormBtn } from "@/models/vuetify/types";
import NotAttachAssistantReasonService from "@/services/info/notAttachAssistantReason.service";

const { t } = useI18n();

interface IFilter {
  startOn: string | null;
  endOn: string | null;
  byRegion: boolean;
  byDistrict: boolean;
  regionIds: number[];
  districtIds: number[];
  elderlyCategoryIds: number[];
  genderId: number | null;
  isInSxv: boolean | null;
  isDeathElderly: boolean | null;
  isCategoryMismatch: boolean | null;
  isActive: boolean | null;
  decisionFromDocDate: string | null;
  decisionToDocDate: string | null;
  date: string | null;
  isAttachedAssistant: boolean | null;
  notAttachAssistantReasonId: number | null;
}

const statusId = ref(0);

const { setError } = useErrorToast();
// const { handleDate } = useFormatter();
const { forceFileDownload } = useGlobal();

const rows = ref<any[]>([]);
const regionsList = ref<ISelectList[]>([]);
const elderlyCategories = ref<ISelectList[]>([]);
const columns = ref<{ [key: number]: string }>({});
const columnTotals = ref<{ [key: number]: string }>({});
const totalCount = ref<number>(0);
const outTotalCount = ref<number>(0);
const loading = ref<boolean>(false);
const printLoading = ref<boolean>(false);
const menu = ref<boolean>(false);
const notAttachReasonList = ref<any[]>([]);

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();

const today = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;

const DEFAULT_VALUES: IFilter = {
  decisionFromDocDate: null,
  decisionToDocDate: null,
  startOn: null,
  endOn: null,
  byRegion: true,
  byDistrict: false,
  regionIds: [],
  districtIds: [],
  elderlyCategoryIds: [],
  genderId: null,
  isInSxv: false,
  isDeathElderly: false,
  isCategoryMismatch: null,
  isActive: null,
  date: today,
  isAttachedAssistant: null,
  notAttachAssistantReasonId: null
};

const assistantList = [
  {
    // @ts-ignore
    text: i18n.global.t("all"),
    value: null
  },
  {
    text: i18n.global.t("no"),
    value: false
  },
  {
    text: i18n.global.t("yes"),
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

const tabs: FormBtn[] = [
  {
    label: "All",
    prependIcon: LayoutGridIcon
  },
  {
    label: "InTables",
    prependIcon: ArrowBarToDownIcon
  },
  {
    label: "OutTables",
    prependIcon: ArrowBarToUpIcon
  }
];

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

const getNotReasonList = () => {
  NotAttachAssistantReasonService.GetAsSelectList().then((res) => {
    notAttachReasonList.value = res.data;
  });
};
getNotReasonList();
getGenderList();

const filter: IFilter = reactive({ ...DEFAULT_VALUES });

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

  ReportService.GetRegisteredElderly(innerFilter)
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
  ReportService.ExportElderlyRegisterByRegion(filter)
    .then((res) => {
      printLoading.value = false;
      forceFileDownload(res, t("GetRegisteredElderly"), ".xlsx");
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

const changeIsActive = () => {
  switch (statusId.value) {
    case 0:
      return (filter.isActive = null);
    case 1:
      return (filter.isActive = true);
    case 2:
      return (filter.isActive = false);
    default:
      return (filter.isActive = null);
  }
};

getRegions();
getElderlySelectList();

refresh();
</script>

<template>
  <UiParentCard>
    <form-table-header :filter="filter" hasMenu @refresh="refresh" @clearFilter="clearFilter" :can-clear="false">
      <template #search>
        <div>
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
              :class="[!filter.byRegion ? 'text-disabled' : '']"
            >
              {{ $t("All") }}
            </v-breadcrumbs-item>
            <ChevronRightIcon size="14" v-if="filter.byDistrict" />
            <v-breadcrumbs-item class="text-disabled h6" v-if="filter.byDistrict">
              {{ $t("district") }}
            </v-breadcrumbs-item>
          </v-breadcrumbs>
        </div>
      </template>
      <template #menu-items>
        <v-card-text>
          <v-row class="mx-2">
            <v-col cols="12" md="12" sm="12" class="py-0 px-0">
              <form-select
                v-model="filter.elderlyCategoryIds"
                :list="elderlyCategories"
                multiple
                :label="$t('elderlyCategory')"
                noSearch
              ></form-select>
            </v-col>
            <v-col cols="12" md="12" sm="12" class="py-0 my-2 px-0">
              <form-select v-model="filter.regionIds" multiple :list="regionsList" :label="$t('region')"> </form-select>
            </v-col>
            <v-col class="py-0" cols="12 px-0">
              <v-label class="mb-2 font-weight-medium">
                {{ $t("decisionDocDate") }}
              </v-label>
            </v-col>
            <v-col class="py-0 px-1" cols="6">
              <form-picker clearable v-model="filter.decisionFromDocDate" />
            </v-col>
            <v-col class="py-0 px-1" cols="6">
              <form-picker clearable v-model="filter.decisionToDocDate" />
            </v-col>
            <v-col class="py-0 mt-2 px-0" cols="12">
              <v-label class="mb-2 font-weight-medium">
                {{ $t("remainDate") }}
              </v-label>
            </v-col>
            <v-col class="py-0 px-0" cols="12">
              <form-picker clearable class="w-100" v-model:model-value="filter.date" :placeholder="$t('remainDate')" />
            </v-col>
            <v-col cols="12" class="py-0 mt-2 px-0">
              <form-select v-model="filter.isCategoryMismatch" :list="categoryMismatchList" :label="$t('categoryMismatch')"></form-select>
            </v-col>
            <v-col cols="12" class="py-0 mt-2 px-0">
              <form-select v-model="filter.isInSxv" :list="isInSxvList" :label="$t('isInSxv')"></form-select>
            </v-col>
            <v-col cols="12" class="py-0 mt-2 px-0">
              <form-select v-model="filter.isDeathElderly" :list="isDeathList" :label="$t('deathInformation')"></form-select>
            </v-col>
            <v-col cols="12" class="py-0 mt-2 px-0">
              <form-select v-model="filter.genderId" :list="genderList" :label="$t('gender')"></form-select>
            </v-col>

            <v-col cols="12" class="py-0 mt-2 px-0">
              <form-select v-model="filter.isAttachedAssistant" :list="assistantList" :label="$t('attachAssistant')"></form-select>
            </v-col>
            <v-col cols="12" class="py-0 mt-2 px-0">
              <form-select v-model="filter.notAttachAssistantReasonId" :list="notAttachReasonList" :label="$t('notAttachReason')"></form-select>
            </v-col>
          </v-row>
        </v-card-text>
      </template>
      <template #create>
        <v-btn @click="printReport" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
      </template>

      <template #header-bottom>
        <v-row>
          <v-col>
            <form-toggle-buttons
              divided
              border
              :tabs="tabs"
              v-model="statusId"
              @update:modelValue="
                () => {
                  changeIsActive();
                  refresh();
                }
              "
            />
          </v-col>
        </v-row>
      </template>
    </form-table-header>
    <v-card class="border" elevation="0">
      <v-table fixed-header height="auto" density="compact">
        <thead>
          <tr>
            <th v-if="filter.regionIds.length === 0 || filter.regionIds.includes(999)" class="font-weight-bold text-center h6 border">
              {{ $t("region") }}
            </th>
            <th
              rowspan="2"
              class="font-weight-bold text-center h6 border"
              v-if="(filter.regionIds.length > 0 && filter.districtIds.length === 0) || filter.districtIds.includes(999)"
            >
              {{ $t("district") }}
            </th>
            <th colspan="2" class="font-weight-bold text-center h6 border">
              {{ $t("rowSum") }}
            </th>
            <template v-for="item in columns">
              <th colspan="2" class="font-weight-bold text-center h6 border">
                {{ item }}
              </th>
            </template>

            <!-- <th colspan="2" class="font-weight-bold text-center h6 border">
              {{ $t("outTotalCount") }}
            </th> -->
          </tr>
        </thead>
        <tbody v-if="!loading && rows.length > 0" style="min-height: 400px">
          <tr v-for="(item, index) in rows" :key="index + 'row'">
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
            <td colspan="2" class="text-right border font-weight-bold">
              {{ item.totalCount }}
            </td>

            <td colspan="2" class="text-right border" v-for="(_, fieldIndex) in columns" :key="fieldIndex">
              {{ Intl.NumberFormat(undefined, {}).format(item.itemCounts[fieldIndex]) }}
            </td>

            <!-- <td colspan="2" class="text-right border font-weight-bold">
              {{ Intl.NumberFormat(undefined, {}).format(item.outTotalCount) }}
            </td> -->
          </tr>
          <tr class="total">
            <td class="font-weight-bold border">
              <v-btn style="background: transparent" class="font-weight-bold">
                {{ $t("total") }}
              </v-btn>
            </td>

            <td colspan="2" class="text-right border font-weight-bold">
              {{ Intl.NumberFormat(undefined, {}).format(totalCount) }}
            </td>

            <td colspan="2" class="text-right border font-weight-bold" v-for="column in columnTotals">
              {{ Intl.NumberFormat(undefined, {}).format(+column) }}
            </td>

            <!-- <td colspan="2" class="text-right border font-weight-bold">
              {{ Intl.NumberFormat(undefined, {}).format(outTotalCount) }}
            </td> -->
          </tr>
        </tbody>
        <tbody class="text-center" v-if="loading">
          <td colspan="11" class="text-center py-2">
            <v-progress-circular indeterminate></v-progress-circular>
          </td>
        </tbody>
        <tbody v-if="!loading && rows && rows.length == 0">
          <td colspan="11" class="py-2 font-weight-bold h5 text-center">
            {{ $t("NotFound") }}
          </td>
        </tbody>
      </v-table>
    </v-card>
  </UiParentCard>
</template>
