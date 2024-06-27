<script setup lang="ts">
import { useManualStore } from "@/app/config/store/Manual";
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import { IFields, IFilter } from "@/models/basic";
import AdmManualService from "@/services/others/admmanual.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { PrinterIcon } from "vue-tabler-icons";

const { setError } = useErrorToast();
const { t } = useI18n();
const { forceFileDownload } = useGlobal();
const printLoading = ref<boolean>(false);

interface ICustomFilter extends IFilter {
  regionIds: number[];
  districtIds: number[];
  userIds: number[];
  roleIds: number[];

  userName: string;
  organizationInn: string;
  pinfl: string;
}

const DEFAULT_VALUES: ICustomFilter = {
  districtIds: [],
  roleIds: [],
  userIds: [],
  regionIds: [],
  orderType: "asc",
  organizationInn: "",
  userName: "",
  pinfl: "",

  page: 1,
  pageSize: 20,
  search: "",
  sortBy: "",
  totalRows: 0
};

const fields: IFields[] = [
  { key: "region", label: "region" },
  { key: "district", label: "district" },
  { key: "app", label: "app", tdClass: "border font-weight-black", thClass: "border" },
  { key: "role", label: "Role" },
  { key: "userName", label: "username", tdClass: "border font-weight-black", thClass: "border" },
  { key: "pinfl", label: "pinfl", tdClass: "border font-weight-black", thClass: "border" },
  { key: "organizationInn", label: "organizationInn", tdClass: "border", thClass: "border" },
  { key: "lastName", label: "lastName", tdClass: "border", thClass: "border" },
  { key: "firstName", label: "firstName", tdClass: "border", thClass: "border" },
  { key: "middleName", label: "middleName", tdClass: "border", thClass: "border" },
  { key: "createdAt", label: "dateOn", tdClass: "border", thClass: "border" }
];

const manualStore = useManualStore();

manualStore.setRegions();

const filter = reactive({ ...DEFAULT_VALUES });

const printReport = () => {
  printLoading.value = true;
  AdmManualService.ExportUserRoles(filter)
    .then((res) => {
      printLoading.value = false;
      forceFileDownload(res, t("GetUserRoles"), ".xlsx");
    })
    .catch((err) => {
      setError(err);
      printLoading.value = false;
    });
};
const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
};
</script>

<template>
  <div>
    <UiParentCard>
      <form-table :fields="fields" :filter="filter" :service="AdmManualService" apiName="GetUserRoles">
        <template #header="{ refresh, getData }">
          <form-table-header
            :canCreate="false"
            hasMenu
            :filter="filter"
            :canSearch="false"
            @refresh="refresh"
            @get-data="getData"
            @clear-filter="clearFilter"
          >
            <template #menu-items>
              <v-row class="mx-2">
                <v-col cols="12" class="py-1">
                  <form-input v-model="filter.userName" :label="$t('username')"> </form-input>
                </v-col>
                <v-col cols="12" class="py-1">
                  <form-input v-model="filter.organizationInn" :label="$t('organizationInn')"> </form-input>
                </v-col>
                <v-col cols="12" class="py-1">
                  <form-input v-model="filter.pinfl" :label="$t('pinfl')"> </form-input>
                </v-col>
                <v-col cols="12" class="py-1">
                  <form-select :list="manualStore.regions" v-model="filter.regionIds" :label="$t('region')" multiple> </form-select>
                </v-col>
              </v-row>
            </template>
            <template #create>
              <v-btn @click="printReport" :loading="printLoading" color="info" class="mx-3" :icon="PrinterIcon" />
            </template>
          </form-table-header>
        </template>
        <template #header-region>
          <th v-if="filter.regionIds.length === 0 || filter.regionIds.includes(999)" class="font-weight-bold text-center h6 border">
            {{ $t("region") }}
          </th>
        </template>
        <template #header-district>
          <th
            class="font-weight-bold text-center h6 border"
            v-if="(filter.regionIds.length > 0 && filter.districtIds.length === 0) || filter.districtIds.includes(999)"
          >
            {{ $t("district") }}
          </th>
        </template>
        <template #item-region="{ item }">
          <td v-if="filter.regionIds.length === 0 || filter.regionIds.includes(999)" class="border">
            <v-btn style="background: transparent" class="font-weight-bold text-info text-right">
              {{ item.region }}
            </v-btn>
          </td>
        </template>
        <template #item-district="{ item }">
          <td v-if="(filter.regionIds.length > 0 && filter.districtIds.length === 0) || filter.districtIds.includes(999)" class="border">
            <v-btn style="background: transparent" class="font-weight-bold text-info text-right">
              {{ item.district }}
            </v-btn>
          </td>
        </template>
      </form-table>
    </UiParentCard>
  </div>
</template>
