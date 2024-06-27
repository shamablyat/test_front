<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import type { IFields, IFilter, ISelectList, ITableActions } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { useRoute, useRouter } from "vue-router";
import EldApplicationService from "@/services/document/eldApplication.service";
import { ChecksIcon, LayoutGridIcon, SendIcon, UserPlusIcon } from "vue-tabler-icons";
import { FormBtn } from "@/models/vuetify/types";
import { useManualStore } from "@/app/config/store/Manual";
import FormTable from "@/components/form/FormTable.vue";
import SetSocialEmployee from "./SetSocialEmployee.vue";
import { useGlobal } from "@/composables/useGlobal";

interface ICustomFilter extends IFilter {
  statusIds: number[];
  regionId: number | null;
  region: string;
  eldApplicationTypeIds: number[];
  districtId: number | null;
  district: string;
  mfyId: number | null;
  mfy: string;
  fromDocDate: string;
  toDocDate: string;
  person: string;
  applicationCreationTypeId: number | null;
  isSocialEmployee: boolean;
}

interface IProps {
  modelValue: number;
}
const props = defineProps<IProps>();
const emits = defineEmits(["update:modelValue"]);

const actions: ITableActions = {
  isView: true,
  isDelete: false,
  isEdit: false,
  canApprove: false,
  canCancel: false
};

const receiveFilter = ref({
  forRevalue: true,
  socialEmployeeId: null
});

const statusIds: FormBtn[] = [
  {
    label: "All",
    prependIcon: LayoutGridIcon
  },
  {
    label: "Sent",
    color: "warning",
    prependIcon: SendIcon
  },
  {
    label: "Accepted",
    color: "success",
    prependIcon: ChecksIcon
  }
];

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
  { key: "status", label: "status", sort: false },
  { key: "state2", label: "currentApplicationTypeStep", sort: false }
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
  eldApplicationTypeIds: [1],
  region: "",
  districtId: null,
  district: "",
  mfyId: null,
  mfy: "",
  fromDocDate: "",
  toDocDate: "",
  person: "",
  applicationCreationTypeId: null,
  isSocialEmployee: false
};

const permission = "Application";
const routerName = "EldApplication";
const route = useRoute();
const router = useRouter();
const {  getStepColor } = useGlobal();
const manualStore = useManualStore();

const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });
const isCanSetSocialEmp = ref(false);
const selectedApp = ref<any>();
const formTableRef = ref<Partial<typeof FormTable>>();
const statusId = ref(parseInt(route.query.status as string) || 0);
const districtList = ref<ISelectList[]>([]);
const mfyList = ref<ISelectList[]>([]);
const identifier = ref<boolean>(false);

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
  router.replace({ name: routerName });
};

const changeRegion = () => {
  filter.districtId = null;
  District(String(filter.regionId));
};

const changeStatus = () => {
  switch (statusId.value) {
    case 0:
      filter.statusIds = [];
      break;
    case 1:
      filter.statusIds = [8];
      break;
    case 2:
      filter.statusIds = [2, 16];
      break;
    // code block
  }
};

const District = (regionId: number | string | null) => {
  mfyList.value = [];
  filter.mfyId = null;
  filter.mfy = "";

  if (regionId) {
    AdmManualService.DistrictSelectList(regionId).then((res: any) => {
      districtList.value = res.data;
    });
  }
};

const getMfyList = (regionId: number | string, districtId: number | string) => {
  if (regionId) {
    AdmManualService.MfySelectList(regionId, districtId).then((res: any) => {
      mfyList.value = res.data;
    });
  }
};

const setField = (value: ISelectList, key: string) => {
  if (value) {
    // @ts-ignore
    filter[key + "Id"] = value.value;
    // @ts-ignore
    filter[key] = value.text;
  }
};

const updateTabModelValue = () => {
  if (props.modelValue == 3) {
    filter.eldApplicationTypeIds = [3];
  } else {
    filter.eldApplicationTypeIds = [1];
  }

  if (formTableRef.value) {
    formTableRef.value.refresh();
  }
};

const acceptSocialEmployee = (item: any) => {
  isCanSetSocialEmp.value = true;
  selectedApp.value = item;
};

const closeSocialEmployee = () => {
  if (formTableRef.value) {
    formTableRef.value.refresh();
  }
};

const view = (item: any) => {
  router.push({
    name: `View${routerName}`,
    params: { id: item.id }
  });
};

const removeKeys = ["eldApplicationTypeIds", "statusIds"];

if (route.query?.regionId) {
  District(String(route.query?.regionId));
  if (route.query?.districtId) {
    getMfyList(String(route.query?.regionId), String(route.query?.districtId));
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      clearFilter();
      updateTabModelValue();
    }
  },
  {
    immediate: true
  }
);
</script>

<template>
  <UiParentCard>
    <filter-page :filter="filter" :removeKeys="removeKeys" :params="{ status: statusId, typeId: modelValue }" @change-status="changeStatus">
      <template #default="{ createRouteQuery, params, removeKeys }">
        <form-table
          :removeKeys="removeKeys"
          :params="params"
          @createRouteQuery="createRouteQuery"
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
            <form-table-header :canCreate="false" hasMenu :filter="filter" @clear-filter="clearFilter" @getData="getData" @refresh="refresh">
              <template #menu-items>
                <v-row class="mt-4 mx-2">
                  <v-col class="py-1">
                    <form-input :label="$t('fio')" v-model="filter.person" :placeholder="$t('enterText')"></form-input>
                  </v-col>
                </v-row>
                <v-row class="mt-2 mx-2">
                  <v-col class="py-1">
                    <form-select
                      :list="manualStore.regions"
                      v-model="filter.regionId"
                      :label="$t('region')"
                      :placeholder="$t('region')"
                      returnObject
                      @update:modelValue="
                        (val) => {
                          setField(val, 'region');
                          changeRegion();
                        }
                      "
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
                      @update:modelValue="
                        (val) => {
                          setField(val, 'district');
                          getMfyList(String(filter.regionId), val.value);
                        }
                      "
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
              <template #header-bottom>
                <v-row class="mb-2 px-3">
                  <div>
                    <v-card class="border" elevation="0">
                      <form-toggle-buttons
                        divided
                        :tabs="statusIds"
                        v-model="statusId"
                        @update:model-value="
                          () => {
                            changeStatus();
                            refresh();
                            createRouteQuery({ filter, params: { status: statusId, typeId: modelValue }, removeKeys });
                          }
                        "
                      />
                    </v-card>
                  </div>
                </v-row>
              </template>
            </form-table-header>
          </template>
          <template #actions="{ item, refresh, getData }">
            <FormTableActions
              :item="item"
              :actions="actions"
              :permission="permission"
              :routerName="routerName"
              :service="EldApplicationService"
              @refresh="refresh"
              @getData="getData"
              @view="view"
              show-status-actions
              :custom-filter="receiveFilter"
            >
              <template #action="{ openModal }">
                <div
                  style="margin-right: 5px; cursor: pointer"
                  @click="acceptSocialEmployee(item)"
                  v-if="(item.canSocialEmp || item.canReceive) && modelValue == 1"
                >
                  <v-tooltip activator="parent" location="top">
                    {{ $t("setSocialEmployee") }}
                  </v-tooltip>
                  <UserPlusIcon size="20" color="rgb(var(--v-theme-warning))" />
                </div>
                <div
                  style="margin-right: 5px; cursor: pointer"
                  @click="
                    openModal({
                      title: 'Receive',
                      cb: 'Receive',
                      id: item.id
                    }),
                      (receiveFilter.socialEmployeeId = item.socialEmployeeId)
                  "
                  v-if="item.canRevalue && modelValue == 3"
                >
                  <v-tooltip activator="parent" location="top">
                    {{ $t("setSocialEmployee") }}
                  </v-tooltip>
                  <ChecksIcon size="20" color="rgb(var(--v-theme-success))" />
                </div>
              </template>

              <template #modal-text="{ isModalProps }"> ID: {{ isModalProps.id }} </template>
            </FormTableActions>
          </template>
          <template #state2="{ item }">
            <v-chip :color="getStepColor(item)">
              {{ item.currentApplicationTypeStep }}
            </v-chip>
          </template>
        </form-table>
      </template>
    </filter-page>

    <v-dialog v-model="isCanSetSocialEmp">
      <SetSocialEmployee v-if="selectedApp" :item="selectedApp" v-model="isCanSetSocialEmp" @success="closeSocialEmployee" />
    </v-dialog>
  </UiParentCard>
</template>
