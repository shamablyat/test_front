<script setup lang="ts">
import { IFields } from "@/models/basic";
import { computed, onBeforeUnmount, ref } from "vue";
import { XIcon } from "vue-tabler-icons";
import { GetQuestionnaireGroups, GetQuestionnaireQuestions, IUseQuestionnaireAlgorithm, IUseQuestionnaireAlgorithmTables } from "../types";
import { useQuestionnaire } from "../store/useQuestionnaire";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { SubmitEventPromise } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/app/config/i18n";

interface IProps {
  dataAlgorithms: IUseQuestionnaireAlgorithm[];
  group: GetQuestionnaireGroups;
  question: GetQuestionnaireQuestions;
  view?: boolean;
}

const props = defineProps<IProps>();
const store = useQuestionnaire();
const editIndex = ref<number>(-1);

const emits = defineEmits<{
  (e: "save", value: IUseQuestionnaireAlgorithm[]): void;
  (e: "update:model-value", value: any): void;
}>();

const fields: IFields[] = [
  { key: "eldQuestionnaireQuestion", label: "questionnaireQuestion" },
  { key: "eldQuestionnaireAnswer", label: "questionnaireAnswer" },
  { key: "isEqual", label: "isEqual" },
  { key: "action", label: "actions" }
];

const answers = ref<any[]>([]);

const algorithms = ref<IUseQuestionnaireAlgorithm[]>([
  {
    id: 0,
    isAny: false,
    eldQuestionnaireQuestionId2Str: props.question.id2Str,
    tables: []
  }
]);

if (props.dataAlgorithms && props.dataAlgorithms.length > 0) {
  for (const item of props.dataAlgorithms) {
    for (const al of algorithms.value) {
      if (item.eldQuestionnaireQuestionId2Str === al.eldQuestionnaireQuestionId2Str) {
        algorithms.value = props.dataAlgorithms;
      }
    }
  }
}

const filteredQuestions = computed(() => {
  let list: GetQuestionnaireQuestions[] = [];
  let uniqueList: GetQuestionnaireQuestions[] = [];
  const index = props.group.eldQuestionnaireQuestions.indexOf(props.question);

  if (props.group) {
    props.dataAlgorithms.forEach((a) => {
      a.tables.forEach((t) => {
        if (t.eldQuestionnaireQuestionId2Str === props.question.id2Str) {
          props.group.eldQuestionnaireQuestions.forEach((q, qIndex) => {
            if (a.eldQuestionnaireQuestionId2Str !== q.id2Str && q.id2Str !== props.question.id2Str && q.answerTypeId !== 3) {
              if (index == 0) {
                list = [];
                return;
              }
              if (index >= qIndex) {
                list.push(q);
              }
            }
          });
        }
      });
    });

    const key = "id2Str";
    uniqueList = [...new Map(list.map((item) => [item[key], item])).values()];
    if (index > 0 && list && list.length === 0) {
      props.group.eldQuestionnaireQuestions.forEach((q, elindex) => {
        if (index >= elindex && q.id2Str !== props.question.id2Str && q.answerTypeId !== 3) {
          list.push(q);
        }
      });
    }
  }

  const key = "id2Str";
  uniqueList = [...new Map(list.map((item) => [item[key], item])).values()];

  return uniqueList;
});

const setQuestion = (question: string) => {
  const obj = filteredQuestions.value.find((el) => el.id2Str === question);
  if (obj) {
    store.algorithmTables.eldQuestionnaireQuestion = obj.questionText;
    store.algorithmTables.eldQuestionnaireAnswerId2Str = "";
    store.algorithmTables.eldQuestionnaireAnswer = "";
    setAnswers(obj.eldQuestionnaireAnswers);
  }
};

const setAnswers = (questionnaireAnswers: any[]) => {
  answers.value = questionnaireAnswers;
};

const setAnswer = (answer: string) => {
  const obj = answers.value.find((el) => el.id2Str === answer);
  if (obj) {
    store.algorithmTables.eldQuestionnaireAnswerId2Str = obj.id2Str;
    store.algorithmTables.eldQuestionnaireAnswer = obj.answerText;
  }
};

const addRow = async (submit: SubmitEventPromise, index: number) => {
  const { valid } = await submit;
  if (valid && store.data) {
    if (algorithms.value[index].tables.some((el) => el.eldQuestionnaireAnswerId2Str == store.getAlgorithmTables.eldQuestionnaireAnswerId2Str)) {
      notify({
        // @ts-ignore
        text: i18n.global.t("answerTextIsAccepted"),
        type: "warn"
      });
      return;
    }

    if (editIndex.value > -1) {
      Object.assign(algorithms.value[index].tables[editIndex.value], JSON.parse(JSON.stringify(store.getAlgorithmTables)));
    } else {
      if (
        filteredQuestions.value.some(
          (question) =>
            question.id2Str === store.getAlgorithmTables.eldQuestionnaireQuestionId2Str &&
            question.answerTypeId === 1 &&
            algorithms.value[index].tables.some((al) => al.eldQuestionnaireQuestionId2Str === question.id2Str) &&
            !algorithms.value[index].isAny
        )
      ) {
        notify({
          // @ts-ignore
          text: i18n.global.t("selectedQuestionIsSingle"),
          type: "warn"
        });
        return;
      }

      algorithms.value[index].tables.push(JSON.parse(JSON.stringify(store.getAlgorithmTables)));
    }
    editIndex.value = -1;
    store.flushAlgorithmTables();
  }
};

const editRow = (item: IUseQuestionnaireAlgorithmTables, index: number) => {
  editIndex.value = algorithms.value[index].tables.indexOf(item);
  store.algorithmTables = JSON.parse(JSON.stringify(item));
  const obj = filteredQuestions.value.find((el) => el.id2Str === item.eldQuestionnaireQuestionId2Str);

  obj && setAnswers(obj.eldQuestionnaireAnswers);
};

const deleteRow = (index: number, algorithmIndex: number) => {
  algorithms.value[algorithmIndex].tables.splice(index, 1);
};

const save = () => {
  // if(algorithms.value[])
  const item = algorithms.value.find((el) => el.eldQuestionnaireQuestionId2Str === props.question.id2Str);
  if (item && item.tables.length === 0) {
    notify({
      // @ts-ignore
      text: i18n.global.t("mustAddTable"),
      type: "warn"
    });
    return;
  }

  emits("save", algorithms.value);
  emits("update:model-value", false);
};

onBeforeUnmount(() => {
  store.flushAlgorithm();
  store.flushAlgorithmTables();
});
</script>

<template>
  <v-card height="100%" class="px-5 py-5">
    <v-card-title>
      <v-row>
        <v-col>
          <h5>{{ $t("Condition") }}</h5>
        </v-col>
        <v-col class="text-right">
          <XIcon class="cursor-pointer" @click="emits('update:model-value', false)" />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="overflow-auto">
      <template v-for="(algorithm, algorithmIndex) in algorithms">
        <template v-if="algorithm.eldQuestionnaireQuestionId2Str === props.question.id2Str">
          <form-checkbox v-model="algorithm.isAny" :label="$t('isAny')" :disabled="view" />
          <FormTabRow
            :fields="fields"
            :items="algorithm.tables"
            :actions="{
              isDelete: view ? false : true,
              isEdit: view ? false : true
            }"
            @edit-tab-row="(val) => editRow(val, algorithmIndex)"
            @delete-tab-row="(val) => deleteRow(val, algorithmIndex)"
            @clear-tab-row="store.flushAlgorithmTables"
            v-model:edit-index="editIndex"
          >
            <v-form @submit.prevent="addRow($event, algorithmIndex)" v-if="!view">
              <v-row class="align-center mb-3">
                <v-col cols="12" lg="3" md="6">
                  <form-select
                    v-model="store.getAlgorithmTables.eldQuestionnaireQuestionId2Str"
                    :list="filteredQuestions"
                    itemTitle="questionText"
                    itemValue="id2Str"
                    @update:model-value="setQuestion"
                  />
                </v-col>
                <v-col cols="12" lg="3" md="6" class="py-0">
                  <form-select
                    v-model="store.getAlgorithmTables.eldQuestionnaireAnswerId2Str"
                    :list="answers"
                    itemTitle="answerText"
                    itemValue="id2Str"
                    @update:model-value="setAnswer"
                  />
                </v-col>
                <v-col cols="12" lg="1" md="6" class="py-0">
                  <form-checkbox v-model="store.getAlgorithmTables.isEqual" :label="$t('isEqual')"> </form-checkbox>
                </v-col>
                <v-col cols="12" lg="3" md="6" class="py-0">
                  <v-btn type="submit" :color="editIndex > -1 ? 'success' : 'info'">
                    {{ editIndex > -1 ? $t("Save") : $t("AddRow") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
            <template #isEqual="{ item }">
              <td>
                {{ item.isEqual ? $t("yes") : $t("no") }}
              </td>
            </template>
          </FormTabRow>
        </template>
      </template>
    </v-card-text>

    <v-card-actions class="mt-auto">
      <v-btn :text="$t('Back')" variant="flat" color="error" @click="emits('update:model-value', false)" />
      <v-spacer />
      <v-btn :text="$t('Save')" color="success" variant="flat" @click="save" v-if="!view" />
    </v-card-actions>
  </v-card>
</template>
