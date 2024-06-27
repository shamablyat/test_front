<script setup lang="ts">
import i18n  from "@/app/config/i18n";
import { IFields, ITableActions } from "@/models/basic";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { useSurvey } from "../store/useSurvey";
import { ref } from "vue";
import { InfoCircleIcon } from "vue-tabler-icons";

const store = useSurvey();

interface ICustomActions extends ITableActions {
  canCreate?: boolean;
}

interface IProps {
  actions?: ICustomActions;
  isView?: boolean;
}

defineProps<IProps>();

store.setQuestionnaires();
store.setSurveyResultActionList();
store.setQuestionnaireTypeList();

const emits = defineEmits<{
  (e: "create", item: any, index?: number): void;
}>();
const fields = [
  {
    key: "eldSurveyResultType",
    // @ts-ignore
    label: i18n.global.t("eldSurveyResultType")
  },
  {
    key: "fromBall",
    label: i18n.global.t("fromBall")
  },
  {
    key: "toBall",
    label: i18n.global.t("toBall")
  },
  {
    key: "action",
    label: i18n.global.t("actions")
  }
];

const selectedResult = ref<any>();
const selectedResultModal = ref<boolean>(false);
const selectedResultFields: IFields[] = [
  { key: "algorithmType", label: "algorithmType" },
  { key: "questionnaireGroup", label: "questionnaireGroup" },
  { key: "questionnaireQuestion", label: "questionnaireQuestion" },
  {
    key: "questionnaireAnswer",
    label: "questionnaireAnswer"
  },
  {
    key: "questionnaireAnswerTemplateTable",
    label: "QuestionAnswerTemplate"
  }
];
const setSelectedResult = (item: any) => {
  selectedResult.value = item;
  selectedResultModal.value = true;
};
</script>

<template>
  <div v-if="store.getResultData">
    <FormTabRow :fields="fields" :items="store.getResultData?.tables" :actions="{ ...actions, isDelete: false }">
      <template #actions="{ item, index, editIndex }">
        <div style="margin-right: 5px" v-if="editIndex == -1 && !item.nextQuestionnaireId">
          <InfoCircleIcon size="20" style="cursor: pointer" @click="setSelectedResult(item)" />
          <v-tooltip activator="parent" location="top">
            {{ $t("View") }}
          </v-tooltip>
        </div>
        <slot name="my-actions" :item="item" :index="index" :editIndex="editIndex"> </slot>
      </template>
    </FormTabRow>

    <v-dialog v-model="selectedResultModal" height="100%">
      <v-card height="100%" class="px-5 py-5">
        <v-card-title>
          <v-row>
            <v-col> </v-col>
            <v-col class="text-right py-0">
              <XIcon @click="selectedResultModal = false" class="cursor-pointer" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <FormTabRow :fields="selectedResultFields" v-for="table in selectedResult.logs" :items="table.tables"> </FormTabRow>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
