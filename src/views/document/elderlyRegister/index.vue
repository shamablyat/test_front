<script setup lang="ts">
import { ref } from "vue";
import UiParentCard from "@/components/UiParentCard.vue";
import ElderlyRegisterService from "@/services/document/elderlyregister.service";
import type { IFields, IFilter, ITableActions } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { useRoute, useRouter } from "vue-router";
import { ChecksIcon, GitPullRequestDraftIcon, LayoutGridIcon, PrinterIcon, SendIcon, XIcon } from "vue-tabler-icons";
import { FormBtn } from "@/models/vuetify/types";
import { useManualStore } from "@/app/config/store/Manual";
import { reactive } from "vue";
import { useGlobal } from "@/composables/useGlobal";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import i18n from "@/app/config/i18n";
import FormTableHeader from "@/components/form/FormTableHeader.vue";

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
}

const actions: ITableActions = {
  isView: true,
  isDelete: true,
  isEdit: true
};
const router = useRouter();
const route = useRoute();
const manual = useManualStore();
const { forceFileDownload } = useGlobal();
const { setError } = useErrorToast();

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

const permission = "ElderlyRegister";
const routerName = "ElderlyRegister";
const removeKeys = ["statusIds"];
const statusId = ref(parseInt(route.query.status as string) || 0);
const DistrictList: any = ref([]);
const printLoading = ref<boolean>(false);

const fields: IFields[] = [
  { key: "id", label: "id", sort: true },
  { key: "organization", label: "organization", sort: true },
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

const DEFAULT_VALUES: ICustomFilter = {
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  statusIds: [],
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
const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
  router.replace({ name: routerName });
};

function ChangeRegion() {
  filter.districtId = null;
  District(filter.regionId);
}

function changeStatus() {
  switch (statusId.value) {
    case 0:
      filter.statusIds = [];
      break;
    case 1:
      filter.statusIds = [1, 4, 23];
      break;
    case 2:
      filter.statusIds = [8];
      break;
    case 3:
      filter.statusIds = [2];
      break;
    case 4:
      filter.statusIds = [25, 24];
      break;
    default:
    // code block
  }
}
function District(regionId: number | undefined | null) {
  if (regionId) {
    AdmManualService.DistrictSelectList(regionId).then((res: any) => {
      DistrictList.value = res.data;
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

const printReport = () => {
  printLoading.value = true;
  ElderlyRegisterService.ExportElderlyRegisterInAndOut(filter)
    .then((res) => {
      // @ts-ignore
      forceFileDownload(res, i18n.global.t("ElderlyRegister"), ".xlsx");
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
    <filter-page :filter="filter" :removeKeys="removeKeys" :params="{ status: statusId }" @change-status="changeStatus">
      <template #default="{ createRouteQuery, params, removeKeys }">
        <form-table
          :removeKeys="removeKeys"
          :params="params"
          @createRouteQuery="createRouteQuery"
          :service="ElderlyRegisterService"
          :routerName="routerName"
          :fields="fields"
          :filter="filter"
          :permission="permission"
          append-action
        >
          <template #header="{ refresh, getData }">
            <FormTableHeader
              hasMenu
              :filter="filter"
              @getData="getData"
              @refresh="refresh"
              @edit="edit"
              @clearFilter="clearFilter"
              :canCreate="false"
            >
              <template #menu-items>
                <v-row class="mt-4 mx-2">
                  <v-col class="py-0">
                    <form-input :label="$t('fio')" v-model="filter.personName" :placeholder="$t('enterText')"></form-input>
                  </v-col>
                </v-row>
                <v-row class="mt-4 mx-2">
                  <v-col class="py-0">
                    <form-select
                      :list="manual.regions"
                      v-model="filter.regionId"
                      :label="$t('region')"
                      :placeholder="$t('region')"
                      @update:modelValue="ChangeRegion"
                    >
                    </form-select>
                  </v-col>
                </v-row>
                <v-row class="mx-2 mt-4">
                  <v-col class="py-0">
                    <form-select :list="DistrictList" v-model="filter.districtId" :label="$t('district')" :placeholder="$t('district')">
                    </form-select>
                  </v-col>
                </v-row>
                <v-row class="mx-2 mt-4">
                  <v-col class="py-0">
                    <form-input v-model="filter.docNumber" :label="$t('docNumber')" :canAddZero="true" />
                  </v-col>
                  <v-col class="py-0">
                    <form-input v-model="filter.decisionDocNumber" :label="$t('decisionDocNumber')" :canAddZero="true" />
                  </v-col>
                </v-row>
                <v-row class="mx-2">
                  <v-col class="py-0" cols="12">
                    <v-label class="mb-2 font-weight-medium">{{ $t("decisionDocDate") }}</v-label>
                  </v-col>
                  <v-col class="py-0" cols="6">
                    <form-picker clearable class="w-100" v-model:model-value="filter.decisionFromDocDate" :placeholder="$t('startDate')" />
                  </v-col>
                  <v-col class="py-0" cols="6">
                    <form-picker clearable class="w-100" v-model:model-value="filter.decisionToDocDate" :placeholder="$t('endDate')" />
                  </v-col>
                </v-row>
                <v-row class="mx-2 mt-4">
                  <v-col class="py-0" cols="12">
                    <v-label class="mb-2 font-weight-medium">{{ $t("docDate") }}</v-label>
                  </v-col>
                  <v-col class="py-0" cols="6">
                    <form-picker clearable class="w-100" v-model:model-value="filter.fromDocDate" :placeholder="$t('startDate')" />
                  </v-col>
                  <v-col class="py-0" cols="6">
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
                      // Object.assign(filter, DEFAULT_VALUES);
                      changeStatus();
                      refresh();
                      createRouteQuery({ filter, params: { status: statusId }, removeKeys });
                    }
                  "
                />
              </template>
              <template #create>
                <!-- <v-btn color="success" @click="edit(0)" variant="flat"> <PlusIcon size="20" /> {{ $t("Create") }} </v-btn> -->
                <v-btn @click="printReport" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
              </template>
            </FormTableHeader>
          </template>
          <template #actions="{ item, refresh }">
            <FormTableActions
              :item="item"
              :actions="actions"
              :permission="permission"
              :routerName="routerName"
              :service="ElderlyRegisterService"
              @refresh="refresh"
              @edit="edit"
              @view="view"
            >
            </FormTableActions>
          </template>
          <template #isCorrection="{ item }">
            {{ item.isCorrection ? $t("isCorrection") : $t("notCorrected") }}
          </template>
        </form-table>
      </template>
    </filter-page>
  </UiParentCard>
</template>
