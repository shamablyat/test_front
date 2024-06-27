<script setup lang="ts">
import { notify } from "@kyvg/vue3-notification";
import { computed, reactive, ref } from "vue";
import { useQuestionnaire } from "../store/useQuestionnaire";
import { GetQuestionnaireAnswers, GetQuestionnaireGroups, GetQuestionnaireQuestions, IUseQuestionnaireAlgorithm } from "../types";
import { useManualStore } from "@/app/config/store/Manual";
import QuestionInput from "./QuestionInput.vue";
import Algorithm from "./Algorithm.vue";
import { useFormatter } from "@/utils/helpers/formatter";
import { InfinityIcon } from "vue-tabler-icons";
import Constraints from "./Constraints.vue";
import i18n from "@/app/config/i18n";

interface IProps {
  isView?: boolean;
}

defineProps<IProps>();

const store = useQuestionnaire();
const manual = useManualStore();

interface IIndexes {
  groupIndex: null | number;
  questionIndex: null | number;
  answerIndex: null | number;
}

const isAlgorithm = ref<boolean>(false);
const selectedQuestionGroup = ref<GetQuestionnaireGroups | null>(null);
const selectedQuestion = ref<GetQuestionnaireQuestions | null>(null);
const selectedAnswer = ref<GetQuestionnaireAnswers | null>(null);

const deleteModal = ref<boolean>(false);
const constraintsModal = ref<boolean>(false);

const indexes: IIndexes = reactive({
  groupIndex: null,
  questionIndex: null,
  answerIndex: null
});

const isAddAnswer = computed(() => {
  return (type: number | null) => {
    if (type === 3) {
      return false;
    }
    return true;
  };
});

const addAnswer = async (groupIndex: number, questionIndex: number, answerType: number | null) => {
  if (!answerType) {
    notify({
      // @ts-ignore
      text: i18n.global.t("selectAnswerType"),
      type: "warn"
    });
    return;
  }
  store.addAnswer(groupIndex, questionIndex);
};

const saveCondition = (value: IUseQuestionnaireAlgorithm[]) => {
  if (store.data) {
    let list = [];
    list.push(...store.data.eldAlgorithms, ...value);

    const key = "eldQuestionnaireQuestionId2Str";

    store.data.eldAlgorithms = [...new Map(list.map((item) => [item[key], item])).values()];
  }
};

const { removeItemFromArray } = useFormatter();

const checkToHasAlgorithm = (): number | null => {
  let index = null;
  if (store.getData) {
    store.getData.eldAlgorithms.forEach((algorithm, algorithmIndex) => {
      if (algorithm.eldQuestionnaireQuestionId2Str === selectedQuestion.value?.id2Str) {
        return (index = algorithmIndex);
      }
      algorithm.tables.forEach((t) => {
        if (t.eldQuestionnaireQuestionId2Str === selectedQuestion.value?.id2Str) {
          return (index = algorithmIndex);
        }
        if (selectedAnswer.value?.id2Str === t.eldQuestionnaireAnswer) {
          return (index = algorithmIndex);
        }
      });
    });
  }

  return index;
};

const deleteQuestionAnswerAlgorithm = () => {
  if (store.getData?.eldAlgorithms) {
    if (indexes.answerIndex !== null) {
      if (indexes.groupIndex !== null && indexes.questionIndex !== null) {
        store.deleteAnswer(indexes.groupIndex, indexes.questionIndex, indexes.answerIndex);
      }
    } else {
      if (indexes.groupIndex !== null && indexes.questionIndex !== null) {
        store.deleteQuestion(indexes.groupIndex, indexes.questionIndex);
      }
    }
    const index = checkToHasAlgorithm();
    if (index !== null) {
      removeItemFromArray(store.getData.eldAlgorithms, index);
    }
  }
};
const canShowAlgorithmIcon = computed(() => {
  return (id2Str: string) => {
    return store.getData?.eldAlgorithms.some((el) => el.eldQuestionnaireQuestionId2Str == id2Str);
  };
});

const saveConstraints = (value: any[]) => {
  if (store.data && indexes.groupIndex !== null && indexes.questionIndex !== null) {
    store.data.eldQuestionnaireGroups[indexes.groupIndex].eldQuestionnaireQuestions[indexes.questionIndex].constraints = value;
  }

  constraintsModal.value = false;
};

const clearAlgorithmsOnChangeAnswerTemplate = (question: GetQuestionnaireQuestions) => {
  question.constraints = [];
  if (store.getData && store.getData.eldAlgorithms.length > 0) {
    store.getData.eldAlgorithms.forEach((algorithm, algorithmIndex) => {
      if (algorithm.eldQuestionnaireQuestionId2Str === question.id2Str) {
        if (store.getData) {
          removeItemFromArray(store.getData?.eldAlgorithms, algorithmIndex);
        }
      } else {
        algorithm.tables.forEach((t, tIndex) => {
          if (t.eldQuestionnaireQuestionId2Str === question.id2Str && store.getData) {
            removeItemFromArray(algorithm.tables, tIndex);
          }
        });

        if (algorithm.tables.length === 0 && store.getData) {
          removeItemFromArray(store.getData?.eldAlgorithms, algorithm);
        }
      }
    });
  }
};
</script>

<template>
  <div>
    <!-- QUESTION GROUP #####-->
    <v-list class="px-2 py-2 mt-4" v-for="(group, groupIndex) in store.getData?.eldQuestionnaireGroups">
      <v-list-group class="align-center justify-center px-3">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="`${group.title || $t('questionGroupTitle')}, ${$t('questionsCount')} - ${group.eldQuestionnaireQuestions.length}.`"
          >
            <template #prepend>
              {{ groupIndex + 1 }}.
              <div class="mr-3">
                <v-tooltip activator="parent" location="top">
                  {{ $t("QuestionGroup") }}
                </v-tooltip>
                <v-icon class="ml-3">mdi-comment-question-outline </v-icon>
              </div>
            </template>
            <template #append="{ isActive }">
              <div v-if="isActive">
                <v-icon>mdi-arrow-up</v-icon>
                <v-tooltip activator="parent" location="top">
                  {{ $t("hide") }}
                </v-tooltip>
              </div>
              <div v-else>
                <v-icon>mdi-arrow-down</v-icon>
                <v-tooltip activator="parent" location="top">
                  {{ $t("show") }}
                </v-tooltip>
              </div>
              <div>
                <v-icon @click.self="store.deleteGroup(groupIndex)">mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">
                  {{ $t("Delete") }}
                </v-tooltip>
              </div>
            </template>
          </v-list-item>
        </template>
        <QuestionInput
          :language-list="manual.LanguageList"
          required
          :order-code="groupIndex + 1"
          :placeholder="$t('questionGroupTitle')"
          :label="$t('questionGroupTitle')"
          column-name="title"
          :view="isView"
          v-model:value="group.title"
          v-model:translates="group.translates"
          @delete-tab-row="store.deleteGroup(groupIndex)"
        />

        <v-divider class="my-2"></v-divider>
        <div class="align-center px-10" v-for="(question, questionIndex) in group.eldQuestionnaireQuestions">
          <QuestionInput
            :language-list="manual.LanguageList"
            :order-code="[
              {
                parent: groupIndex + 1,
                child: [
                  {
                    parent: questionIndex + 1
                  }
                ]
              }
            ]"
            required
            :placeholder="$t('questionText')"
            :label="`${$t('questionText')}`"
            :view="isView"
            column-name="question_text"
            v-model:value="question.questionText"
            v-model:translates="question.translates"
            @delete-tab-row="store.deleteQuestion(groupIndex, questionIndex)"
          >
            <template #action>
              <v-sheet class="ml-auto" v-if="isView ? canShowAlgorithmIcon(question.id2Str) : true">
                <v-tooltip activator="parent" location="top">
                  {{ $t("Condition") }}
                </v-tooltip>
                <InfinityIcon
                  class="cursor-pointer"
                  @click="
                    () => {
                      isAlgorithm = true;
                      selectedQuestionGroup = group;
                      selectedQuestion = question;
                    }
                  "
                />
              </v-sheet>
            </template>
            <template #delete>
              <v-sheet
                class="cursor-pointer"
                @click="
                  () => {
                    selectedQuestion = question;
                    checkToHasAlgorithm();

                    indexes.groupIndex = groupIndex;
                    indexes.questionIndex = questionIndex;
                    indexes.answerIndex = null;

                    deleteModal = true;
                  }
                "
              >
                <v-tooltip activator="parent" location="top">
                  {{ $t("Delete") }}
                </v-tooltip>
                <v-icon>mdi-delete</v-icon>
              </v-sheet>
            </template>
          </QuestionInput>
          <v-row class="align-center py-4" style="gap: 0.625rem">
            <div v-if="!isView">
              <v-btn :text="$t('addQuestionBefore')" color="info" @click="store.addQuestionBeforeAfter(groupIndex, questionIndex)" />
            </div>
            <div class="mx-3" v-if="!isView">
              <v-btn :text="$t('addQuestionAfter')" color="info" @click="store.addQuestionBeforeAfter(groupIndex, questionIndex + 1)" />
            </div>
            <div>
              <v-btn
                v-if="question.eldQuestionnaireAnswers && question.eldQuestionnaireAnswers.length > 0 && question.answerTypeId === 2"
                :text="$t('constraints')"
                color="info"
                @click="
                  () => {
                    constraintsModal = true;
                    selectedQuestion = question;
                    indexes.groupIndex = groupIndex;
                    indexes.questionIndex = questionIndex;
                  }
                "
              />
            </div>
          </v-row>
          <!-- <v-row class="mb-4">
            <v-btn
              class="mx-2 mt-6"
              v-if="!isView"
              :text="$t('addQuestionBefore')"
              color="info"
              @click="store.addQuestionBeforeAfter(groupIndex, questionIndex)"
            />
            <v-btn
              class="mx-2 mt-6"
              v-if="!isView"
              :text="$t('addQuestionAfter')"
              color="info"
              @click="store.addQuestionBeforeAfter(groupIndex, questionIndex + 1)"
            />
            <v-btn
              class="mx-2 mt-6"
              v-if="question.eldQuestionnaireAnswers && question.eldQuestionnaireAnswers.length > 0 && question.answerTypeId === 2"
              :text="$t('constraints')"
              color="info"
              @click="
                () => {
                  constraintsModal = true;
                  selectedQuestion = question;
                  indexes.groupIndex = groupIndex;
                  indexes.questionIndex = questionIndex;
                }
              "
            />
          </v-row> -->

          <v-divider class="my-2"></v-divider>

          <!-- ANSWER TYPE -->
          <v-row class="px-4 align-center justify-center mt-2 mb-4" v-if="!isView">
            <v-col
              cols="12"
              lg="2"
              md="4"
              v-for="(answerType, answerTypeIndex) in store.GetAnswerTypeSelectList"
              class="py-2"
              :class="[
                {
                  'text-primary': answerType.value === question.answerTypeId,
                  'd-none': answerTypeIndex === 2 && answerType.value === 3 && question.questionAnswerTemplateId
                },
                `cursor-${answerTypeIndex === 2 && answerType.value === 3 && question.questionAnswerTemplateId ? 'default' : 'pointer'}`
              ]"
              @click="
                () => {
                  if (answerType.value === 3 && question.questionAnswerTemplateId) {
                    return;
                  }
                  store.selectAnswerType(groupIndex, questionIndex, answerType);
                }
              "
            >
              <v-icon v-if="answerType.value == 1">mdi-checkbox-blank-circle-outline</v-icon>
              <v-icon v-if="answerType.value == 2">mdi-checkbox-blank-outline</v-icon>
              <v-icon v-if="answerType.value == 3">mdi-format-color-text</v-icon>

              {{ answerType.text }}
            </v-col>
            <v-col cols="12" lg="3" class="py-0">
              <form-checkbox v-model="question.isRequired" :label="$t('questionRequired')"> </form-checkbox>
            </v-col>
            <v-col cols="12" lg="3" class="py-0">
              <form-select
                v-if="question.answerTypeId !== 3"
                :list="store.getQuestionAnswerTemplate"
                v-model="question.questionAnswerTemplateId"
                :label="$t('QuestionAnswerTemplate')"
                noSearch
                clearable
                @clear="clearAlgorithmsOnChangeAnswerTemplate(question)"
                @update:model-value="
                    (val:number) =>
                    store.acceptAnswersFromTemplate(
                        groupIndex,
                        questionIndex,
                        val
                      )
                  "
              >
              </form-select>
            </v-col>
          </v-row>

          <!-- start answers -->
          <v-col class="ml-5">
            <v-row v-for="(answer, answerIndex) in question.eldQuestionnaireAnswers">
              <v-col md="10" sm="9">
                <QuestionInput
                  :language-list="manual.LanguageList"
                  class="w-100"
                  :view="isView"
                  required
                  :order-code="[
                    {
                      parent: groupIndex + 1,
                      child: [
                        {
                          parent: questionIndex + 1,
                          child: [
                            {
                              parent: answerIndex + 1
                            }
                          ]
                        }
                      ]
                    }
                  ]"
                  :placeholder="$t('answerText')"
                  :label="$t('answerText')"
                  column-name="answer_text"
                  v-model:value="answer.answerText"
                  v-model:translates="answer.translates"
                  hide-plus
                  @delete-tab-row="store.deleteAnswer(groupIndex, questionIndex, answerIndex)"
                >
                  <template #delete>
                    <v-sheet
                      class="cursor-pointer"
                      @click="
                        () => {
                          selectedAnswer = answer;
                          indexes.groupIndex = groupIndex;
                          indexes.questionIndex = questionIndex;
                          indexes.answerIndex = answerIndex;
                          checkToHasAlgorithm();
                          deleteModal = true;
                        }
                      "
                    >
                      <v-tooltip activator="parent" location="top">
                        {{ $t("Delete") }}
                      </v-tooltip>
                      <v-icon>mdi-delete</v-icon>
                    </v-sheet>
                  </template>
                </QuestionInput>
              </v-col>
              <v-col md="2" sm="3">
                <form-input v-if="!isView" required type="number" v-model="answer.ball" :canAddZero="true" :label="$t('ball')" />
                <v-label v-else> {{ $t("ball") }} - {{ answer.ball }} </v-label>
              </v-col>
            </v-row>
            <v-btn
              v-if="isAddAnswer(question.answerTypeId) && !question.questionAnswerTemplateId && !isView"
              color="success"
              @click="addAnswer(groupIndex, questionIndex, question.answerTypeId)"
            >
              {{ $t("AddAnswer") }}
            </v-btn>
          </v-col>

          <!-- end answers -->
        </div>

        <v-btn class="py-2 mt-3" @click="store.addQuestion(groupIndex)" color="success" v-if="!isView">
          {{ $t("AddQuestion") }}
        </v-btn>
      </v-list-group>
    </v-list>
    <!-- QUESTION GROUP #####-->

    <v-dialog v-model="isAlgorithm" height="100%">
      <Algorithm
        class="h-100"
        v-if="store.getData && selectedQuestionGroup && selectedQuestion"
        :question="selectedQuestion"
        :data-algorithms="store.getData?.eldAlgorithms"
        :group="selectedQuestionGroup"
        v-model:model-value="isAlgorithm"
        @save="saveCondition"
        :view="isView"
      />
    </v-dialog>

    <v-dialog v-model="deleteModal" width="450">
      <v-card>
        <v-card-text class="text-center">
          <div v-html="$t('attention')"></div>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn
                color="error"
                variant="flat"
                block
                @click="
                  () => {
                    deleteModal = false;
                    selectedAnswer = null;
                    selectedQuestion = null;
                  }
                "
              >
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="success"
                variant="flat"
                block
                @click="
                  () => {
                    deleteModal = false;
                    deleteQuestionAnswerAlgorithm();
                  }
                "
              >
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="constraintsModal" height="100%">
      <Constraints
        class="h-100"
        v-if="selectedQuestion"
        :isView="isView"
        v-model="constraintsModal"
        :answers="selectedQuestion.eldQuestionnaireAnswers"
        :constrains="selectedQuestion.constraints"
        @saveConstraints="saveConstraints"
      />
    </v-dialog>
  </div>
</template>
