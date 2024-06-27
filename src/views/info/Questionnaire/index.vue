<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import FormTable from "@/components/form/FormTable.vue";
import FormTableActions from "@/components/form/FormTableActions.vue";
import FormTableHeader from "@/components/form/FormTableHeader.vue";
import { IFields, IFilter, ITableActions } from "@/models/basic";
import { FormBtn } from "@/models/vuetify/types";
import { QuestionnaireService } from "@/services/info/Questionnaire.service";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ChecksIcon, GitPullRequestDraftIcon, LayoutGridIcon, XIcon } from "vue-tabler-icons";

interface ICustomFilter extends IFilter {
  fromDocDate: string;
  toDocDate: string;

  questionnaireTypeId: number | null;
  statusIds: number[];
}

const router = useRouter();
const route = useRoute();
const statusId = ref(parseInt(route.query.status as string) || 0);

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
    label: "Accepted",
    color: "success",
    prependIcon: ChecksIcon
  },
  {
    label: "Canceled",
    prependIcon: XIcon,
    color: "error"
  }
];

const permission = "EldQuestionnaire";
const routerName = "Questionnaire";

const fields: IFields[] = [
  { key: "id", label: "id" },
  { key: "docOn", label: "docOn" },
  { key: "docNumber", label: "docNumber" },
  { key: "title", label: "questionTitle" },
  { key: "organizationName", label: "organization" },
  { key: "eldQuestionnaireType", label: "questionnaireType" },
  { key: "status", label: "status" }
];

const DEFAULT_VALUES: ICustomFilter = reactive({
  orderType: "asc",
  page: 1,
  pageSize: 20,
  search: "",
  totalRows: 0,
  sortBy: "",

  fromDocDate: "",
  toDocDate: "",

  statusIds: [],

  questionnaireTypeId: null
});
const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });

const changeStatus = () => {
  switch (statusId.value) {
    case 0:
      filter.statusIds = [];

      break;
    case 1:
      filter.statusIds = [1, 4, 23];
      break;
    case 2:
      filter.statusIds = [2];
      break;
    case 3:
      filter.statusIds = [25, 24];
      break;
    default:
    // code block
  }
};

const actions: ITableActions = {
  isEdit: true,
  isDelete: true,
  canCancel: true,
  canAccept: true,
  isView: true,
  isClone: true
};

const edit = (item: any, options?: any) => {
  router.push({
    name: `Edit${routerName}`,
    params: {
      id: item.id ? item.id : 0
    },
    ...options
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
    <FormTable :fields="fields" :filter="filter" :service="QuestionnaireService" :permission="permission" :routerName="routerName" append-action>
      <template #header="{ refresh, getData }">
        <FormTableHeader
          hasMenu
          :filter="filter"
          @getData="getData"
          @clear-filter="clearFilter"
          @refresh="refresh"
          @edit="edit"
          :permission="permission"
        >
          <template #menu-items>
            <v-row class="mx-4 mt-4">
              <v-col cols="12" class="py-0">
                <v-label> {{ $t("docDate") }} </v-label>
              </v-col>
              <v-col cols="6">
                <form-picker clearable v-model="filter.fromDocDate" :placeholder="$t('startDate')" />
              </v-col>
              <v-col cols="6">
                <form-picker clearable v-model="filter.toDocDate" :placeholder="$t('endDate')" />
              </v-col>
            </v-row>
          </template>
          <template #header-bottom>
            <form-toggle-buttons
              :tabs="tabs"
              v-model="statusId"
              divided
              border
              @update:model-value="
                () => {
                  changeStatus();
                  refresh();
                }
              "
            />
          </template>
        </FormTableHeader>
      </template>

      <template #actions="{ item, refresh }">
        <FormTableActions
          :item="item"
          :actions="actions"
          :service="QuestionnaireService"
          @refresh="refresh"
          @edit="edit"
          :permission="permission"
          @view="view"
          show-status-actions
        >
        </FormTableActions>
      </template>
    </FormTable>
  </UiParentCard>
</template>
