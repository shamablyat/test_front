<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import FormTableActions from "@/components/form/FormTableActions.vue";
import type { IFields, IFilter, ITableActions } from "@/models/basic";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { DeleteDocService } from "@/services/document/DeleteDoc.service";

interface ICustomFilter extends IFilter {}

const actions: ITableActions = {
  isView: true,
  isEdit: true,
  isDelete: true
};

const DEFAULT_VALUES: ICustomFilter = {
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  totalRows: 0
};

const permission = "EldDeleteDoc";
const routeName = "DeleteDoc";

const fields: IFields[] = [
  { key: "id", label: "id", sort: true },
  { key: "docId", label: "docId", sort: true },
  { key: "docOn", label: "docOn", sort: true },
  { key: "docNumber", label: "docNumber", sort: true },
  { key: "docDeleteType", label: "docDeleteType", sort: true },
  { key: "status", label: "status", sort: false }
];

/* IMPORTS AND STORE */
const router = useRouter();

/* VARIABLES */
const filterRef = ref<any>(null);
const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
};

const edit = (item: any) => {
  router.push({
    name: `Edit${routeName}`,
    params: {
      id: item.id ? item.id : "0"
    }
  });
};

const view = (item: any) => {
  router.push({
    name: `View${routeName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};
</script>

<template>
  <UiParentCard color="basil" flat class="mt-3">
    <filter-page :filter="filter">
      <template #default="{ createRouteQuery, params }">
        <form-table
          :params="params"
          @createRouteQuery="createRouteQuery"
          :fields="fields"
          :service="DeleteDocService"
          :filter="filter"
          :routerName="routeName"
          :permission="permission"
          appendAction
        >
          <template #header="{ refresh, getData }" ref="filterRef">
            <form-table-header
              :filter="filter"
              @getData="getData"
              @clear-filter="clearFilter"
              @refresh="refresh"
              @edit="edit"
              :permission="permission"
            >
            </form-table-header>
          </template>
          <template #actions="{ item, refresh }">
            <FormTableActions
              :item="item"
              :actions="actions"
              :permission="permission"
              :routerName="routeName"
              :service="DeleteDocService"
              @refresh="refresh"
              @edit="edit"
              @view="view"
              show-status-actions
            >
            </FormTableActions>
          </template>
        </form-table>
      </template>
    </filter-page>
  </UiParentCard>
</template>
