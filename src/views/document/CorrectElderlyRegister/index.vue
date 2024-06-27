<script setup lang="ts">
import { reactive, ref } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import ElderlyRegisterSentService from "@/services/document/elderlyregistersent.service";
import type { IFilter, ITableActions } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import { useRoute, useRouter } from "vue-router";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { ChecksIcon, LayoutGridIcon, SendIcon, XIcon } from "vue-tabler-icons";
import { FormBtn } from "@/models/vuetify/types";
import { useManualStore } from "@/app/config/store/Manual";

interface ICustomFilter extends IFilter {
  regionId: number | null;
  districtId: number | null;
  docNumber: string;
  decisionDocNumber: string;
  decisionFromDocDate: string;
  decisionToDocDate: string;
  fromDocDate: string;
  toDocDate: string;
  personName: string;
  personPinfl: string;
  statusIds: number[];
  isOnlyEqual: boolean;
}
const fields = [
  { key: "id", label: "id", sort: true },
  { key: "docNumber", label: "docNumber", sort: true },
  { key: "docOn", label: "docOn", sort: true },
  { key: "decisionDocNumber", label: "decisionDocNumber", sort: true },
  { key: "decisionDocOn", label: "decisionDocOn", sort: true },
  { key: "region", label: "region", sort: true },
  { key: "district", label: "district", sort: true },
  { key: "inTableCount", label: "inTableCount", sort: true },
  { key: "outTableCount", label: "outTableCount", sort: true },
  { key: "isCorrection", label: "isCorrection", sort: true },
  { key: "status", label: "status", sort: false }
];

const tabs: FormBtn[] = [
  {
    label: "All",
    prependIcon: LayoutGridIcon
  },
  {
    label: "Sent",
    prependIcon: SendIcon,
    color: "warning"
  },
  {
    label: "Accepted",
    color: "success",
    prependIcon: ChecksIcon
  },
  {
    label: "Rejected",
    prependIcon: XIcon,
    color: "error"
  }
];
const routerName = "SentElderlyRegister";
const permission = "ElderlyRegisterSent";
const DEFAULT_VALUES = {
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  statusIds: [8, 25, 2, 24],
  totalRows: 0,
  regionId: null,
  districtId: null,
  docNumber: "",
  decisionDocNumber: "",
  decisionFromDocDate: "",
  decisionToDocDate: "",
  fromDocDate: "",
  toDocDate: "",
  personName: "",
  personPinfl: ""
};
const filter: ICustomFilter = reactive({
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  statusIds: [8, 25, 2, 24],
  totalRows: 0,
  regionId: null,
  districtId: null,
  docNumber: "",
  decisionDocNumber: "",
  decisionFromDocDate: "",
  decisionToDocDate: "",
  fromDocDate: "",
  toDocDate: "",
  personName: "",
  personPinfl: "",
  isOnlyEqual: true
});
const router = useRouter();
const route = useRoute();
const statusId = ref(parseInt(route.query.status as string) || 0);
const DistrictList: any = ref([]);
const actions: ITableActions = {
  isView: true
};

const manual = useManualStore();
const changeStatus = () => {
  clearFilter();
  switch (statusId.value) {
    case 0:
      filter.statusIds = [8, 25, 2, 24];
      break;
    case 1:
      filter.statusIds = [8];
      break;
    case 2:
      filter.statusIds = [2];
      break;
    case 3:
      filter.statusIds = [25, 24];
      break;
    default:
  }
};
const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
  router.replace({ name: routerName });
};

function District(regionId: number | null | undefined) {
  if (regionId) {
    AdmManualService.DistrictSelectList(regionId).then((res: any) => {
      DistrictList.value = res.data;
    });
  }
}

const view = (item: any) => {
  router.push({
    name: `View${routerName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};
const correctPage = () => {
  router.push({
    name: `CorrectElderlyRegister`,
    params: {
      id: 0
    }
  });
};

const removeKeys: string[] = ["statusIds"];
</script>

<template>
  <UiParentCard>
    <filter-page :filter="filter" :removeKeys="removeKeys" :params="{ status: statusId }" @change-status="changeStatus">
      <template #default="{ createRouteQuery, params, removeKeys }">
        <form-table
          :removeKeys="removeKeys"
          :params="params"
          @createRouteQuery="createRouteQuery"
          :fields="fields"
          :filter="filter"
          :service="ElderlyRegisterSentService"
          :routerName="routerName"
          :permission="permission"
          append-action
        >
          <template #header="{ refresh, getData }">
            <form-table-header hasMenu :filter="filter" @getData="getData" @clear-filter="clearFilter" @refresh="refresh">
              <template #create="{ ability }">
                <v-btn v-if="ability.can('ElderlyRegisterCorrectionCreate')" color="success" @click="correctPage" variant="flat">
                  <PlusIcon size="20" /> {{ $t("createCorrectedDoc") }}
                </v-btn>
              </template>
              <template #menu-items>
                <v-row class="mt-2 mx-2">
                  <v-col>
                    <form-select
                      :list="manual.regions"
                      v-model="filter.regionId"
                      :label="$t('region')"
                      :placeholder="$t('region')"
                      @update:modelValue="District(filter.regionId)"
                    >
                    </form-select>
                  </v-col>
                </v-row>
                <v-row class="mx-2">
                  <v-col class="py-0">
                    <form-select :list="DistrictList" v-model="filter.districtId" :label="$t('district')" :placeholder="$t('district')">
                    </form-select>
                  </v-col>
                </v-row>
                <v-row class="mx-2 mt-4">
                  <v-col class="py-0">
                    <form-input v-model="filter.docNumber" canAddZero :label="$t('docNumber')" />
                  </v-col>
                  <v-col class="py-0">
                    <form-input v-model="filter.decisionDocNumber" canAddZero :label="$t('decisionDocNumber')" />
                  </v-col>
                </v-row>
                <v-row class="mx-2 mt-4">
                  <v-col class="py-0" cols="12">
                    <v-label class="mb-2 font-weight-medium">{{ $t("decisionDocDate") }}</v-label>
                  </v-col>
                  <v-col class="py-0" cols="6">
                    <form-picker clearable class="w-100" v-model:model-value="filter.decisionFromDocDate" :placeholder="$t('startdate')" />
                  </v-col>
                  <v-col class="py-0" cols="6">
                    <form-picker clearable class="w-100" v-model:model-value="filter.decisionToDocDate" :placeholder="$t('enddate')" />
                  </v-col>
                </v-row>
                <v-row class="mx-2 mt-0">
                  <v-col class="py-0" cols="12">
                    <v-label class="mb-2 font-weight-medium">{{ $t("docDate") }}</v-label>
                  </v-col>
                  <v-col class="py-0" cols="6">
                    <form-picker clearable class="w-100" v-model:model-value="filter.fromDocDate" :placeholder="$t('startdate')" />
                  </v-col>
                  <v-col class="py-0" cols="6">
                    <form-picker clearable class="w-100" v-model:model-value="filter.toDocDate" :placeholder="$t('enddate')" />
                  </v-col>
                </v-row>
              </template>
              <template #header-bottom>
                <form-toggle-buttons
                  :tabs="tabs"
                  divided
                  border
                  v-model="statusId"
                  @update:model-value="
                    () => {
                      Object.assign(filter, DEFAULT_VALUES);
                      changeStatus();
                      refresh();
                      createRouteQuery({ filter, params: { status: statusId }, removeKeys });
                    }
                  "
                />
              </template>
            </form-table-header>
          </template>
          <template #actions="{ item, refresh }">
            <FormTableActions
              :item="item"
              :actions="actions"
              :permission="permission"
              :routerName="routerName"
              :service="ElderlyRegisterSentService"
              @refresh="refresh"
              @view="view"
            />
          </template>
          <template #isCorrection="{ item }">
            {{ item.isCorrection ? $t("isCorrection") : $t("notCorrected") }}
          </template>
        </form-table>
      </template>
    </filter-page>
  </UiParentCard>
</template>
