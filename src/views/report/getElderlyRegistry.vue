<script setup lang="ts">
import { ref } from "vue";
import type { IFields, IFilter, ISelectList } from "@/models/basic";
import UiParentCard from "@/components/UiParentCard.vue";
import ReportService from "@/services/report/regReport.service";
import AdmManualService from "@/services/others/admmanual.service";
import { ArrowBarToDownIcon, ArrowBarToUpIcon, CheckIcon, LayoutGridIcon, PrinterIcon, XIcon, RefreshIcon } from "vue-tabler-icons";
import { reactive } from "vue";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useI18n } from "vue-i18n";
import { useGlobal } from "@/composables/useGlobal";
import { FormBtn } from "@/models/vuetify/types";
import { useManualStore } from "@/app/config/store/Manual";
import i18n from "@/app/config/i18n";
import { useRouter } from "vue-router";
import ManualService from "@/services/others/manual.service";
import NotAttachAssistantReasonService from "@/services/info/notAttachAssistantReason.service";
import ElderlyManageService from "@/services/document/elderlyManage.service";

const { t } = useI18n();
const { setError } = useErrorToast();
const router = useRouter();

interface CustomFilter extends IFilter {
  personName: string;
  pinfl: string;
  isCategoryMismatch: boolean | null;
  isInSxv: boolean | null;
  isActive: boolean | null;
  regionId: number | null;
  districtId: number | null;
  docNumber: string;
  decisionDocNumber: string;
  decisionFromDocDate: string | null;
  decisionToDocDate: string | null;
  isDeathElderly: boolean | null;
  fromDocDate: string;
  toDocDate: string;
  date: string | null;
  elderlyCategoryId: number | null;
  genderId: number | null;
  isOnlyCanReassessment: boolean;
  isOnlyCanUnregister: boolean;
  issuePeriodReassessment: boolean;
  isAttachedAssistant: boolean | null;
  notAttachAssistantReasonId: number | null;
}

const elderlyCategories = ref<ISelectList[]>([]);
const genderList = ref<any[]>([]);
const notAttachReasonList = ref<any[]>([]);
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

const statusId = ref(0);

const fields: IFields[] = [
  {
    key: "actions",
    label: "actions",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "orderCode",
    label: "orderCode",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "id",
    label: "id",
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
    key: "organization",
    label: "organization",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "docNumber",
    label: "docNumber",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "docOn",
    label: "docOn",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyOutDecisionDocNumber",
    label: "elderlyOutDecisionDocNumber",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyOutDecisionDocOn",
    label: "elderlyOutDecisionDocOn",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "isCategoryMismatch",
    label: "isCategoryMismatch",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "isInSxv",
    label: "isInSxv",
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
    key: "passportSeria",
    label: "passportSeria",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "passportNumber",
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
    key: "deathOn",
    label: "deathOn",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "phoneNumber",
    label: "phoneNumber",
    thClass: "border ws-nowrap",
    tdClass: "border ws-nowrap"
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
    key: "personMfy",
    label: "sgm",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "livingAddress",
    label: "livingAddress",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "temporaryAddress",
    label: "temporaryAddress",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "pensionType",
    label: "pensionType",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "pensionAmount",
    label: "pensionAmount",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "disabilityGroup",
    label: "disabilityGroup",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyCategory",
    label: "elderlyCategory",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "inElderly",
    label: "inElderly",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyReasonIn",
    label: "reasonOfEntry",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyReasonOut",
    label: "outOfReason",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "reasonOfOut",
    label: "reasonOfOut",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "attachAssistant",
    label: "attachAssistant",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "notAttachAssistantReason",
    label: "notAttachReason",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "status",
    label: "status",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "createdUser",
    label: "createdUser",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "modifiedUser",
    label: "modifiedUser",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "modifiedAt",
    label: "modifiedAt",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "lastOperation",
    label: "lastOperation",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "childrenCount",
    label: "childrenCount",
    thClass: "border",
    tdClass: "border"
  }
];

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();
const table = ref<any>(null);
const childLoading = ref<boolean>(false);
const today = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;

const DEFAULT_VALUES: CustomFilter = {
  page: 1,
  pageSize: 20,
  orderType: "asc",
  search: "",
  totalRows: 0,
  personName: "",
  pinfl: "",
  regionId: null,
  districtId: null,
  docNumber: "",
  decisionDocNumber: "",
  decisionFromDocDate: null,
  decisionToDocDate: null,
  fromDocDate: "",
  toDocDate: "",
  isOnlyCanReassessment: false,
  isCategoryMismatch: null,
  isDeathElderly: false,
  isInSxv: false,
  isActive: null,
  date: today,
  elderlyCategoryId: null,
  genderId: null,
  isOnlyCanUnregister: false,
  issuePeriodReassessment: false,
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

const filter: CustomFilter = reactive({ ...DEFAULT_VALUES });

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

const getElderlySelectList = () => {
  ManualService.GetElderlyCategorySelectList("", true).then((res) => {
    elderlyCategories.value.push(...res.data);
  });
  ManualService.GetElderlyCategorySelectList("", false).then((res) => {
    elderlyCategories.value.push(...res.data);
  });
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
const menu = ref(false);
const printLoading = ref<boolean>(false);
const districtList = ref<ISelectList[]>([]);
const { forceFileDownload } = useGlobal();
const manual = useManualStore();
manual.setRegions();
const getDistrictList = (id: number) => {
  districtList.value = [];
  filter.districtId = null;
  AdmManualService.DistrictSelectList(id).then((res) => {
    districtList.value = res.data;
  });
};

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
  menu.value = false;
};

const printReport = () => {
  printLoading.value = true;
  ReportService.ExportElderlyRegisterInAndOut(filter)
    .then((res) => {
      forceFileDownload(res, t("GetElderlyRegistry"), ".xlsx");
      printLoading.value = false;
    })
    .catch((err) => {
      setError(err);
      printLoading.value = false;
    });
};
const RefreshChildrenCount = () => {
  childLoading.value = true;
  ElderlyManageService.RefreshChildrenCount({})
    .then(() => {
      table.value.refresh();
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      childLoading.value = false;
    });
};

const createVerificationPage = (id: number | string) => {
  router.push({
    name: "EditVerification",
    params: { id: 0 },
    query: {
      manageId: id
    }
  });
};

const createUnregisterPage = (id: number | string) => {
  router.push({
    name: "EditElderlyRegister",
    params: { id: 0 },
    query: {
      unregisterId: id
    }
  });
};

getNotReasonList();
getElderlySelectList();
getGenderList();
</script>

<template>
  <UiParentCard>
    <form-table
      class="reestr"
      :fields="fields"
      :filter="filter"
      :service="ReportService"
      apiName="GetElderlyRegistry"
      tableHeight="400"
      :isDanger="true"
      :ref="table"
    >
      <template #header="{ refresh, getData }">
        <form-table-header :canCreate="false" hasMenu :filter="filter" @clearFilter="clearFilter" @refresh="refresh" @getData="getData">
          <template #menu-items>
            <v-card-text>
              <v-col class="py-1 px-0">
                <form-input :label="$t('fio')" v-model="filter.personName" :placeholder="$t('enterText')" />
              </v-col>
              <v-col class="py-1 px-0">
                <form-input :label="$t('pinfl')" v-model="filter.pinfl" :placeholder="$t('enterText')" />
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
                <form-select :list="districtList" v-model="filter.districtId" :label="$t('district')" :placeholder="$t('district')"> </form-select>
              </v-col>
              <v-col class="px-0 py-1">
                <form-select
                  clearable
                  v-model="filter.elderlyCategoryId"
                  :list="elderlyCategories"
                  :label="$t('elderlyCategory')"
                  noSearch
                ></form-select>
              </v-col>
              <v-row class="mt-1 py-0">
                <v-col class="py-0">
                  <form-input v-model="filter.docNumber" :label="$t('docNumber')" />
                </v-col>
                <v-col class="py-0">
                  <form-input v-model="filter.decisionDocNumber" :label="$t('decisionDocNumber')" />
                </v-col>
              </v-row>
              <v-row class="py-0 mt-5 mb-0">
                <v-col class="py-0" cols="12">
                  <v-label class="mb-2 font-weight-medium">
                    {{ $t("decisionDocDate") }}
                  </v-label>
                </v-col>
                <v-col class="py-0" cols="6">
                  <form-picker clearable class="w-100" v-model:model-value="filter.decisionFromDocDate" :placeholder="$t('startdate')" />
                </v-col>
                <v-col class="py-0" cols="6">
                  <form-picker clearable class="w-100" v-model:model-value="filter.decisionToDocDate" :placeholder="$t('enddate')" />
                </v-col>
              </v-row>
              <v-row class="py-0 mt-5 mb-0">
                <v-col class="py-0" cols="12">
                  <v-label class="mb-2 font-weight-medium">
                    {{ $t("docDate") }}
                  </v-label>
                </v-col>
                <v-col class="py-0" cols="6">
                  <form-picker clearable class="w-100" v-model:model-value="filter.fromDocDate" :placeholder="$t('startdate')" />
                </v-col>
                <v-col class="py-0" cols="6">
                  <form-picker clearable class="w-100" v-model:model-value="filter.toDocDate" :placeholder="$t('enddate')" />
                </v-col>
                <v-col class="py-0 mt-2" cols="12">
                  <v-label class="mb-2 font-weight-medium">
                    {{ $t("remainDate") }}
                  </v-label>
                </v-col>
                <v-col class="py-0" cols="12">
                  <form-picker clearable class="w-100" v-model:model-value="filter.date" :placeholder="$t('remainDate')" />
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
                <v-col cols="12" class="py-0 mt-2">
                  <form-select v-model="filter.genderId" :list="genderList" :label="$t('gender')"></form-select>
                </v-col>
                <v-col cols="12" class="py-0 mt-2">
                  <form-select v-model="filter.isAttachedAssistant" :list="assistantList" :label="$t('attachAssistant')"></form-select>
                </v-col>
                <v-col cols="12" class="py-0 mt-2">
                  <form-select v-model="filter.notAttachAssistantReasonId" :list="notAttachReasonList" :label="$t('notAttachReason')"></form-select>
                </v-col>
                <v-col cols="12" class="py-0 mt-2">
                  <form-checkbox density="comfortable" v-model="filter.isOnlyCanReassessment" :label="$t('isOnlyCanReassessment')"> </form-checkbox>
                </v-col>
                <v-col cols="12" class="py-0 mt-2">
                  <form-checkbox density="comfortable" v-model="filter.isOnlyCanUnregister" :label="$t('isOnlyCanUnregister')"> </form-checkbox>
                </v-col>
                <v-col cols="12" class="py-0 mt-2">
                  <form-checkbox density="comfortable" v-model="filter.issuePeriodReassessment" :label="$t('issuePeriodReassessment')">
                  </form-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
          </template>
          <template #create>
            <v-btn @click="printReport" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
            <v-tooltip :text="$t('RefreshChildrenCount')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn @click="RefreshChildrenCount" :loading="printLoading" color="info" :icon="RefreshIcon" v-bind="props">
                  <RefreshIcon v-if="!childLoading" />
                  <v-progress-circular v-else indeterminate size="20" />
                </v-btn>
              </template>
            </v-tooltip>
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
      </template>
      <template #orderCode="{ index }">
        <span class="d-flex align-center justify-center"> {{ index + 1 }}</span></template
      >
      <template #isCategoryMismatch="{ item }">
        <div style="word-break: break-all">
          {{ item.categoryMismatchReason || "-" }}
        </div>
      </template>
      <template #isInSxv="{ item }">
        <div v-if="item.isInSxv"></div>
        <div v-else>
          <XIcon size="20" />
        </div>
      </template>
      <template #attachAssistant="{ item }">
        <div>
          {{ item.attachAssistant ? $t("yes") : $t("no") }}
        </div>
      </template>
      <template #inElderly="{ item }">
        <div v-if="item.typeId > 0">
          <CheckIcon />
        </div>
      </template>
      <template #elderlyReasonIn="{ item }">
        <div v-if="item.typeId > 0">
          {{ item.elderlyReasonIn }}
        </div>
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
      <template #elderlyReasonOut="{ item }">
        <div v-if="item.typeId == 0">
          <CheckIcon />
        </div>
      </template>
      <template #reasonOfOut="{ item }">
        <div v-if="item.typeId == 0">
          {{ item.elderlyReasonOut }}
        </div>
      </template>
      <template #actions="{ item }">
        <div v-if="item.canReassessment">
          <v-btn @click="createVerificationPage(item.id)" color="success" size="small" class="my-2"> {{ $t("createVerification") }} </v-btn>
        </div>
        <div v-if="item.canUnregister">
          <v-btn @click="createUnregisterPage(item.id)" color="success" size="small" class="my-2"> {{ $t("unregister") }} </v-btn>
        </div>
      </template>
    </form-table>
  </UiParentCard>
</template>
<style>
.ws-nowrap {
  white-space: nowrap;
}
</style>
