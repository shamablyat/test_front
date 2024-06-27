<script setup lang="ts">
import { reactive, ref } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import type { IFields, IFilter, ISelectList, ITableActions } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { useRouter } from "vue-router";
import EldApplicationService from "@/services/document/eldApplication.service";
import { LogoutIcon } from "vue-tabler-icons";
import { useManualStore } from "@/app/config/store/Manual";
import FormTable from "@/components/form/FormTable.vue";
import SetSocialEmployee from "./widgets/SetSocialEmployee.vue";
import { useGlobal } from "@/composables/useGlobal";

interface ICustomFilter extends IFilter {
  statusIds: number[];
  regionId: number | null;
  region: string;
  districtId: number | null;
  district: string;
  mfyId: number | null;
  mfy: string;
  fromDocDate: string;
  toDocDate: string;
  person: string;
  applicationCreationTypeId: number | null;
  isSocialEmployee: boolean;
  eldApplicationTypeIds: number[];
  currentApplicationTypeStepIds: number[];
}

const actions: ITableActions = {
  isView: false,
  isDelete: false,
  isEdit: false,
  canApprove: false,
  canCancel: false
};
const manual = useManualStore();
const { getColor } = useGlobal();

const permission = "EldApplication";
const routerName = "canCreateVerification";
const router = useRouter();

const districtList = ref<ISelectList[]>([]);
const mfyList = ref<ISelectList[]>([]);
const identifier = ref<boolean>(false);

const fields: IFields[] = [
  { key: "id", label: "id", sort: true },
  { key: "docNumber", label: "docNumber", sort: true },
  { key: "docOn", label: "docOn", sort: true },
  // { key: "expireOn", label: "expireOn", sort: true },

  {
    key: "serviceRecipientFullName",
    label: "serviceRecipientFullName",
    sort: true
  },
  {
    key: "socialEmployeeFullName",
    label: "socialEmployeeFullName",
    sort: true
  },
  { key: "serviceRecepientRegion", label: "region", sort: true },
  { key: "serviceRecepientDistrict", label: "district", sort: true },
  { key: "serviceRecepientMfy", label: "mfy", sort: true },
  { key: "currentApplicationTypeStep", label: "currentApplicationTypeStep", sort: true },
  { key: "status", label: "status", sort: false }
];
const DEFAULT_VALUES: ICustomFilter = {
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  totalRows: 0,
  statusIds: [],
  regionId: null,
  region: "",
  districtId: null,
  district: "",
  mfyId: null,
  mfy: "",
  fromDocDate: "",
  toDocDate: "",
  person: "",
  applicationCreationTypeId: null,
  isSocialEmployee: true,
  eldApplicationTypeIds: [1],
  currentApplicationTypeStepIds: [137]
};
const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });
const isCanSetSocialEmp = ref(false);
const selectedApp = ref<any>();
const manualStore = useManualStore();
manualStore.setDocumentTypeList();

const formTableRef = ref<Partial<typeof FormTable>>();

function clearFilter() {
  Object.assign(filter, DEFAULT_VALUES);
  router.replace({ name: routerName });
}
manual.setRegions();
function ChangeRegion() {
  filter.districtId = null;
  District(String(filter.regionId));
}

function District(regionId: number | string | null) {
  mfyList.value = [];
  filter.mfyId = null;
  filter.mfy = "";

  if (regionId) {
    AdmManualService.DistrictSelectList(regionId).then((res: any) => {
      districtList.value = res.data;
    });
  }
}

function getMfyList(regionId: number | string, districtId: number | string) {
  if (regionId) {
    AdmManualService.MfySelectList(regionId, districtId).then((res: any) => {
      mfyList.value = res.data;
    });
  }
}

const setField = (value: ISelectList, key: string) => {
  if (value) {
    // @ts-ignore
    filter[key + "Id"] = value.value;
    // @ts-ignore
    filter[key] = value.text;
  }
};

const goElderlyVerification = (item: any) => {
  if (!item.elderlyVerificationId) {
    router.push({
      name: "EditVerification",
      params: {
        id: 0
      },
      query: {
        applicationId: item.id
      }
    });
  } else {
    router.push({
      name: "EditVerification",
      params: {
        id: item.elderlyVerificationId
      }
    });
  }
};

const closeSocialEmployee = () => {
  if (formTableRef.value) {
    formTableRef.value.refresh();
  }
};
</script>

<template>
  <UiParentCard>
    <form-table
      :fields="fields"
      :filter="filter"
      :service="EldApplicationService"
      :routerName="routerName"
      :permission="permission"
      append-action
      :manualRefresh="identifier"
      ref="formTableRef"
    >
      <template #header="{ refresh, getData }">
        <form-table-header
          :canCreate="false"
          :canSearch="false"
          hasMenu
          :filter="filter"
          @clear-filter="clearFilter"
          @getData="getData"
          @refresh="refresh"
        >
          <template #menu-items>
            <v-row class="mt-4 mx-2">
              <v-col class="py-1">
                <form-input :label="$t('serviceRecipientFullName')" v-model="filter.person" :placeholder="$t('enterText')"></form-input>
              </v-col>
            </v-row>
            <v-row class="mt-2 mx-2">
              <v-col class="py-1">
                <form-select
                  :list="manual.regions"
                  v-model="filter.regionId"
                  :label="$t('region')"
                  :placeholder="$t('region')"
                  returnObject
                  @update:modelValue="(val: ISelectList) => {
      setField(val, 'region')
      ChangeRegion()
    }"
                >
                </form-select>
              </v-col>
            </v-row>
            <v-row class="mx-2 mt-4">
              <v-col class="py-1">
                <form-select
                  :list="districtList"
                  v-model="filter.districtId"
                  :label="$t('district')"
                  :placeholder="$t('district')"
                  returnObject
                  @update:modelValue="(val: ISelectList) => {
      setField(val, 'district')
      getMfyList(String(filter.regionId), val.value)
    }"
                >
                </form-select>
              </v-col>
            </v-row>
            <v-row class="mx-2 mt-4">
              <v-col class="py-1">
                <form-select
                  :list="mfyList"
                  v-model="filter.mfyId"
                  :label="$t('mfy')"
                  returnObject
                  @update:model-value="(val: ISelectList) => setField(val, 'mfy')"
                >
                </form-select>
              </v-col>
            </v-row>
            <v-row class="mx-2">
              <v-col class="py-1" cols="12">
                <v-label class="mb-2 font-weight-medium">{{ $t("docDate") }}</v-label>
              </v-col>
              <v-col class="py-1" cols="6">
                <form-picker clearable class="w-100" v-model:model-value="filter.fromDocDate" :placeholder="$t('startDate')" />
              </v-col>
              <v-col class="py-1" cols="6">
                <form-picker clearable class="w-100" v-model:model-value="filter.toDocDate" :placeholder="$t('endDate')" />
              </v-col>
            </v-row>
          </template>
        </form-table-header>
      </template>
      <template #actions="{ item, refresh }">
        <FormTableActions
          :item="item"
          :actions="actions"
          :permission="permission"
          :routerName="routerName"
          :service="EldApplicationService"
          @refresh="refresh"
        >
          <template #action>
            <div
              style="margin-right: 5px; cursor: pointer"
              @click="goElderlyVerification(item)"
              v-if="item.canCreateVrf || item.elderlyVerificationId"
            >
              <v-tooltip activator="parent" location="top">
                {{ $t("ElderlyVerification") }}
              </v-tooltip>
              <LogoutIcon size="20" color="success" />
            </div>
          </template>
        </FormTableActions>
      </template>
      <template #currentApplicationTypeStep="{ item }">
        <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" :color="getColor(item.currentApplicationTypeStepId)">
          {{ item.currentApplicationTypeStep }}
        </v-chip>
      </template>
    </form-table>

    <v-dialog v-model="isCanSetSocialEmp">
      <SetSocialEmployee v-if="selectedApp" :item="selectedApp" v-model="isCanSetSocialEmp" @update:model-value="closeSocialEmployee" />
    </v-dialog>
  </UiParentCard>
</template>
