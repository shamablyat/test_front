<script setup lang="ts">
import i18n from "@/app/config/i18n";
import UiParentCard from "@/components/UiParentCard.vue";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { IFields, IFilter, ITableActions } from "@/models/basic";
import ElderlyService from "@/services/info/elderlyService.service";
import { reactive } from "vue";
import { useRouter } from "vue-router";

interface ICustomFilter extends IFilter {
  isGroup: boolean | null;
  isExecuteAsistent: boolean | null;
}

const router = useRouter();
const permission = "ElderlyService";
const routerName = "ElderlyService";

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};

const fields: IFields[] = [
  { key: "id", label: "id", sort: true },
  { key: "orderCode", label: "orderCode", sort: true },
  { key: "code", label: "code", sort: true },
  { key: "isGroup", label: "isGroup", sort: true },
  { key: "shortName", label: "shortName", sort: true },
  { key: "fullName", label: "fullName", sort: true },
  { key: "executeOrganizationName", label: "organization", sort: true },
  { key: "executePeriod", label: "deadlineOnDay", sort: true },
  { key: "isExecuteAsistent", label: "isExecuteAsistent", sort: true },
  { key: "state", label: "status", sort: true }
];

const DEFAULT_VALUES: ICustomFilter = {
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  totalRows: 0,
  isExecuteAsistent: null,
  isGroup: null
};
const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });
const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
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

const isGroupList = [
  {
    // @ts-ignore
    text: i18n.global.t("all"),
    value: null
  },
  {
    text: i18n.global.t("yes"),
    value: true
  },
  {
    text: i18n.global.t("no"),
    value: false
  }
];
</script>

<template>
  <UiParentCard>
    <form-table :fields="fields" :filter="filter" :service="ElderlyService" :routerName="routerName" :permission="permission" append-action>
      <template #header="{ refresh, getData }">
        <form-table-header
          :filter="filter"
          @refresh="refresh"
          @getData="getData"
          hasMenu
          @edit="edit"
          :permission="permission"
          @clear-filter="clearFilter"
        >
          <template #menu-items>
            <v-row class="mx-3">
              <v-col cols="12">
                <form-select v-model="filter.isExecuteAsistent" :list="isGroupList" :label="$t('isExecuteAsistent')"></form-select>
              </v-col>
              <v-col cols="12">
                <form-select v-model="filter.isGroup" :list="isGroupList" :label="$t('isGroup')"></form-select>
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
          :service="ElderlyService"
          @refresh="refresh"
          @edit="edit"
          @view="view"
        />
      </template>

      <template #isExecuteAsistent="{ item }">
        {{ item.isExecuteAsistent ? $t("yes") : $t("no") }}
      </template>
      <template #item-id="{ item }">
        <td :class="item.isGroup ? 'font-weight-bold' : ''">{{ item.id }}</td>
      </template>
      <template #item-orderCode="{ item }">
        <td :class="item.isGroup ? 'font-weight-bold' : ''">{{ item.orderCode }}</td>
      </template>
      <template #item-isGroup="{ item }">
        <td :class="item.isGroup ? 'font-weight-bold' : ''">{{ item.isGroup ? $t("yes") : $t("no") }}</td>
      </template>
      <template #item-code="{ item }">
        <td :class="item.isGroup ? 'font-weight-bold' : ''">{{ item.code }}</td>
      </template>
      <template #item-shortName="{ item }">
        <td :class="item.isGroup ? 'font-weight-bold' : ''">{{ item.shortName }}</td>
      </template>
      <template #item-fullName="{ item }">
        <td :class="item.isGroup ? 'font-weight-bold' : ''">{{ item.fullName }}</td>
      </template>
      <template #item-executeOrganizationName="{ item }">
        <td :class="item.isGroup ? 'font-weight-bold' : ''">{{ item.executeOrganizationName }}</td>
      </template>
      <template #item-executePeriod="{ item }">
        <td :class="item.isGroup ? 'font-weight-bold' : ''">{{ item.executePeriod }}</td>
      </template>
      <template #item-isExecuteAsistent="{ item }">
        <td :class="item.isGroup ? 'font-weight-bold' : ''">{{ item.isExecuteAsistent ? $t("yes") : $t("no") }}</td>
      </template>
    </form-table>
  </UiParentCard>
</template>
