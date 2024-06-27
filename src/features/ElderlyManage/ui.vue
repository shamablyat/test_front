<script setup lang="ts">
import { useManualStore } from "@/app/config/store/Manual";
import UiParentCard from "@/components/UiParentCard.vue";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { IFields, IFilter, ISelectList } from "@/models/basic";
import ElderlyManageService from "@/services/document/elderlyManage.service";
import ElderlyReasonService from "@/services/info/elderlyreason.service";
import AdmManualService from "@/services/others/admmanual.service";
import ManualService from "@/services/others/manual.service";
import { reactive } from "vue";
import { ref } from "vue";
import View from "./ui/view.vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/app/config/store/auth";

interface ICustomFilter extends IFilter {
  region: string | null;
  district: string | null;
  mfy: string | null;

  regionId: number | null;
  districtId: number | null;
  mfyId: number | null;
  elderlyCategoryId: number | null;
  elderlyReasonId: number | null;
  pensionTypeId: number | null;
  endElderlyReasonId: number | null;

  isOnlyActual: boolean;
  isDeath: boolean;
}

interface IProps {
  setManage?: boolean;
  canView?: boolean;
  createVerification?: boolean;
  parentFilter?: ICustomFilter | {};
}

const emits = defineEmits<{
  (e: "setIsModal"): void;
}>();

withDefaults(defineProps<IProps>(), {
  setManage: true,
  canView: true
});
/* CONSTANTS */
const permission = "ElderlyManage";
const routerName = "ElderlyManage";
const DEFAULT_VALUES: ICustomFilter = {
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  totalRows: 0,

  region: "",
  district: "",
  mfy: "",

  regionId: null,
  districtId: null,
  mfyId: null,

  pensionTypeId: null,
  elderlyCategoryId: null,
  elderlyReasonId: null,
  endElderlyReasonId: null,
  isDeath: false,
  isOnlyActual: false
};

const fields: IFields[] = [
  { key: "id", label: "id", sort: true },
  { key: "elderlyId", label: "elderlyId", sort: true },
  { key: "elderlyFullName", label: "fio", sort: true },
  { key: "startOn", label: "registerDate", sort: true },
  { key: "endOn", label: "deregisterDate", sort: true },
  { key: "region", label: "region", sort: true },
  { key: "district", label: "district", sort: true },
  { key: "elderlyRegion", label: "elderlyRegion", sort: true },
  { key: "elderlyDistrict", label: "elderlyDistrict", sort: true },
  { key: "elderlyMfy", label: "elderlyMfy", sort: true },
  { key: "elderlyCategory", label: "elderlyCategory", sort: true },
  { key: "elderlyReason", label: "elderlyReason", sort: true },
  { key: "nextMonitoringOn", label: "nextMonitoringOn", sort: true },
  { key: "pensionType", label: "pensionType", sort: true }
];

/* IMPORTS AND STORE */
const manualStore = useManualStore();
const router = useRouter();
const auth = useAuth();

manualStore.setRegions();

/* VARIABLES */
const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });
const districtList = ref<ISelectList[]>([]);
const mfyList = ref<ISelectList[]>([]);
const elderlyCategoryList = ref<ISelectList[]>([]);
const elderlyReasonList = ref<ISelectList[]>([]);

const setRegion = () => {
  filter.mfy = "";
  filter.mfyId = null;
  mfyList.value = [];

  filter.district = "";
  filter.districtId = null;
  districtList.value = [];
};

const setDistricts = () => {
  filter.mfy = "";
  filter.mfyId = null;
  mfyList.value = [];
  if (filter.regionId) {
    AdmManualService.DistrictSelectList(filter.regionId).then((res) => {
      districtList.value = res.data;
    });
  }
};

const setMfy = () => {
  if (filter.regionId && filter.districtId) {
    AdmManualService.MfySelectList(filter.regionId, filter.districtId).then((res) => {
      mfyList.value = res.data;
    });
  }
};

const setElderlyCategory = () => {
  elderlyCategoryList.value = [];

  ManualService.GetElderlyCategorySelectList("", true).then((res) => {
    elderlyCategoryList.value.push(...res.data);
  });
  ManualService.GetElderlyCategorySelectList("", false).then((res) => {
    elderlyCategoryList.value.push(...res.data);
  });
};

const setElderlyReason = () => {
  elderlyReasonList.value = [];
  ElderlyReasonService.GetAsSelectList().then((res) => {
    elderlyReasonList.value = res.data;
  });
};

const setFields = (value: ISelectList, key: string) => {
  if (value) {
    // @ts-ignore
    filter[key] = value.text;
    // @ts-ignore
    filter[key + "Id"] = value.value;
  } else {
    // @ts-ignore
    filter[key] = "";
    // @ts-ignore
    filter[key + "Id"] = null;
  }
};

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
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

setElderlyCategory();
setElderlyReason();
</script>

<template>
  <UiParentCard>
    <form-table
      :fields="fields"
      :filter="{
        ...filter,
        ...parentFilter
      }"
      :service="ElderlyManageService"
      :routerName="routerName"
      :permission="permission"
      append-action
    >
      <template #header="{ refresh, getData }">
        <form-table-header
          :filter="filter"
          hasMenu
          @clearFilter="clearFilter"
          @refresh="refresh"
          @getData="getData"
          :permission="permission"
          :canCreate="false"
        >
          <template #menu-items>
            <v-row class="mx-3">
              <v-col cols="12" class="py-1">
                <form-select
                  :label="$t('region')"
                  :list="manualStore.regions"
                  v-model="filter.regionId"
                  returnObject
                  @update:model-value="(val:ISelectList) => {
                  setFields(val, 'region')
                  setRegion()
                  setDistricts()
                }"
                />
              </v-col>
              <v-col cols="12" class="py-1">
                <form-select
                  :label="$t('district')"
                  :list="districtList"
                  v-model="filter.districtId"
                  returnObject
                  @update:model-value="(val:ISelectList) => {
                  setFields(val, 'district')
                  setMfy()
                }"
                />
              </v-col>
              <v-col cols="12" class="py-1">
                <form-select
                  :label="$t('mfy')"
                  :list="mfyList"
                  v-model="filter.mfyId"
                  returnObject
                  @update:model-value="(val:ISelectList) => setFields(val, 'mfy')"
                />
              </v-col>
              <v-col cols="12" class="py-1">
                <form-select :label="$t('elderlyCategory')" :list="elderlyCategoryList" v-model="filter.elderlyCategoryId" />
              </v-col>
              <v-col cols="12" class="py-1">
                <form-select :label="$t('elderlyReason')" :list="elderlyReasonList" v-model="filter.elderlyReasonId" />
              </v-col>
              <v-col cols="12" lg="5" class="py-1">
                <form-checkbox :label="$t('isOnlyActual')" v-model="filter.isOnlyActual" />
              </v-col>
              <v-col cols="12" lg="5" class="py-1">
                <form-checkbox :label="$t('isDeath')" v-model="filter.isDeath" />
              </v-col>
            </v-row>
          </template>
        </form-table-header>
      </template>
      <template #actions="{ item, refresh }">
        <FormTableActions :item="item" :permission="permission" :routerName="routerName" :service="ElderlyManageService" @refresh="refresh">
          <template #action><slot name="action" :item="item" :refresh="refresh"></slot></template>
          <template #outAction>
            <slot name="outAction" :item="item" :refresh="refresh"></slot>
            <div v-if="createVerification && auth.can('ElderlyVerificationCreateByElderlyManage') && item.canReassessment">
              <v-btn @click="createVerificationPage(item.id)" color="success" size="small" class="my-2"> {{ $t("createVerification") }} </v-btn>
            </div>
          </template>
          <template #View="{}">
            <View :item="item" />
          </template>
        </FormTableActions>
      </template>
    </form-table>
  </UiParentCard>
</template>
