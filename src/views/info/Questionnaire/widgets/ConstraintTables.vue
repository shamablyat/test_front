<script setup lang="ts">
import { computed, ref } from "vue";
import {
  GetQuestionnaireAnswers,
  IConstrains,
  IConstrainsTablesEqual,
} from "../types";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { SubmitEventPromise } from "vuetify";

interface IProps {
  constraint: IConstrains;
  answers: GetQuestionnaireAnswers[];
  isView?: boolean;
}
type TableType = "selectedTables" | "conditionedTables";

const props = defineProps<IProps>();

const emits = defineEmits<{
  (e: "setConstraint", value: IConstrains): void;
}>();

const item = ref<IConstrains>({
  isAny: false,
  conditionedTables: [],
  id: 0,
  selectedTables: [],
});

const actions = {
  isDelete: true,
};
const filteredAnswers = computed(() => {
  let selectedTableAnswers: GetQuestionnaireAnswers[] = [];
  let conditionTableAnswers: GetQuestionnaireAnswers[] = [];

  conditionTableAnswers = props.answers.filter(
    (el) =>
      !item.value.selectedTables.some(
        (s) => s.eldQuestionnaireAnswerId2Str == el.id2Str
      ) &&
      el.id2Str !== selectedTables.value.eldQuestionnaireAnswerId2Str &&
      !item.value.conditionedTables.some(
        (c) => c.eldQuestionnaireAnswerId2Str == el.id2Str
      )
  );

  selectedTableAnswers = props.answers.filter(
    (el) =>
      !item.value.conditionedTables.some(
        (c) => c.eldQuestionnaireAnswerId2Str == el.id2Str
      ) &&
      el.id2Str !== constrainsTablesEqual.value.eldQuestionnaireAnswerId2Str &&
      !item.value.selectedTables.some(
        (c) => c.eldQuestionnaireAnswerId2Str == el.id2Str
      )
  );

  return {
    selectedTableAnswers,
    conditionTableAnswers,
  };
});
if (props.constraint) {
  item.value = props.constraint;
}

const selectedTables = ref<IConstrainsTablesEqual>({
  id: 0,
  eldQuestionnaireAnswer: "",
  eldQuestionnaireAnswerId2Str: "",
  isEqual: false,
});

const constrainsTablesEqual = ref<IConstrainsTablesEqual>({
  id: 0,
  eldQuestionnaireAnswer: "",
  eldQuestionnaireAnswerId2Str: "",
  isEqual: false,
});

const tableFields = [
  { key: "isEqual", label: "isEqual" },
  { key: "eldQuestionnaireAnswer", label: "questionnaireAnswer" },
  { key: "action", label: "actions" },
];

const constrainsTablesEqualFields = [
  { key: "eldQuestionnaireAnswer", label: "questionnaireAnswer" },
  { key: "action", label: "actions" },
];

const flushSelectedTables = () => {
  selectedTables.value = {
    id: 0,
    eldQuestionnaireAnswer: "",
    eldQuestionnaireAnswerId2Str: "",
    isEqual: false,
  };
};
const flushConditionTables = () => {
  constrainsTablesEqual.value = {
    id: 0,
    eldQuestionnaireAnswer: "",
    eldQuestionnaireAnswerId2Str: "",
    isEqual: false,
  };
};

const addTable = async (event: SubmitEventPromise, type: TableType) => {
  const { valid } = await event;

  if (valid) {
    if (type === "selectedTables") {
      item.value.selectedTables.push(
        JSON.parse(JSON.stringify(selectedTables.value))
      );
      flushSelectedTables();
    } else if (type == "conditionedTables") {
      item.value.conditionedTables.push(
        JSON.parse(JSON.stringify(constrainsTablesEqual.value))
      );

      flushConditionTables();
    }

    emits("setConstraint", item.value);
  }
};

const deleteTable = (index: number, type: TableType) => {
  if (type == "selectedTables") {
    item.value.selectedTables.splice(index, 1);
  } else if (type == "conditionedTables") {
    item.value.conditionedTables.splice(index, 1);
  }

  emits("setConstraint", item.value);
};

const setSelectedTableAnswer = (value: string) => {
  const obj = props.answers.find((el) => el.id2Str === value);

  if (obj) {
    selectedTables.value.eldQuestionnaireAnswer = obj.answerText;
    constrainsTablesEqual.value.eldQuestionnaireAnswer = "";
    constrainsTablesEqual.value.eldQuestionnaireAnswerId2Str = "";
  }
};

const setConditionTableAnswer = (value: string) => {
  const obj = props.answers.find((el) => el.id2Str === value);

  if (obj) {
    constrainsTablesEqual.value.eldQuestionnaireAnswer = obj.answerText;
  }
};
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" lg="6">
        <v-label :text="$t('selectedTables')" />
        <FormTabRow
          :fields="tableFields"
          :items="item.selectedTables"
          :actions="isView ? {} : actions"
          @delete-tab-row="(val) => deleteTable(val, 'selectedTables')"
        >
          <v-form
            v-if="!isView"
            @submit.prevent="addTable($event, 'selectedTables')"
          >
            <v-row>
              <v-col cols="12" lg="2" sm="4" class="py-0">
                <form-checkbox
                  v-model="selectedTables.isEqual"
                  :label="$t('isEqual')"
                >
                </form-checkbox>
              </v-col>
              <v-col cols="12" lg="4" sm="4" class="py-0">
                <form-select
                  :list="filteredAnswers.selectedTableAnswers"
                  v-model="selectedTables.eldQuestionnaireAnswerId2Str"
                  itemTitle="answerText"
                  itemValue="id2Str"
                  required
                  @update:model-value="setSelectedTableAnswer"
                >
                </form-select>
              </v-col>
              <v-col cols="12" lg="4" sm="4" class="py-0">
                <v-btn :text="$t('AddRow')" color="info" type="submit" />
              </v-col>
            </v-row>
          </v-form>
          <template #isEqual="{ item }">
            <td>{{ item.isEqual ? $t("yes") : $t("no") }}</td>
          </template>
        </FormTabRow>
      </v-col>
      <v-col cols="12" lg="6">
        <v-label :text="$t('conditionedTables')" />
        <FormTabRow
          :fields="constrainsTablesEqualFields"
          :items="item.conditionedTables"
          :actions="isView ? {} : actions"
          @delete-tab-row="(val) => deleteTable(val, 'conditionedTables')"
        >
          <v-form
            v-if="!isView"
            @submit.prevent="addTable($event, 'conditionedTables')"
          >
            <v-row>
              <v-col cols="12" lg="4" sm="4" class="py-0">
                <form-select
                  :list="filteredAnswers.conditionTableAnswers"
                  v-model="constrainsTablesEqual.eldQuestionnaireAnswerId2Str"
                  itemTitle="answerText"
                  itemValue="id2Str"
                  required
                  @update:model-value="setConditionTableAnswer"
                >
                </form-select>
              </v-col>
              <v-col cols="12" lg="4" sm="4" class="py-0">
                <v-btn :text="$t('AddRow')" color="info" type="submit" />
              </v-col>
            </v-row>
          </v-form>
        </FormTabRow>
      </v-col>
    </v-row>
  </div>
</template>
