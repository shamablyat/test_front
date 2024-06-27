<script setup lang="ts">
import { reactive, ref } from "vue";
import { IFields, IFilter, ISelectList, ITableActions } from "@/models/basic";
import { useRoute, useRouter } from "vue-router";
import { SurveyResultAlgorithmService } from "@/services/info/SurveyResultAlgorithm.service";
import FormTableActions from "@/components/form/FormTableActions.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { ChecksIcon, FilePlusIcon, GitPullRequestDraftIcon, LayoutGridIcon, XIcon } from "vue-tabler-icons";
import { FormBtn } from "@/models/vuetify/types";
import { QuestionnaireService } from "@/services/info/Questionnaire.service";
import FormTable from "@/components/form/FormTable.vue";
import { notify } from "@kyvg/vue3-notification";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import i18n from "@/app/config/i18n";

interface ICustomFilter extends IFilter {
  fromDocDate: string;
  toDocDate: string;

  questionnaireTypeId: number | null;
  statusIds: number[];
}

const router = useRouter();
const route = useRoute();
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

const permission = "EldSurveyResultAlgorithm";
const routerName = "SurveyResultAlgorithm";
const forAlgorithmQuestionnaireList = ref<ISelectList[]>([]);
const labelQuestionnaireList = ref<ISelectList[]>([]);
const forAlgorithmQuestionnaireId = ref<number | null>(null);
const labelQuestionnaireId = ref<number | null>(null);
const isCloneAlgorithmsByQuestionnaireLoading = ref<boolean>(false);
const isCloneAlgorithmsByQuestionnaire = ref<boolean>(false);
const formTableRef = ref<Partial<typeof FormTable>>();

const statusId = ref(parseInt(route.query.status as string) || 0);

const fields: IFields[] = [
  { key: "id", label: "id" },
  { key: "docOn", label: "docOn" },
  { key: "docNumber", label: "docNumber" },
  { key: "organization", label: "organization" },
  { key: "eldQuestionnaire", label: "Questionnaire" },
  { key: "details", label: "details" },
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

const actions: ITableActions = {
  isEdit: true,
  isDelete: true,
  canCancel: true,
  canAccept: true,
  isView: true
};

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

const view = (item: any) => {
  router.push({
    name: `View${routerName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};

const edit = (item: any) => {
  router.push({
    name: `Edit${routerName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};

const getForAlgorithm = () => {
  QuestionnaireService.GetQuestionnaireSelectList("?forAlgorithm=true")?.then((res) => {
    forAlgorithmQuestionnaireList.value = res.data;
  });
};
const getLabelQuestionnaireList = () => {
  labelQuestionnaireId.value = null;
  QuestionnaireService.GetQuestionnaireSelectList(`?sourceQuestionniareId=${forAlgorithmQuestionnaireId.value}`)?.then((res) => {
    labelQuestionnaireList.value = res.data;
  });
};

const cloneAlgorithmsByQuestionnaire = () => {
  if (forAlgorithmQuestionnaireId.value && labelQuestionnaireId.value) {
    isCloneAlgorithmsByQuestionnaireLoading.value = true;
    SurveyResultAlgorithmService.CloneAlgorithmsByQuestionnaireId(
      `?sourceQuestionnaireId=${forAlgorithmQuestionnaireId.value}&labelQuestionnaireId=${labelQuestionnaireId.value}`
    )
      .then(() => {
        notify({
          // @ts-ignore
          text: i18n.global.t("ClonedSuccess"),
          type: "success"
        });

        if (formTableRef.value) {
          formTableRef.value.refresh();
        }
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        isCloneAlgorithmsByQuestionnaire.value = false;
        isCloneAlgorithmsByQuestionnaireLoading.value = false;
      });
  }
};
const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
};
getForAlgorithm();
</script>

<template>
  <UiParentCard>
    <form-table
      :fields="fields"
      :filter="filter"
      :service="SurveyResultAlgorithmService"
      :permission="permission"
      :routerName="routerName"
      append-action
    >
      <template #header="{ refresh, getData }">
        <form-table-header
          hasMenu
          :filter="filter"
          @refresh="refresh"
          @getData="getData"
          @clear-filter="clearFilter"
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

          <template #right-append>
            <v-menu :close-on-content-click="false" v-model="isCloneAlgorithmsByQuestionnaire">
              <template #activator="{ props }">
                <v-btn v-bind="props" :icon="FilePlusIcon" color="violet" />
              </template>
              <v-card width="300" class="px-5 py-5">
                <v-card-text class="px-0 py-0">
                  <v-col class="px-0">
                    <form-select
                      :list="forAlgorithmQuestionnaireList"
                      v-model="forAlgorithmQuestionnaireId"
                      :label="$t('Questionnaire')"
                      @update:model-value="getLabelQuestionnaireList"
                    >
                    </form-select>
                  </v-col>
                  <v-col class="px-0">
                    <form-select :list="labelQuestionnaireList" v-model="labelQuestionnaireId" :label="$t('labelQuestionnaire')"> </form-select>
                  </v-col>
                </v-card-text>
                <v-card-actions class="px-0 py-0">
                  <v-col class="text-right">
                    <v-btn :text="$t('close')" variant="flat" color="error" class="ml-auto" @click="isCloneAlgorithmsByQuestionnaire = false" />
                  </v-col>
                  <v-col class="text-right">
                    <v-btn
                      :text="$t('clone')"
                      variant="flat"
                      color="success"
                      :loading="isCloneAlgorithmsByQuestionnaireLoading"
                      class="ml-auto"
                      @click="cloneAlgorithmsByQuestionnaire"
                    />
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-menu>
          </template>
        </form-table-header>
      </template>

      <template #actions="{ item, refresh }">
        <FormTableActions
          :item="item"
          :actions="actions"
          :service="SurveyResultAlgorithmService"
          @refresh="refresh"
          @edit="edit"
          :permission="permission"
          @view="view"
          show-status-actions
        />
      </template>
    </form-table>
  </UiParentCard>
</template>
