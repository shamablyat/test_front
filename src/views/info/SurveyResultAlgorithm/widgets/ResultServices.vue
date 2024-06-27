<script setup lang="ts">
import { useSurveyResultAlgorithm } from "../store/useSurveyResultAlgorithm";
import {
  SurveyResultAlgorithmQuestionnaireAnswer,
  SurveyResultAlgorithmQuestionnaireGroups,
  SurveyResultAlgorithmQuestionnaireQuestions
} from "../types";
import { SubmitEventPromise } from "vuetify";
import i18n from "@/app/config/i18n";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { ISelectList, ITableActions } from "@/models/basic";
import { notify } from "@kyvg/vue3-notification";

interface IProps {
  actions?: ITableActions;
  isView?: boolean;
  title?: string;
}

defineProps<IProps>();

const store = useSurveyResultAlgorithm();
store.setElderServicesSelectList();

const setGroup = (value: SurveyResultAlgorithmQuestionnaireGroups) => {
  if (value) {
    store.questionsList = [];
    store.answersList = [];

    store.resultServices.eldQuestionnaireQuestionId = null;
    store.resultServices.eldQuestionnaireQuestion = "";
    store.resultServices.eldQuestionnaireAnswerId = null;
    store.resultServices.eldQuestionnaireAnswer = "";

    store.resultServices.eldQuestionnaireGroup = value.title;
    store.resultServices.eldQuestionnaireGroupId = value.id;
  }
};
const setQuestions = (value: SurveyResultAlgorithmQuestionnaireQuestions) => {
  if (value) {
    store.answersList = [];
    store.resultServices.eldQuestionnaireAnswerId = null;
    store.resultServices.eldQuestionnaireAnswer = "";

    store.resultServices.eldQuestionnaireQuestion = value.questionText;
    store.resultServices.eldQuestionnaireQuestionId = value.id;
  }
};
const setAnswer = (value: SurveyResultAlgorithmQuestionnaireAnswer) => {
  if (value) {
    store.resultServices.eldQuestionnaireAnswer = value.answerText;
    store.resultServices.eldQuestionnaireAnswerId = value.id;
  }
};
const setField = (value: ISelectList, key: string) => {
  if (value) {
    // @ts-ignore
    store.resultServices[key] = value.text;
    // @ts-ignore
    store.resultServices[key + "Id"] = value.value;
  }
};

const fields = [
  {
    key: "eldQuestionnaireGroup",
    // @ts-ignore
    label: i18n.global.t("QuestionGroup")
  },
  {
    key: "eldQuestionnaireQuestion",
    label: i18n.global.t("questionnaireQuestion")
  },
  {
    key: "eldQuestionnaireAnswer",
    label: i18n.global.t("questionnaireAnswer")
  },
  {
    key: "eldService",
    label: i18n.global.t("ElderlyService")
  },
  {
    key: "action",
    label: i18n.global.t("actions")
  }
];

const addRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    if (store.data) {
      if (!store.data.eldQuestionnaireId) {
        notify({
          // @ts-ignore
          text: i18n.global.t("selectQuestionnaire"),
          type: "warn"
        });
        return;
      }
      store.addRow("resultServices");
    }
  }
};
</script>

<template>
  <div v-if="store.data">
    <h2 v-if="title">{{ $t(title) }}</h2>
    <FormTabRow
      :fields="fields"
      :items="store.data.resultServices"
      @editTabRow="(val) => store.editRow(val, 'resultServices')"
      @deleteTabRow="(val) => store.deleteRow(val, 'resultServices')"
      v-model:editIndex="store.editIndex"
      :actions="actions"
      @clear-tab-row="store.clearResultServices()"
    >
      <v-form @submit.prevent="addRow" v-if="!isView">
        <v-row class="align-center mb-3">
          <v-col cols="12" lg="3" md="6" class="py-1">
            <form-select
              required
              :list="store.groupsList"
              v-model="store.resultServices.eldQuestionnaireGroupId"
              :label="$t('QuestionGroup')"
              itemTitle="title"
              itemValue="id"
              returnObject
              @update:model-value="(val:SurveyResultAlgorithmQuestionnaireGroups) => {
        setGroup(val)
        if(val.id){
            store.setQuestionnaireQuestions(val.id)
        }
      }"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-1">
            <form-select
              required
              :list="store.questionsList"
              v-model="store.resultServices.eldQuestionnaireQuestionId"
              :label="$t('questionnaireQuestion')"
              itemTitle="questionText"
              itemValue="id"
              returnObject
              @update:model-value="(val:SurveyResultAlgorithmQuestionnaireQuestions) => {
        setQuestions(val)
        if(val.id){
            store.setQuestionnaireAnswers(val.id)
        }
      }"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-1">
            <form-select
              required
              :list="store.answersList"
              v-model="store.resultServices.eldQuestionnaireAnswerId"
              :label="$t('questionnaireAnswer')"
              itemTitle="answerText"
              itemValue="id"
              returnObject
              @update:model-value="(val:SurveyResultAlgorithmQuestionnaireAnswer) => setAnswer(val)"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-1">
            <form-select
              required
              :list="store.elderlyServices"
              v-model="store.resultServices.eldServiceId"
              :label="$t('ElderlyService')"
              returnObject
              @update:model-value="(val:ISelectList) => setField(val, 'eldService')"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-1 text-right ml-auto">
            <v-btn :text="store.editIndex > -1 ? $t('Save') : $t('AddRow')" :color="store.editIndex > -1 ? 'success' : 'info'" type="submit" />
          </v-col>
        </v-row>
      </v-form>
    </FormTabRow>
  </div>
</template>
