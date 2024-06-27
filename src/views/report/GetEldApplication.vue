<script setup lang="ts">
import { ref } from "vue";
import type { IFields, IFilter, ISelectList } from "@/models/basic";
import UiParentCard from "@/components/UiParentCard.vue";
import AdmManualService from "@/services/others/admmanual.service";
import { CheckIcon, PrinterIcon, XIcon } from "vue-tabler-icons";
import { reactive } from "vue";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useI18n } from "vue-i18n";
import { useGlobal } from "@/composables/useGlobal";
import { useManualStore } from "@/app/config/store/Manual";
import ReportService from "@/services/report/regReport.service";
import i18n from "@/app/config/i18n";

const { t } = useI18n();
const { setError } = useErrorToast();

interface CustomFilter extends IFilter {
  regionId: number | null;
  districtId: number | null;
  docDate: string;
  genderId: number | null;
  pinfl: string;
  personName: string;
}

const fields: IFields[] = [
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
    key: "applicationPersonFirstName",
    label: "firstName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicationPersonLastName",
    label: "lastName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicationPersonMiddleName",
    label: "middleName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicationPersonPassportSeria",
    label: "passportSeria",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicationPersonPassportNumber",
    label: "passportNum",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicationPersonBirthOn",
    label: "birhtOn",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicationPersonPinfl",
    label: "pinfl",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicationPersonGender",
    label: "genderName",
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
  },
  {
    key: "applicationDocNumber",
    label: "docNumber",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicationDocOn",
    label: "docOn",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "isDeath",
    label: "isDeath",
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
    key: "applicationCategory",
    label: "applicationCategory",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicationCurrentTypeStep",
    label: "currentApplicationTypeStep",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicatonStatus",
    label: "applicatonStatus",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "verificationDocNumber",
    label: "verificationDocNumber",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "verificationDocOn",
    label: "verificationDocOn",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "verificationStatus",
    label: "verificationStatus",
    thClass: "border",
    tdClass: "border"
  }
];

const DEFAULT_VALUES: CustomFilter = {
  page: 1,
  pageSize: 20,
  search: "",
  regionId: null,
  districtId: null,
  docDate: "",
  sortBy: "",
  orderType: "asc",
  genderId: null,
  pinfl: "",
  personName: ""
};

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
  ReportService.ExportEldApplication(filter)
    .then((res) => {
      forceFileDownload(res, t("GetEldApplication"), ".xlsx");
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
      apiName="GetEldApplication"
      tableHeight="600"
      :isDanger="true"
    >
      <template #header="{ refresh, getData }">
        <form-table-header :canCreate="false" hasMenu :filter="filter" @clearFilter="clearFilter" @refresh="refresh" @getData="getData">
          <template #menu-items>
            <v-card-text>
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
              <v-row class="py-0 mt-5 mb-0">
                <v-col class="py-0" cols="12">
                  <v-label class="mb-2 font-weight-medium">
                    {{ $t("docDate") }}
                  </v-label>
                </v-col>
                <v-col class="py-0">
                  <form-picker clearable class="w-100" v-model:model-value="filter.docDate" :placeholder="$t('docDate')" />
                </v-col>
              </v-row>
              <v-col class="py-1 px-0">
                <form-select v-model="filter.genderId" :list="genderList" :label="$t('gender')"></form-select>
              </v-col>
              <v-col class="py-1 px-0">
                <form-input :label="$t('pinfl')" v-model="filter.pinfl" :placeholder="$t('enterText')" />
              </v-col>
              <v-col class="py-1 px-0">
                <form-input :label="$t('fio')" v-model="filter.personName" :placeholder="$t('enterText')" />
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
      <template #isInSxv="{ item }">
        <div v-if="item.isInSxv">
          <!-- <CheckIcon /> -->
        </div>
        <div v-else>
          <!-- :color="item.isDeath ? 'rgb(var(--v-theme-light))' : ''" -->
          <XIcon size="20" />
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
      <template #elderlyServices="{ item }">
        <div style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden">
          {{ item.elderlyServices }}
        </div>

        <v-tooltip activator="parent" location="top">
          {{ item.elderlyServices }}
        </v-tooltip>
      </template>

      <template #organization="{ item }">
        <div style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden">
          {{ item.organization }}
        </div>

        <v-tooltip activator="parent" location="top">
          {{ item.organization }}
        </v-tooltip>
      </template>

      <template #applicantPersonAddress="{ item }">
        <div style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden">
          {{ item.applicantPersonAddress }}
        </div>

        <v-tooltip activator="parent" location="top">
          {{ item.applicantPersonAddress }}
        </v-tooltip>
      </template>

      <template #isDeath="{ item }">
        <div>
          {{ item.isDeath ? $t("yes") : $t("no") }}
        </div>
      </template>
      <template #reasonOfOut="{ item }">
        <div v-if="item.typeId == 0">
          {{ item.elderlyReasonOut }}
        </div>
      </template>
    </form-table>
  </UiParentCard>
</template>
