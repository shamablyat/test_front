<script setup lang="ts">
import { reactive, ref } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import type { IFields, IFilter, ISelectList, ITableActions } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { useRoute, useRouter } from "vue-router";
import ElderlyVerificationService from "@/services/document/elderlyVerification.service";
import { ChecksIcon, CornerDownRightIcon, GitPullRequestDraftIcon, LayoutGridIcon, SendIcon, XIcon, XboxXIcon } from "vue-tabler-icons";
import { FormBtn } from "@/models/vuetify/types";
import { useManualStore } from "@/app/config/store/Manual";
import FormTable from "@/components/form/FormTable.vue";
import { notify } from "@kyvg/vue3-notification";
import { useErrorToast } from "@/utils/helpers/useErrorToast";

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
  isEdit: true,
  canReject: true
};

const isModal = ref<boolean>(false);
const statusLoading = ref<boolean>(false);
const selectedItem = ref<any>();

const { setError } = useErrorToast();
const formTableRef = ref<Partial<typeof FormTable>>();

const permission = "ElderlyVerification";
const routerName = "Verification";

const tabs: FormBtn[] = [
  {
    label: "All",
    prependIcon: LayoutGridIcon
  },
  {
    label: "Edited",
    prependIcon: GitPullRequestDraftIcon
  },
  {
    label: "Sent",
    prependIcon: SendIcon
  },
  {
    label: "Approved",
    color: "success",
    prependIcon: ChecksIcon
  },
  {
    label: "Canceled",
    prependIcon: XIcon,
    color: "error"
  }
];

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
  statusIds: [],
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

const route = useRoute();
const router = useRouter();
const manual = useManualStore();

const statusId = ref(parseInt(route.query.status as string) || 0);
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

const changeStatus = () => {
  clearFilter();
  switch (statusId.value) {
    case 0:
      filter.statusIds = [];
      break;
    case 1:
      filter.statusIds = [1, 4];
      break;

    case 2:
      filter.statusIds = [8];
      break;
    case 3:
      filter.statusIds = [2, 17];
      break;
    case 4:
      filter.statusIds = [25, 24];
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
const goElderlyRegisterOut = (id: any) => {
  router.push({
    name: "ViewElderlyRegister",
    params: {
      id: id
    }
  });
};

const goReject = (item: any) => {
  isModal.value = true;
  selectedItem.value = item;
};

const rejectItem = () => {
  ElderlyVerificationService.Reject({ id: selectedItem.value.id })
    .then(() => {
      isModal.value = false;
      notify({
        // @ts-ignore
        text: i18n.global.t("successfullyChanged"),
        type: "success",
        closeOnClick: true
      });
      window.location.reload();
    })
    .catch((e: any) => {
      setError(e);
      isModal.value = false;
    })
    .finally(() => {
      statusLoading.value = false;
    });
};
</script>

<template>
  <UiParentCard>
    <form-table
      :fields="fields"
      :filter="filter"
      :service="ElderlyVerificationService"
      :routerName="routerName"
      :permission="permission"
      append-action
      ref="formTableRef"
    >
      <template #header="{ refresh, getData }">
        <form-table-header :canCreate="false" hasMenu :filter="filter" @clear-filter="clearFilter" @refresh="refresh" @getData="getData" @edit="edit">
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
          <template #header-bottom>
            <form-toggle-buttons
              divided
              border
              :tabs="tabs"
              v-model="statusId"
              @update:model-value="
                () => {
                  changeStatus();
                  refresh();
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
          :service="ElderlyVerificationService"
          @refresh="refresh"
          @edit="edit"
          @view="view"
        >
          <template #action>
            <!-- <div v-if="item.canCreateReg" @click="goElderlyRegister(item)" class="cursor-pointer">
              <v-tooltip activator="parent">
                {{ $t("goElderlyRegister") }}
              </v-tooltip>
              <LogoutIcon />
            </div> -->
            <div v-if="item.canReject" @click="goReject(item)" class="cursor-pointer">
              <v-tooltip activator="parent">
                {{ $t("Reject") }}
              </v-tooltip>
              <XboxXIcon color="rgb(var(--v-theme-error))" />
            </div>
            <div v-if="item.elderlyRegisterId" @click="goElderlyRegister(item)" class="cursor-pointer">
              <v-tooltip activator="parent">
                {{ $t("inOrder") }}
              </v-tooltip>
              <CornerDownRightIcon color="rgb(var(--v-theme-success))" />
            </div>
            <div v-if="item.elderlyRegisterOutId" @click="goElderlyRegisterOut(item.elderlyRegisterOutId)" class="cursor-pointer">
              <v-tooltip activator="parent">
                {{ $t("outOrder") }}
              </v-tooltip>
              <CornerDownRightIcon color="rgb(var(--v-theme-error))" />
            </div>
          </template>
          <!-- <template #outAction="{ ability, isShow }">
            <div class="d-block">
              <div class="pa-0">
                <v-btn @click="goSurvey(item, 'bartel')" color="success" style="margin-right: 5px" class="ma-1" size="small">
                  <LogoutIcon size="20" />
                  {{ $t("GoBartelSurvey") }}
                </v-btn>
              </div>
              <div class="pa-0">
                <v-btn @click="goSurvey(item, 'lauton')" color="success" style="margin-right: 5px" class="ma-1" size="small">
                  <LogoutIcon size="20" />
                  {{ $t("GoLoutonSurvey") }}
                </v-btn>
              </div>
            </div>
          </template> -->
        </FormTableActions>
      </template>
    </form-table>

    <v-dialog v-model="isModal" width="300">
      <v-card class="mx-2 my-2">
        <v-card-title>{{ $t("Reject") }}</v-card-title>
        <v-card-text class="py-0">
          ID: {{ selectedItem.id }}
          <!-- ID: {{ isModalProps.id }}  -->
        </v-card-text>

        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn :loading="statusLoading" color="error" variant="flat" block @click="isModal = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :loading="statusLoading" color="success" variant="flat" block @click="rejectItem">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </UiParentCard>
</template>
