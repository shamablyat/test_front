<script setup lang="ts">
import { ref } from "vue";
import { useElderlySchedule } from "../store/useCareSchedule";
import { IFields, IFilter, ISelectList } from "@/models/basic";
import ElderlyManageService from "@/services/document/elderlyManage.service";
import { PlusIcon, XIcon } from "vue-tabler-icons";
import { useRouter } from "vue-router";
import AdmManualService from "@/services/others/admmanual.service";
import { reactive } from "vue";
import { onMounted } from "vue";
import FormTable from "@/components/form/FormTable.vue";
import { useManualStore } from "@/app/config/store/Manual";
const emits = defineEmits<{
  (e: "setIsModal"): void;
}>();

const store = useElderlySchedule();
const districtList = ref<ISelectList[]>([]);
const formTableRef = ref<typeof FormTable>();

const router = useRouter();

interface ICustomFIlter extends IFilter {
  regionId: number | null;
  districtId: number | null;
  pensionTypeId: null | number;
  elderlyReasonId: null | number;
  elderlyCategoryId: null | number;
  endElderlyReasonId: null | number;

  region: string;
  district: string;
  pensionType: string;
  elderlyReason: string;
  endElderlyReason: string;
  elderlyCategory: string;
  person: string;
  isDeath: boolean;
}
const DEFAULT_vALUES: ICustomFIlter = {
  district: "",
  districtId: null,
  elderlyCategory: "",
  elderlyCategoryId: null,
  elderlyReason: "",
  elderlyReasonId: null,
  pensionType: "",
  pensionTypeId: null,
  regionId: null,
  endElderlyReasonId: null,
  region: "",
  person: "",
  endElderlyReason: "",
  isDeath: false,

  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  totalRows: 0
};
const filter: ICustomFIlter = reactive({
  district: "",
  districtId: null,
  elderlyCategory: "",
  elderlyCategoryId: null,
  elderlyReason: "",
  elderlyReasonId: null,
  pensionType: "",
  pensionTypeId: null,
  regionId: null,
  endElderlyReasonId: null,
  region: "",
  person: "",
  endElderlyReason: "",
  isDeath: false,

  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  totalRows: 0
});

const manual = useManualStore();

const fields = ref<IFields[]>([
  {
    key: "id",
    label: "id"
  },
  {
    key: "newElderlyCareScheduleId",
    label: "newElderlyCareScheduleId"
  },
  {
    key: "region",
    label: "region"
  },
  {
    key: "district",
    label: "district"
  },
  {
    key: "fullName",
    label: "fullName"
  },
  {
    key: "elderlyBirtOn",
    label: "birthOn"
  },
  {
    key: "elderlyCategory",
    label: "elderlyCategory"
  },
  {
    key: "elderlyReason",
    label: "elderlyReason"
  },
  {
    key: "pensionType",
    label: "pensionType"
  },
  {
    key: "elderlyRegion",
    label: "elderlyRegion"
  },
  {
    key: "elderlyDistrict",
    label: "elderlyDistrict"
  },
  {
    key: "elderlyMfy",
    label: "mfy"
  },
  {
    key: "assistantPersonFullName",
    label: "assistantPersonFullName"
  }
]);

const setManage = (item: any) => {
  store.setManage(item);
  store.setPhoto(item.personId, "manage");
  emits("setIsModal");
};

const edit = (id: number) => {
  router.push({ name: "EditElderlyCareSchedule", params: { id } });
  emits("setIsModal");
};

const setDistricts = () => {
  if (!filter.regionId) return;

  AdmManualService.DistrictSelectList(filter.regionId).then((res) => {
    districtList.value = res.data;
  });
};

const clearFilter = () => {
  Object.assign(filter, DEFAULT_vALUES);
  // Object.keys(filter).forEach((key, index) => {
  //   // @ts-ignore
  //   if (typeof filter[key] === "number") {
  //     // @ts-ignore
  //     filter[key] = 0;
  //   }
  //   // @ts-ignore
  //   if (typeof filter[key] === "string") {
  //     // @ts-ignore
  //     filter[key] = "";
  //   }
  // });
};

onMounted(() => {
  if (formTableRef.value) {
    formTableRef.value.refresh();
  }
});
const setField = (value: ISelectList, key: string) => {
  if (value) {
    // @ts-ignore
    filter[key + "Id"] = value.value;
    // @ts-ignore
    filter[key] = value.text;
  }
};
</script>

<template>
  <v-card elevation="0" class="px-5 py-5">
    <v-card-title>
      <v-row>
        <v-col class="h3 py-0">
          {{ $t("selectElderlyManage") }}
        </v-col>
        <v-col class="text-right cursor-pointer py-0">
          <XIcon size="30" @click="emits('setIsModal')" />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <form-table :service="ElderlyManageService" :fields="fields" :filter="filter" append-action ref="formTableRef" :identifier="false">
        <template #header="{ refresh, getData }">
          <form-table-header
            :filter="filter"
            @refresh="refresh"
            class="header-menu"
            hasMenu
            @getData="getData"
            :canCreate="false"
            @clearFilter="clearFilter"
          >
            <template #menu-items>
              <v-card-text>
                <v-col cols="12" class="py-1 px-0">
                  <form-select
                    v-model="filter.regionId"
                    :list="manual.regions"
                    :label="$t('region')"
                    returnObject
                    @update:model-value="(val:ISelectList) => {
                          setField(val,'region')
                          setDistricts()
                        }"
                  >
                  </form-select>
                </v-col>
                <v-col cols="12" class="py-1 px-0">
                  <form-select
                    v-model="filter.districtId"
                    :list="districtList"
                    :label="$t('district')"
                    returnObject
                    @update:model-value="(val:ISelectList) => {
                          setField(val,'district')
                        }"
                  >
                  </form-select>
                </v-col>
                <v-col cols="12" class="py-1 px-0">
                  <form-select
                    v-model="filter.elderlyCategoryId"
                    :list="store.getElderlyCategoryList"
                    :label="$t('elderlyCategory')"
                    returnObject
                    @update:model-value="(val:ISelectList) => {
                          setField(val,'elderlyCategory')
                        }"
                  >
                  </form-select>
                </v-col>
                <v-col cols="12" class="py-1 px-0">
                  <form-select
                    :list="store.getPensionTypeList"
                    v-model="filter.pensionTypeId"
                    :label="$t('pensionType')"
                    returnObject
                    @update:model-value="(val:ISelectList) => {
                          setField(val,'pensionType')
                        }"
                  >
                  </form-select>
                </v-col>

                <v-col cols="12" class="py-1 px-0">
                  <form-select
                    :list="store.getElderlyReasonList"
                    v-model="filter.endElderlyReasonId"
                    :label="$t('elderlyReason')"
                    returnObject
                    @update:model-value="(val:ISelectList) => {
                          setField(val,'elderlyReason')
                        }"
                  >
                  </form-select>
                </v-col>
              </v-card-text>
            </template>
          </form-table-header>
        </template>
        <template #actions="{ item }">
          <div class="d-flex align-center">
            <div class="cursor-pointer" v-if="item?.elderlyCareScheduleId" @click="edit(item.elderlyCareScheduleId)">
              <PencilIcon size="20" style="cursor: pointer" />
              <v-tooltip activator="parent" location="top">
                {{ $t("Edit") }}
              </v-tooltip>
            </div>
            <div class="mx-1 cursor-pointer" v-else @click="setManage(item)">
              <PlusIcon size="20" />
              <v-tooltip activator="parent" location="top">
                {{ $t("AddRow") }}
              </v-tooltip>
            </div>
          </div>
        </template>
      </form-table>
    </v-card-text>
    <v-card-actions class="mt-3 py-0">
      <v-spacer></v-spacer>
      <v-btn color="error" variant="flat" :text="$t('close')" @click="emits('setIsModal')"> </v-btn>
    </v-card-actions>
  </v-card>
</template>
