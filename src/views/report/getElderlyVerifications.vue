<script setup lang="ts">
import { ref } from "vue";
import type { IFields, IFilter, ISelectList } from "@/models/basic";
import UiParentCard from "@/components/UiParentCard.vue";
import AdmManualService from "@/services/others/admmanual.service";
import { CheckIcon, LayoutGridIcon, PrinterIcon, XIcon } from "vue-tabler-icons";
import { reactive } from "vue";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useI18n } from "vue-i18n";
import { useGlobal } from "@/composables/useGlobal";
import { useManualStore } from "@/app/config/store/Manual";
import ElderlyVerificationService from "@/services/document/elderlyVerification.service.ts";
import { FormBtn } from "@/models/vuetify/types";

const { t } = useI18n();
const { setError } = useErrorToast();

interface CustomFilter extends IFilter {
  regionId: number | null;
  districtId: number | null;
  docDate: string;
  onlyNewElderly: boolean | null;
}

const tabs: FormBtn[] = [
  {
    label: "All",
    prependIcon: LayoutGridIcon
  },
  {
    label: "newCountTables",
    prependIcon: LayoutGridIcon
  },
  {
    label: "reCountTables",
    prependIcon: LayoutGridIcon
  }
];

const statusId = ref(0);

const changeIsActive = () => {
  switch (statusId.value) {
    case 0:
      return (filter.onlyNewElderly = null);
    case 1:
      return (filter.onlyNewElderly = true);
    case 2:
      return (filter.onlyNewElderly = false);
    default:
      return (filter.onlyNewElderly = null);
  }
};

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
    key: "organizationRegion",
    label: "organizationRegion",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "organizationDistrict",
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
    key: "conclusionNumber",
    label: "conclusionNumber",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "conclusionDateOn",
    label: "conclusionDateOn",
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
    key: "applicantPersonLastName",
    label: "lastName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonFirstName",
    label: "firstName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonMiddleName",
    label: "middleName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonDocSeria",
    label: "passportSeria",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonDocNumber",
    label: "passportNum",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonBirthOn",
    label: "birhtOn",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonPinfl",
    label: "pinfl",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonGender",
    label: "genderName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonCitizenship",
    label: "nationalityName",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonRegion",
    label: "region",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonDistrict",
    label: "district",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonMFY",
    label: "mfy",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonAddress",
    label: "address",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonTemporaryAddress",
    label: "temporaryResidenceType",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonPensionType",
    label: "pensionType",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "applicantPersonPensionAmount",
    label: "pensionAmount",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyRegisterInReason",
    label: "elderlyRegisterInReason",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyRegisterOutReason",
    label: "elderlyRegisterOutReason",
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
    key: "familyMembers",
    label: "familyMembers",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyAloneReason",
    label: "elderlyFamilyMemberPlace",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "dateOfLastDispensaryInspectionOn",
    label: "lastPolyclinicOn",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "mainIcd10",
    label: "mainIcd10",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "mnns",
    label: "preferentialMnnIds",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "treatmentType",
    label: "treatmentType",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "elderlyServices",
    label: "serviceType",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "isAlone",
    label: "isAlone",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "totalBall",
    label: "totalBall",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "bartelTotalBall",
    label: "bartelTotalBall",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "dayCount",
    label: "dayCount",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "dailyHour",
    label: "bartelDailyHour",
    thClass: "border",
    tdClass: "border"
  },
  {
    key: "status",
    label: "status",
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
  onlyNewElderly: null
};
const filter: CustomFilter = reactive({ ...DEFAULT_VALUES });
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
  ElderlyVerificationService.ExportElderlyVerifications(filter)
    .then((res) => {
      forceFileDownload(res, t("GetElderlyVerifications"), ".xlsx");
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
      :service="ElderlyVerificationService"
      apiName="GetElderlyVerifications"
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

      <template #isAlone="{ item }">
        <div>
          {{ item.isAlone ? $t("yes") : $t("no") }}
        </div>
      </template>
      <template #familyMembers="{ item }">
        <v-card class="my-2" v-if="item.familyMembers.length" v-for="(member, index) in item.familyMembers" :key="index" elevation="1">
          <v-chip size="small" class="my-1 mx-1">
            {{ $t("fullName") + ": " + (member.fullName || "-") }}
          </v-chip>
          <v-chip size="small" class="my-1 mx-1">
            {{ $t("kinshipDegree") + ": " + (member.kinshipDegree || "-") }}
          </v-chip>
          <v-chip size="small" class="my-1 mx-1">
            {{ $t("elderlyFamilyMemberPlace") + ": " + (member.elderlyFamilyMemberPlace || "-") }}
          </v-chip>
        </v-card>
        <div v-else>-</div>
      </template>
      <template #reasonOfOut="{ item }">
        <div v-if="item.typeId == 0">
          {{ item.elderlyReasonOut }}
        </div>
      </template>
    </form-table>
  </UiParentCard>
</template>
