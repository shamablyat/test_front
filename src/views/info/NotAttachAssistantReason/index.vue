<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { IFields, IFilter, ITableActions } from "@/models/basic";
import NotAttachAssistantReasonService from "@/services/info/notAttachAssistantReason.service";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const permission = "NotAttachAssistantReason";
const routerName = "NotAttachAssistantReason";

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};

const fields: IFields[] = [
  { key: "id", label: "id", sort: true },
  { key: "orderCode", label: "orderCode", sort: true },
  { key: "code", label: "code", sort: true },
  { key: "shortName", label: "shortName", sort: true },
  { key: "fullName", label: "fullName", sort: true },
  { key: "state", label: "status", sort: true }
];

const DEFAULT_VALUES = reactive<IFilter>({
  search: "",
  sortBy: "",
  orderType: "asc",
  page: 1,
  pageSize: 20,
  totalRows: 0
});
const filter: IFilter = reactive({ ...DEFAULT_VALUES });

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
const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
};
</script>

<template>
  <UiParentCard>
    <form-table
      :fields="fields"
      :filter="filter"
      :service="NotAttachAssistantReasonService"
      :routerName="routerName"
      :permission="permission"
      append-action
    >
      <template #header="{ refresh, getData }">
        <form-table-header @refresh="refresh" @edit="edit" :permission="permission" @getData="getData" @clear-filter="clearFilter" />
      </template>

      <template #actions="{ item, refresh }">
        <FormTableActions
          :item="item"
          :actions="actions"
          :permission="permission"
          :routerName="routerName"
          :service="NotAttachAssistantReasonService"
          @refresh="refresh"
          @edit="edit"
          @view="view"
        />
      </template>
    </form-table>
  </UiParentCard>
</template>
