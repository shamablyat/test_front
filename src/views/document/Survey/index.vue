<script setup lang="ts">
import { IFields, IFilter, ISelectList, ITableActions } from "@/models/basic";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import UiParentCard from "@/components/UiParentCard.vue";
import { useManualStore } from "@/app/config/store/Manual";
import AdmManualService from "@/services/others/admmanual.service";
import FormTableActions from "@/components/form/FormTableActions.vue";
import { ChecksIcon, DotsIcon, LayoutGridIcon, FileCheckIcon, FileDescriptionIcon, Clock2Icon } from "vue-tabler-icons";
import ManualService from "@/services/others/manual.service";
import { AxiosResponse } from "axios";
import { useGlobal } from "@/composables/useGlobal";
import { FormBtn } from "@/models/vuetify/types";
import FormTable from "@/components/form/FormTable.vue";
import FormTableHeader from "@/components/form/FormTableHeader.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormToggleButtons from "@/components/form/FormToggleButtons.vue";
import { SurveyService } from "@/services/document/Survey.service";

interface ICustomFilter extends IFilter {
  questionnaireId: number | null;
  regionId: number | null;
  districtId: number | null;
  mfyId: number | null;
  agreeLetterId: number | null;
  socialEmployeeId: number | null;
  fromDocDate: string;
  toDocDate: string;
  questionnaireTypeId: number | null;
  activity: number | null;

  statusIds: number[];
}

const router = useRouter();
const manualStore = useManualStore();
manualStore.setRegions();

const DEFAULT_VALUES: ICustomFilter = {
  orderType: "asc",
  page: 1,
  pageSize: 20,
  search: "",
  totalRows: 0,
  sortBy: "",

  agreeLetterId: null,
  districtId: null,
  mfyId: null,
  regionId: null,
  questionnaireId: null,
  socialEmployeeId: null,
  questionnaireTypeId: 0,
  activity: 0,
  fromDocDate: "",
  toDocDate: "",

  statusIds: []
};
const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });
const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
};
const actions: ITableActions = {
  isEdit: true,
  isView: true,
  canAccept: true,
  canCancel: true,
  isDelete: true
};

const fields: IFields[] = [
  { key: "id", label: "id" },
  { key: "ownerDocOn", label: "ownerDocOn" },
  { key: "ownerDocNumber", label: "ownerDocNumber" },
  { key: "doc", label: "doc" },
  { key: "organization", label: "organization" },
  { key: "startAt", label: "period" },
  { key: "eldQuestionnaireType", label: "questionnaireType" },

  {
    key: "totalQuestions",
    label: "totalQuestions",
    tdClass: "text-center",
    thClass: "text-center",
    isAmount: true
  },
  { key: "resultActions", label: "resultActions" },

  { key: "status", label: "status" }
];

const { parseNumber } = useGlobal();
const permission = "EldSurvey";
const routerName = "Survey";

const districtList = ref<ISelectList[]>([]);
const mfyList = ref<ISelectList[]>([]);
const tabs: FormBtn[] = [
  {
    label: "All",
    prependIcon: LayoutGridIcon
  },
  {
    label: "noStarted",
    prependIcon: DotsIcon
  },
  {
    label: "started",
    prependIcon: Clock2Icon
  },
  {
    label: "completed",
    prependIcon: ChecksIcon
  },
  {
    label: "acceptedResult",
    prependIcon: FileCheckIcon
  }
];

const questionnaireTabs = ref<FormBtn[]>([
  {
    label: "All",
    prependIcon: LayoutGridIcon
  }
]);

const parseQuestionnaireTypeList = () => {
  ManualService.GetQuestionnaireTypeSelectList().then((res: AxiosResponse<ISelectList[]>) => {
    res.data.forEach((element) => {
      questionnaireTabs.value.push({
        label: element.text
      });
    });
  });
};

parseQuestionnaireTypeList();

const changeRegion = (value: number) => {
  districtList.value = [];
  filter.districtId = null;
  mfyList.value = [];
  filter.mfyId = null;
  AdmManualService.DistrictSelectList(value).then((res) => {
    districtList.value = res.data;
  });
};

const changeDistrict = (value: number) => {
  if (filter.regionId) {
    mfyList.value = [];
    filter.mfyId = null;
    AdmManualService.MfySelectList(filter.regionId, value).then((res) => {
      mfyList.value = res.data;
    });
  }
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

/* NEW SURVEY ID */

const redirectToSurveyResult = (item: any) => {
  if (item.lastSurveyResultId) {
    router.push({
      name: `ViewSurveyResult`,
      params: {
        id: item.lastSurveyResultId
      }
    });
  }
};
</script>

<template>
  <UiParentCard class="mt-3">
    <FormTable :service="SurveyService" :fields="fields" :filter="filter" :routerName="routerName" :permission="permission" prepend-action>
      <template #header="{ refresh, getData }">
        <FormTableHeader hasMenu :filter="filter" @refresh="refresh" @getData="getData" @edit="edit" :can-create="false" @clear-filter="clearFilter">
          <template #menu-items>
            <v-col class="px-6">
              <form-select :label="$t('region')" v-model="filter.regionId" @update:model-value="changeRegion" :list="manualStore.getRegions" />
            </v-col>
            <v-col class="px-6">
              <form-select :label="$t('district')" v-model="filter.districtId" @update:model-value="changeDistrict" :list="districtList" />
            </v-col>
            <v-col class="px-6">
              <form-select :label="$t('mfy')" v-model="filter.mfyId" :list="mfyList" />
            </v-col>
          </template>
          <template #header-bottom>
            <div class="tabs">
              <FormToggleButtons
                border
                :tabs="tabs"
                divided
                v-model="filter.activity"
                @update:model-value="
                  () => {
                    refresh();
                  }
                "
              />
              <FormToggleButtons
                :tabs="questionnaireTabs"
                divided
                border
                v-model="filter.questionnaireTypeId"
                @update:model-value="
                  () => {
                    refresh();
                  }
                "
              />
            </div>
          </template>
        </FormTableHeader>
      </template>
      <template #livingAddress="{ item }"> {{ item.region }} / {{ item.district }} / {{ item.mfy }} </template>
      <template #doc="{ item }"> {{ item.docOn }} / {{ item.docNumber }} </template>
      <template #startAt="{ item }"> {{ item.startAt || "-" }} / {{ item.endAt || "-" }} </template>
      <template #totalQuestions="{ item }">
        {{ parseNumber(item.answeredQuestions) }}
        /
        {{ parseNumber(item.totalQuestions) }}
      </template>
      <template #resultActions="{ item }">
        <tr v-for="action in item.actions">
          <td class="border px-3 py-3">
            {{ action.actionType }} | {{ action.actionCount }}
            <div></div>
          </td>
        </tr>
      </template>
      <template #prepend-action="{ item, refresh }">
        <FormTableActions
          :item="item"
          :actions="actions"
          :service="SurveyService"
          :permission="permission"
          @refresh="refresh"
          @edit="edit"
          @view="view"
        >
          <template #action>
            <v-btn
              v-if="item.lastSurveyResultId"
              @click="redirectToSurveyResult(item)"
              color="success"
              style="margin-right: 5px"
              class="ma-1"
              size="small"
            >
              <FileDescriptionIcon size="20" />
              {{ $t("newSurvey") }}
            </v-btn>
          </template>
        </FormTableActions>
      </template>
    </FormTable>
  </UiParentCard>
</template>
<style scoped lang="scss">
.tabs {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.3125rem;
  width: 100%;
  flex: 0 0 100%;
}
</style>
