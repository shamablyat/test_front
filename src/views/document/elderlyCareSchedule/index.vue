<script setup lang="ts">
import { reactive, ref } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import type { IFields, IFilter, ISelectList, ITableActions } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { useRoute, useRouter } from "vue-router";
import ElderlyCareScheduleService from "@/services/document/elderySchedule.service";
import { ArchiveIcon, ChecksIcon, FilePlusIcon, FriendsOffIcon, GitPullRequestDraftIcon, LayoutGridIcon, XIcon } from "vue-tabler-icons";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import i18n  from "@/app/config/i18n";
import { FormBtn } from "@/models/vuetify/types";
import { useManualStore } from "@/app/config/store/Manual";

interface IModalProps {
  title: string;
  id: number | null;
  cb: string;
  item: any;
  refresh: () => void;
}

interface attachAssistantList {
  text: string;
  value: boolean | null;
}

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
  attachAssistant: boolean | null;
  hasNewElderlyCareSchedule: boolean | null;
}

const actions: ITableActions = {
  isView: true,
  isDelete: true,
  isEdit: true,
  canApprove: true,
  canCancel: true
};
const { setError } = useErrorToast();
const manual = useManualStore();

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
    label: "Approved",
    color: "success",
    prependIcon: ChecksIcon
  },
  {
    label: "Canceled",
    prependIcon: XIcon,
    color: "error"
  },
  {
    label: "archive",
    prependIcon: ArchiveIcon
  }
];

const permission = "ElderlyCareSchedule";
const routerName = "ElderlyCareSchedule";
const route = useRoute();
const router = useRouter();

const statusId = ref(parseInt(route.query.status as string) || 0);
const districtList = ref<ISelectList[]>([]);
const mfyList = ref<ISelectList[]>([]);
const isModal = ref<boolean>(false);
const identifier = ref<boolean>(false);

const fields: IFields[] = [
  { key: "id", label: "id", sort: true },
  {
    key: "assistantPersonFullName",
    label: "assistantPersonFullName",
    sort: true
  },
  {
    key: "newElderlyCareScheduleId",
    label: "newElderlyCareScheduleId",
    tdClass: "text-grey200",
    sort: true
  },
  { key: "region", label: "region", sort: true },
  { key: "district", label: "district", sort: true },
  { key: "elderlyCategory", label: "elderlyCategory", sort: true },
  { key: "organization", label: "organization", sort: true },
  { key: "elderlyBirhtOn", label: "birhtOn", sort: true },
  { key: "elderlyRegion", label: "elderlyRegion", sort: true },
  { key: "elderlyDistrict", label: "elderlyDistrict", sort: true },
  { key: "elderlyMfy", label: "mfy", sort: true },
  { key: "elderlyFullName", label: "elderlyManageFullName", sort: true },

  {
    key: "totalTime",
    label: "totalTime"
  },
  {
    key: "travelTimeInMinutes",
    label: "travelTimeInMinutes"
  },
  { key: "docNumber", label: "docNumber", sort: true },
  { key: "docOn", label: "docOn", sort: true },
  { key: "status", label: "status", sort: false }
];
const DEFAULT_VALUES = {
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
  attachAssistant: null
};
const filter: ICustomFilter = reactive({
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
  attachAssistant: null,
  hasNewElderlyCareSchedule: null
});

const isModalProps = ref<IModalProps>({
  cb: "",
  id: null,
  title: "",
  item: {},
  refresh: () => {}
});

const attachAssistantList: attachAssistantList[] = [
  // @ts-ignore
  { text: i18n.global.t("all"), value: null },
  { text: i18n.global.t("attachAssistant"), value: true },
  { text: i18n.global.t("notAttachAssistant"), value: false }
];

function clearFilter() {
  Object.assign(filter, DEFAULT_VALUES);
  router.replace({ name: routerName });
}
manual.setRegions();
function ChangeRegion() {
  filter.districtId = null;
  District(String(filter.regionId));
}
if (route.query?.regionId) {
  District(String(route.query?.regionId));
  if (route.query?.districtId) {
    getMfyList(String(route.query?.regionId), String(route.query?.districtId));
  }
}
function changeStatus() {
  switch (statusId.value) {
    case 0:
      filter.statusIds = [];
      filter.hasNewElderlyCareSchedule = false;
      break;
    case 1:
      filter.statusIds = [1, 4];
      filter.hasNewElderlyCareSchedule = null;
      break;
    case 2:
      filter.statusIds = [2, 17];
      filter.hasNewElderlyCareSchedule = null;
      break;
    case 3:
      filter.statusIds = [25, 24];
      filter.hasNewElderlyCareSchedule = null;
      break;
    case 4:
      filter.statusIds = [17];
      filter.hasNewElderlyCareSchedule = true;
      break;
    // code block
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

const openModal = ({ title, id, cb, item, refresh }: { title: string; id: number; cb: string; item: any; refresh: () => void }) => {
  isModalProps.value.title = title;
  isModalProps.value.id = id;
  isModalProps.value.cb = cb;
  isModalProps.value.item = item;
  isModalProps.value.refresh = refresh;
  isModal.value = true;
};

const sentRequest = (cb: string) => {
  if (isModalProps.value.id) {
    // @ts-ignore
    ElderlyCareScheduleService[cb]({ id: isModalProps.value.id })
      .then(() => {
        isModal.value = false;
        notify({
          // @ts-ignore
          text: i18n.global.t("SaveSuccess"),
          type: "success",
          closeOnClick: true
        });
        isModalProps.value.refresh();
        identifier.value = true;
        setTimeout(() => {
          identifier.value = false;
        }, 100);
      })
      .catch((e: any) => {
        setError(e);
        identifier.value = true;
        isModal.value = false;
        isModalProps.value.refresh();
        setTimeout(() => {
          identifier.value = false;
        }, 100);
      });
  }
};

const getCloneById = (id: number | string) => {
  router.push({
    name: `Edit${routerName}`,
    params: {
      id
    },
    query: {
      clone: "true"
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
          :service="ElderlyCareScheduleService"
          :routerName="routerName"
          :permission="permission"
          prepend-action
          :manualRefresh="identifier"
        >
          <template #header="{ refresh, getData }">
            <form-table-header
              hasMenu
              :filter="filter"
              @clear-filter="clearFilter"
              @getData="getData"
              @refresh="refresh"
              @edit="edit"
              :permission="permission"
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
                      clearable
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
                      clearable
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
                      clearable
                      @update:model-value="(val: ISelectList) => setField(val, 'mfy')"
                    >
                      <!-- @update:modelValue="(val:ISelectList) => {
                        setField(val, 'mfy')
                      }" -->
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
                  <v-col class="py-1" cols="12">
                    <form-select clearable :list="attachAssistantList" v-model="filter.attachAssistant" :label="$t('attachAssistant')" />
                  </v-col>
                </v-row>
              </template>
              <template #header-bottom>
                <v-row class="mb-2 px-3">
                  <div>
                    <v-card class="border" elevation="0">
                      <form-toggle-buttons
                        divided
                        :tabs="tabs"
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
                    </v-card>
                  </div>
                </v-row>
              </template>
            </form-table-header>
          </template>
          <template #prepend-action="{ item, refresh }">
            <FormTableActions
              :item="item"
              :actions="actions"
              :permission="permission"
              :routerName="routerName"
              :service="ElderlyCareScheduleService"
              @refresh="refresh"
              @edit="edit"
              @view="view"
            >
              <template #action="{ isShow, ability }">
                <div style="margin-right: 5px; cursor: pointer" @click="getCloneById(item.id)">
                  <v-tooltip activator="parent" location="top">
                    {{ $t("clone") }}
                  </v-tooltip>
                  <FilePlusIcon />
                </div>
                <div
                  style="margin-right: 5px; cursor: pointer"
                  @click="
                    openModal({
                      title: 'Approve',
                      id: item.id,
                      cb: 'Approve',
                      item: item,
                      refresh: refresh
                    })
                  "
                  v-if="
                    isShow({
                      action: actions?.canApprove,
                      permission: ability.can(`${permission}Approve`),
                      itemAction: item.canApprove
                    })
                  "
                >
                  <v-tooltip activator="parent" location="top">
                    {{ $t("Approve") }}
                  </v-tooltip>
                  <ChecksIcon color="#05b187" />
                </div>
                <div
                  style="margin-right: 5px; cursor: pointer"
                  @click="
                    openModal({
                      title: 'Cancel',
                      id: item.id,
                      cb: 'Cancel',
                      item: item,
                      refresh: refresh
                    })
                  "
                  v-if="
                    isShow({
                      action: actions?.canCancel,
                      permission: ability.can(`${permission}Cancel`),
                      itemAction: item.canCancel
                    })
                  "
                >
                  <v-tooltip activator="parent" location="top">
                    {{ $t("Cancel") }}
                  </v-tooltip>
                  <XIcon color="red" />
                </div>
                <div v-if="!item.notAttachAssistantReasonId && !item.attachAssitant" >
                  <v-tooltip activator="parent">
                    {{ $t("notAttachAssistantReasonAndNotAttachAssitant") }}
                  </v-tooltip>
                  <FriendsOffIcon  />
                </div>
              </template>
              <template #outAction="{ isShow, ability }">
                <v-btn
                  color="success"
                  size="small"
                  class="mb-2"
                  v-if="
                    isShow({
                      permission: ability.can('ElderlyCareScheduleView'),
                      itemAction: item.attachAssistant,
                      action: true
                    }) && item?.assistantPersonId
                  "
                  @click="
                    router.push({
                      name: 'cardAssistant',
                      params: { id: item.assistantPersonId }
                    })
                  "
                >
                  {{ $t("viewAssistant") }}
                </v-btn>
              </template>
            </FormTableActions>
          </template>
        </form-table>
      </template>
    </filter-page>
    <v-dialog v-model="isModal" width="300">
      <v-card class="mx-2 my-2">
        <v-card-title>{{ $t(`${isModalProps.title}`) }}</v-card-title>
        <v-card-text class="py-0"> ID: {{ isModalProps.id }} </v-card-text>

        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn color="error" variant="flat" block @click="isModal = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="success" variant="flat" block @click="sentRequest(isModalProps.cb)">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </UiParentCard>
</template>
