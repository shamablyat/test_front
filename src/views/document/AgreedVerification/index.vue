<script setup lang="ts">
import { reactive, ref } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import type { IFields, IFilter, ISelectList, ITableActions } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { useRoute, useRouter } from "vue-router";
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import { LogoutIcon } from "vue-tabler-icons";
import { useManualStore } from "@/app/config/store/Manual";
import FormTable from "@/components/form/FormTable.vue";

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
}

const actions: ITableActions = {
  isView: true,
  canAccept: true,
  canCancel: true,
  isEdit: true
};

const formTableRef = ref<Partial<typeof FormTable>>();

const permission = "ElderlyVerification";
const routerName = "Verification";

const fields: IFields[] = [
  { key: "id", label: "id", sort: true },
  { key: "applicationDocNumber", label: "applicationDocNumber" },
  { key: "applicationDocOn", label: "applicationDocOn" },
  { key: "docNumber", label: "docNumber", sort: true },
  { key: "docOn", label: "docOn", sort: true },
  { key: "expireOn", label: "expireOn", sort: true },
  {
    key: "applicantPersonFullName",
    label: "applicantPersonFullName",
    sort: true
  },
  { key: "region", label: "region", sort: true },
  { key: "district", label: "district", sort: true },
  { key: "mfy", label: "mfy", sort: true },
  { key: "status", label: "status", sort: false }
];

const DEFAULT_VALUES: ICustomFilter = {
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  totalRows: 0,
  statusIds: [2, 17, 20],
  regionId: null,
  region: "",
  districtId: null,
  district: "",
  mfyId: null,
  mfy: "",
  fromDocDate: "",
  toDocDate: "",
  person: ""
};

const router = useRouter();
const route = useRoute();
const manual = useManualStore();

const districtList = ref<ISelectList[]>([]);
const mfyList = ref<ISelectList[]>([]);

const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
  router.replace({ name: routerName });
};
manual.setRegions();
const changeRegion = () => {
  filter.districtId = null;
  District(String(filter.regionId));
};
if (route.query?.regionId) {
  District(String(route.query?.regionId));
  if (route.query?.districtId) {
    getMfyList(String(route.query?.regionId), String(route.query?.districtId));
  }
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

const edit = (item: any) => {
  router.push({
    name: `Edit${routerName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};

const view = (item: any) => {
  router.push({
    name: `View${routerName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};

const setField = (value: ISelectList, key: string) => {
  if (value) {
    // @ts-ignore
    filter[key + "Id"] = value.value;
    // @ts-ignore
    filter[key] = value.text;
  }
};

const goElderlyRegister = (item: any) => {
  router.push({
    name: "ViewElderlyRegister",
    params: {
      id: item.elderlyRegisterId
    }
  });
};

const removeKeys = ["statusIds"];
</script>

<template>
  <UiParentCard>
    <filter-page :filter="filter" :removeKeys="removeKeys">
      <template #default="{ createRouteQuery, params, removeKeys }">
        <form-table
          :removeKeys="removeKeys"
          :params="params"
          @createRouteQuery="createRouteQuery"
          :fields="fields"
          :filter="filter"
          :service="ElderlyVerificationService"
          :routerName="routerName"
          :permission="permission"
          append-action
          ref="formTableRef"
        >
          <template #header="{ refresh, getData }">
            <form-table-header
              :canCreate="false"
              hasMenu
              :filter="filter"
              @clear-filter="clearFilter"
              @getData="getData"
              @refresh="refresh"
              @edit="edit"
            >
              <template #menu-items>
                <v-row class="mt-4 mx-2">
                  <v-col class="py-1">
                    <form-input :label="$t('fio')" v-model="filter.person" :placeholder="$t('enterText')"></form-input>
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
      changeRegion()
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
              :service="ElderlyVerificationService"
              @refresh="refresh"
              @edit="edit"
              @view="view"
            >
              <template #action>
                <div v-if="item.elderlyRegisterId" @click="goElderlyRegister(item)" class="cursor-pointer">
                  <v-tooltip activator="parent">
                    {{ $t("goElderlyRegister") }}
                  </v-tooltip>
                  <LogoutIcon />
                </div>
              </template>
            </FormTableActions>
          </template>
        </form-table>
      </template>
    </filter-page>
  </UiParentCard>
</template>
